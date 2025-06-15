import { json } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function GET() {
	return json({ watchlist: ['NVDA', 'VTI', 'MSFT'] });
}
