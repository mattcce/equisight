import { describe, it, expect } from 'vitest';
import { Holding, Position, Direction } from './holding';

describe('Holding', () => {
	it('should return correct total quantity', () => {
		const holding = new Holding('EXAMPLE', [
			new Position(Direction.BUY, 2, 4),
			new Position(Direction.SELL, 1, 6),
			new Position(Direction.BUY, 3, 2)
		]);

		expect(holding.totalQuantity).toBe(4);
	});

	it('should return correct total market value', () => {
		const holding = new Holding('EXAMPLE', [
			new Position(Direction.BUY, 2, 4),
			new Position(Direction.SELL, 1, 6),
			new Position(Direction.BUY, 3, 2)
		]);

		expect(holding.totalMarketValue).toBe(8);
	});

	it('should return correct average cost', () => {
		const holding = new Holding('EXAMPLE', [
			new Position(Direction.BUY, 2, 4),
			new Position(Direction.SELL, 1, 6),
			new Position(Direction.BUY, 3, 2)
		]);

		expect(holding.averageCost).toBe(2);
	});

	it('should accept new open position', () => {
		const holding = new Holding('EXAMPLE', [
			new Position(Direction.BUY, 2, 4),
			new Position(Direction.SELL, 1, 6),
			new Position(Direction.BUY, 3, 2)
		]);

		expect(holding.totalMarketValue).toBe(8);

		holding.addOpenPosition(new Position(Direction.BUY, 4, 4));

		expect(holding.totalMarketValue).toBe(24);
	});

	it('should allow removal of open position', () => {
		const holding = new Holding('EXAMPLE', [
			new Position(Direction.BUY, 2, 4),
			new Position(Direction.SELL, 1, 6),
			new Position(Direction.BUY, 3, 2),
			new Position(Direction.BUY, 4, 4)
		]);

		expect(holding.totalMarketValue).toBe(24);

		holding.removeOpenPositionAtIndex(2);

		expect(holding.totalMarketValue).toBe(18);
	});

	it('should correctly initialise when not supplied positions at construction', () => {
		const holding = new Holding('EXAMPLE');

		expect(holding.totalMarketValue).toBe(0);
		expect(holding.totalQuantity).toBe(0);
	});
});

describe('Position', () => {
	it('should return positive effective quantity if it is a buy position', () => {
		const position = new Position(Direction.BUY, 2, 4);

		expect(position.effectiveQuantity).toBe(2);
	});

	it('should return positive effective cost if it is a buy position', () => {
		const position = new Position(Direction.BUY, 2, 4);

		expect(position.effectiveCost).toBe(8);
	});

	it('should return negative effective quantity if it is a sell position', () => {
		const position = new Position(Direction.SELL, 2, 4);

		expect(position.effectiveQuantity).toBe(-2);
	});

	it('should return negative effective cost if it is a sell position', () => {
		const position = new Position(Direction.SELL, 2, 4);

		expect(position.effectiveCost).toBe(-8);
	});
});
