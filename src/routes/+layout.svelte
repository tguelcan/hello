<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex min-h-svh flex-col justify-center">
	{@render children()}
	<footer class="container footer p-4 text-neutral-content mt-auto">
		<aside>
			<p>Copyright © {new Date().getFullYear()} - All right reserved. MIT Licence</p>
		</aside>
		<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
			<a href="https://github.com/tguelcan/hallo" target="_blank">GitHub</a>
			<a href="https://github.com/tguelcan/hallo/blob/master/LICENSE" target="_blank">License (MIT)</a>
			<a href="/legal">Legal notes</a>
		</nav>
	</footer>
</div>