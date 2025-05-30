import { json } from '@sveltejs/kit';
import data from '$lib/mock/tickerdata.json';

export function GET({ params }) {
	return json(data[params.ticker as keyof typeof data]);
}
