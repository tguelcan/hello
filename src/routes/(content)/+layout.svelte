<script lang="ts">
	let { children } = $props();
</script>

<div class="container my-4">
	<div class="prose !max-w-none">
		{@render children()}
	</div>
</div>