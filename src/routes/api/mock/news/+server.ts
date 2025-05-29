import { json } from '@sveltejs/kit';
import data from '$lib/mock/data.json';

export function GET() {
	return json(data);
}
