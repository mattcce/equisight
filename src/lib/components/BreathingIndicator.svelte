<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	const { isOn, display }: { isOn: boolean; display: string } = $props();
</script>

<Badge class="h-[20px]">
	<span class={['mr-1 -ml-1 animate-pulse text-sm', isOn ? 'text-green-600' : 'text-red-600']}
		>⦁</span
	>
	<span class="text-xs">{display}</span>
</Badge>
