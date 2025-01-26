<script lang="ts">
	import { SendHorizonal } from 'lucide-svelte';

	let { ws = $bindable(), pending = $bindable() } = $props();
	let composer: HTMLFormElement | undefined = $state();

	// Send message via form
	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		pending = true;

		const formData: FormData = new FormData(composer);
		const message: string = formData.get('message') as string;

		// Ignore empty messages
		if (!message) {
			pending = false;
			return
		}

		// Send to websocket
		ws.send(message);
		// Reset input after send
		composer?.reset();
	};


</script>
<form onsubmit={handleSubmit} bind:this={composer} class="sticky bottom-4 max-w-xl mx-auto mt-4">
	<label class="input input-bordered flex items-center gap-2 rounded-full">
		<input type="text" placeholder="Message" class="grow" name="message" disabled={pending}>
		<button type="submit" class="group">
			{#if pending}
				<span class="loading loading-spinner loading-md"></span>
			{:else}
				<SendHorizonal strokeWidth="1.25" class="text-neutral-content/75 transition-colors group-hover:text-white/75" />
			{/if}
		</button>
	</label>
</form>