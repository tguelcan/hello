<script lang="ts">
	import type { PageProps } from './$types';
	import partySocket from 'partysocket';
	import { PUBLIC_SOCKET_HOST } from '$env/static/public';
	import Composer from '$components/Composer.svelte';
	import List from '$components/List.svelte';

	let { data }: PageProps = $props();

	let ws = $state(new partySocket({
		host: PUBLIC_SOCKET_HOST,
		room: data.user.room,
		// add an optional id to identify the client,
		// if not provided, a random id will be generated
		// note that the id needs to be unique per connection,
		// not per user, so e.g. multiple devices or tabs need a different id
		id: data.user.username,
		query: async () => ({
			token: data.authToken
		})
	}));

	let pending: boolean = $state(false);
</script>
<div class="container max-w-2xl">
	<List bind:ws bind:pending />
	<Composer bind:ws bind:pending />
</div>