import { json } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function GET({ params }) {
	const positions = [];

	switch (params.ticker) {
		case 'NVDA':
			positions.push({
				direction: 'BUY',
				quantity: 2,
				unitCost: 200,
				createdAt: 0
			});
			break;
		case 'VTI':
			positions.push({
				direction: 'BUY',
				quantity: 2,
				unitCost: 100,
				createdAt: 0
			});
			positions.push({
				direction: 'BUY',
				quantity: 5,
				unitCost: 200,
				createdAt: 0
			});
			break;
		case 'MSFT':
			positions.push({
				direction: 'BUY',
				quantity: 10,
				unitCost: 10,
				createdAt: 0
			});
			positions.push({
				direction: 'SELL',
				quantity: 5,
				unitCost: 200,
				createdAt: 0
			});
			break;
		default:
			break;
	}

	return json({ positions });
}
