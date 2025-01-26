import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'


export const handle: Handle = async ({ event, resolve }) => {
	const authToken = event.cookies.get('auth')
	if(authToken) {
		const { username, room } = jwt.verify(authToken, JWT_SECRET) as { username: string, room: string };
		// Set User
		event.locals = {
			user: { username, room }
		}
	}

	const response = await resolve(event);
	return response;
};