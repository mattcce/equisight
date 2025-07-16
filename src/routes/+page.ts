import { goto } from '$app/navigation';

export async function load(): Promise<void> {
	goto('/news');
}
