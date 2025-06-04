<script lang="ts">
	import { type NavContext, getNavContext } from '$lib/classes/nav.svelte';
	import '../app.css';

	const navContext: NavContext = getNavContext();
</script>

<div class="fixed top-0 left-0 z-1000 w-full bg-gray-100 p-3">
	<div class="flex h-[43px] items-end justify-center">
		<div class="w-xs">
			{#if navContext.previous}
				<a href={navContext.previous.route} aria-label="go back">
					<div class="grow flex flex-row items-center text-xs">
						<svg
							class="inline"
							width="14"
							height="14"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><path
								d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
								fill="currentColor"
								fill-rule="evenodd"
								clip-rule="evenodd"
							></path></svg
						>
						{navContext.previous.display}
					</div>
				</a>
			{/if}
			<div class="grow text-center">
				{navContext.current === undefined ? 'Unknown' : navContext.current.display}
			</div>
		</div>
	</div>
</div>
