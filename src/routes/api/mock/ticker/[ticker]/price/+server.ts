import { json } from '@sveltejs/kit';
import data from '$lib/mock/pricedata.json';

export function GET({ params }) {
	return json({ [params.ticker]: data[params.ticker as keyof typeof data] });
}
