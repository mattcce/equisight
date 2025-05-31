import { Holding, Position } from './holding';

export class User {
	readonly #identifier: string;
	holdings: { [ticker: string]: Holding } = {};

	constructor(identifier: string) {
		this.#identifier = identifier;
	}

	get identifier(): string {
		return this.#identifier;
	}

	getAllHoldingsTickers(): string[] {
		return Object.keys(this.holdings);
	}

	addPosition(ticker: string, position: Position): void {
		if (!Object.prototype.hasOwnProperty.call(this.holdings, ticker)) {
			this.holdings[ticker] = new Holding(ticker);
		}

		this.holdings[ticker].addOpenPosition(position);
	}
}
