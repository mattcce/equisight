import { toast } from 'svelte-sonner';

import { goto } from '$app/navigation';
import { page } from '$app/state';
import { errorStore } from '$lib/states/error.svelte';

export function fatal(errMsg?: string): void {
	toast.error('Fatal error occurred while fetching: are you online?');

	errorStore.errMsg = errMsg;

	goto(`/fatal?redirectTo=${page.url.pathname}`);
}
