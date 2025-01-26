<script lang="ts">
	import { LogOut } from 'lucide-svelte';

	let { children, data } = $props();
</script>

<div class="">
	<div class="navbar bg-base-200/90 backdrop-blur-sm text-neutral-content justify-between sticky top-0 z-10">
		<div class="container justify-between">
			<a class="btn btn-ghost group flex items-center gap-1 transition-colors" href="/">Hallo <div class="transition-transform group-hover:rotate-[0.5rad]">👋</div></a>
			<a href="/{data.room}" class="btn btn-ghost">{data.room}</a>
			<form action="/?/logout" method="POST">
				<button class="btn btn-ghost " type="submit">{data.username}<LogOut size="20" /></button>
			</form>
		</div>
	</div>
	{@render children()}
</div>