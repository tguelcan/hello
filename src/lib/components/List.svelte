<script lang="ts">
	import { browser } from '$app/environment';
	import { unpack } from 'msgpackr/unpack';
	import { tick } from 'svelte';
	import {fly} from "svelte/transition";
	import {marked} from 'marked';

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
	<ul class="chat gap-2 overflow-x-hidden">
		{#each messages as { role, userId, content, timestamp, state }}
			<li
				class="{state === 'send' ? 'chat-out' : 'chat-in'}">
				<div transition:fly={{delay: 75, x: role === 'user' ? 20 : -20}}
						 class="chat-meta">{userId}</div>
				<div transition:fly={{delay: 150, x: role === 'user' ? 20 : -20}}>
						<div class="chat-content prose prose-sm">{@html marked.parse(content)}</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
<style>
    .chat {
        @apply max-w-2xl mx-auto w-full my-4 flex flex-col text-sm;

        .chat-out {
            @apply self-end max-w-xl;

            .chat-meta {
                @apply text-right text-muted text-xs;
            }

            .chat-content {
                @apply bg-base-200/50 py-2 px-3 rounded-md;
            }
        }


        .chat-in {
            @apply self-start max-w-xl;

            .chat-meta {
                @apply text-left text-muted text-xs;
            }

            .chat-content {
                @apply bg-neutral/50 py-2 px-3 rounded-md;
            }
        }


    }
</style>