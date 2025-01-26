<script lang="ts">
	import { browser } from '$app/environment';
	import { unpack } from 'msgpackr/unpack';
	import { tick } from 'svelte';

	let { ws = $bindable(), pending = $bindable() } = $props();

	let messages: object[] = $state([]);
	let elemChat: HTMLElement | undefined = $state();

	const scrollChatBottom = (behavior?: ScrollBehavior): void => {
		if (!browser) return;
		window?.scrollTo({ top: elemChat?.scrollHeight, behavior });
	};

	ws.addEventListener('message', async (event) => {
		// unpack stream response
		const message = unpack(await event.data.arrayBuffer());

		if (message instanceof Array) {
			// Load all messages and scroll down
			message.map(e => e.state = e?.userId === ws.id ? 'send' : 'received');
			messages = message;
			await tick();
			scrollChatBottom('instant');
		} else if (message) {
			// Push new users message on bottom and scroll down
			messages.push({ ...message, state: message?.userId === ws.id ? 'send' : 'received' });
			scrollChatBottom('smooth');
		}
		// Reset form
		pending = false;

	});
</script>

<div bind:this={elemChat}>
	<ul class="bg-primary">
		{#each messages as { role, userId, content, timestamp, state }}
			<li>{role}: {content}</li>
		{/each}
	</ul>
</div>
