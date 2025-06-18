export class Holding {
	readonly ticker: string;
	#positions: Position[] = $state([]);

	constructor(ticker: string, openPositions?: Position[]) {
		this.ticker = ticker;
		this.#positions = openPositions || [];
	}

	get totalInvestment(): number {
		return this.#positions.reduce((acc, p) => acc + p.effectiveCost, 0);
	}

	get totalQuantity(): number {
		return this.#positions.reduce((acc, p) => acc + p.effectiveQuantity, 0);
	}

	get averageCost(): number {
		return this.totalInvestment / this.totalQuantity;
	}

	get openPositions(): Position[] {
		return this.#positions;
	}

	totalMarketValueAtUnitPrice(unitPrice: number): number {
		return this.totalQuantity * unitPrice;
	}

	addOpenPosition(position: Position): void {
		this.#positions.push(position);
	}

	removeOpenPosition(position: Position): boolean {
		const index = this.#positions.indexOf(position);

		if (index < 0 || index >= this.#positions.length) {
			return false;
		}

		this.#positions = this.#positions.toSpliced(index, 1);
		return true;
	}
}

export enum Direction {
	BUY,
	SELL
}

export const directionToString = {
	[Direction.BUY]: 'BUY',
	[Direction.SELL]: 'SELL'
};

export class Position {
	readonly direction: Direction;
	readonly quantity: number;
	readonly unitCost: number;
	readonly createdAt: Date;

	constructor(direction: Direction, quantity: number, unitCost: number, createdAt?: Date) {
		this.direction = direction;
		this.quantity = quantity;
		this.unitCost = unitCost;
		this.createdAt = createdAt ?? new Date();
	}

	isBuy(): boolean {
		return this.direction === Direction.BUY;
	}

	isSell(): boolean {
		return this.direction === Direction.SELL;
	}

	get effectiveQuantity(): number {
		return this.direction === Direction.BUY ? this.quantity : -this.quantity;
	}

	get effectiveCost(): number {
		return this.effectiveQuantity * this.unitCost;
	}
}
