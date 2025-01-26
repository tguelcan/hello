<script lang="ts">
	import type { PageProps } from './$types';
	import { ChevronRight } from 'lucide-svelte';

	let { data }: PageProps = $props();

	let actualRoom = $derived(data.user.room);

</script>
<div class="container max-w-md space-y-4">
	<h2>Lobby</h2>
	<ul>
		<li>
			<a href="/{actualRoom}" class="btn btn-neutral btn-block flex justify-between"><span>{actualRoom}</span><ChevronRight /></a>
		</li>
	</ul>
	<form action="?/changeRoom" method="POST">
		<label class="input input-bordered flex items-center gap-2">
			<input type="text" name="room" placeholder="Other Room" class="grow" />
			<button type="submit" class="text-neutral-content hover:text-white"><ChevronRight /></button>
		</label>
	</form>
</div>