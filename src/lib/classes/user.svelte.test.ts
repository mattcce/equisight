import { describe, expect, it } from 'vitest';

import { Direction, Position } from './holding.svelte';
import { User } from './user.svelte';

describe('User', () => {
	it('should initially contain no tickers', () => {
		const user = new User('test');
		expect(user.watchlistTickers).toEqual([]);
	});

	it('should accept adding new tickers to watchlist', () => {
		const user = new User('test');
		user.addTicker('TEST1');
		user.addTicker('TEST2');
		user.addTicker('TEST3');

		expect(user.watchlistTickers).toContain('TEST1');
		expect(user.watchlistTickers).toContain('TEST2');
		expect(user.watchlistTickers).toContain('TEST3');
	});

	it('should allow removing ticker from watchlist', () => {
		const user = new User('test');
		user.addTicker('TEST');
		user.removeTicker('TEST');
		expect(user.watchlistTickers).not.toContain('TEST');
	});

	it('should return holdings for a ticker in watchlist with added positions', () => {
		const user = new User('test');
		user.addPosition('TEST', new Position(0, Direction.BUY, 1, 1, new Date(0)));
		expect(user.getHolding('TEST').openPositions).toContainEqual(
			new Position(0, Direction.BUY, 1, 1, new Date(0))
		);
	});

	it('should accept new position for ticker already in watchlist', () => {
		const user = new User('test');
		user.addTicker('TEST');
		user.addPosition('TEST', new Position(0, Direction.BUY, 1, 1, new Date(0)));
		expect(user.getHolding('TEST').openPositions).toContainEqual(
			new Position(0, Direction.BUY, 1, 1, new Date(0))
		);
	});

	it('should accept new position for ticker not already in watchlist', () => {
		const user = new User('test');
		user.addPosition('TEST', new Position(0, Direction.BUY, 1, 1, new Date(0)));
		expect(user.watchlistTickers).toContain('TEST');
		expect(user.getHolding('TEST').openPositions).toContainEqual(
			new Position(0, Direction.BUY, 1, 1, new Date(0))
		);
	});

	it('should create holding automatically for ticker not already in watchlist', () => {
		const user = new User('test');
		user.addTicker('TEST');
		expect(user.getHolding('TEST')).not.toBe(undefined);
	});

	it('should refuse to return holding for ticker not in watchlist', () => {
		const user = new User('test');
		expect(() => user.getHolding('TEST')).toThrowError(Error);
	});
});
