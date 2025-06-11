import { redirect } from '@sveltejs/kit';

export function load({ cookies, url }): void {
	if (!cookies.get('equisightauth')) {
		redirect(303, `/login?redirectTo=${url.pathname}`);
	}
}
