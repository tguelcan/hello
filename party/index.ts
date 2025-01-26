import type * as Party from 'partykit/server';
import { pack, unpack } from 'msgpackr';
import { deepseek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import jwt from "@tsndr/cloudflare-worker-jwt"

const messages: object[] = [];

export default class Server implements Party.Server {
	constructor(readonly room: Party.Room) {}

	static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
		try {
			// TODO: JWT SECRET
			// const issuer = lobby.env.CLERK_ENDPOINT || DEFAULT_CLERK_ENDPOINT;
			// get token from request query string
			const token = new URL(request.url).searchParams.get("token") ?? "";
			const secret = process.env.JWT_SECRET;
			const { payload } = await jwt.verify(token, secret) as {payload: { username: string, room: string }};
			if(!payload) throw new Error("Invalid token")
			// verify the JWT (in this case using clerk)
			// const session = await verifyToken(token, { issuer });
			// pass any information to the onConnect handler in headers (optional)
			// request.headers.set("X-User-ID", session.sub);
			// forward the request onwards on onConnect
			return request;
		} catch (e) {
			// authentication failed!
			// short-circuit the request before it's forwarded to the party
			return new Response("Unauthorized", { status: 401 });
		}
	}

	async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {

		// A websocket just connected!
		console.log(
			`Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
		);

		console.log('ctx.env')
		console.log(ctx.env)

		// let's send a message to the connection
		// conn.send("hello from server");
		const response = pack({
			role: 'assistant',
			userId: 'server',
			content: `Welcome ${conn.id} to ${this.room.id}!`,
			timestamp: new Date()
		});

		const data = await this.room.storage.get('messages');
		const allData = pack(data)
		conn.send(allData);

	}

	async onMessage(message: string, sender: Party.Connection) {
		// as well as broadcast it to all the other connections in the room...
		const user = pack({ role: 'user', userId: sender.id, content: message, timestamp: new Date() });

		// put to history
		messages.push(unpack(user));
		await this.room.storage.put("messages", messages);

		this.room.broadcast(user);

		const { text, response } = await generateText({
			model: deepseek('deepseek-chat'),
			system:
				'You are a participant in a chat within a community. You are always in a funny mood and occasionally comment on what users write. Ideally, you make funny comments about what they write.',
			// Message history - grap last 50 messages
			messages: messages.map((e) => ({ role: e.role, content: `The user ${sender.id} wrote: ${e.content}` })).slice(0, 50)
		});

		const assistant = pack({
			role: 'assistant',
			userId: 'assistant',
			content: text,
			timestamp: response.timestamp
		});

		// put to history
		messages.push(unpack(assistant));
		await this.room.storage.put("messages", messages);

		this.room.broadcast(assistant);
	}
}

Server satisfies Party.Worker;
