import { json } from '@sveltejs/kit';
import data from '$lib/mock/newsdata.json';

export function GET() {
	return json(data);
}
