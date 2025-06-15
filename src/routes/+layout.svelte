<script lang="ts">
	import { Toaster } from 'svelte-sonner';

	import '../app.css';

	const { children } = $props();
</script>

<div class="flex justify-center">
	<div class="my-20 flex w-xs flex-col space-y-2">
		<Toaster position="top-center" richColors />
		<!-- main content goes here -->
		{@render children()}
	</div>
</div>
