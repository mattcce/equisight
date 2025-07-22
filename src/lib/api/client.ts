import { PUBLIC_API_DOMAIN } from '$env/static/public';
import { handleUnauthorised } from '$lib/api/auth.svelte';

import { fatal } from './fatal';

export async function apiClient(route: string, requestInit: RequestInit): Promise<Response> {
	try {
		const response = await window.fetch(`${PUBLIC_API_DOMAIN}${route}`, {
			...requestInit,
			credentials: 'include'
		});

		if (response.status === 401) {
			handleUnauthorised();
		}

		return response;
	} catch (e) {
		fatal(e.message);
		throw e;
	}
}
