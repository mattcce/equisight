import { Holding, Position } from './holding';

export class User {
	readonly #identifier: string;
	watchlist: { [ticker: string]: Holding } = {};

	constructor(identifier: string) {
		this.#identifier = identifier;
	}

	get identifier(): string {
		return this.#identifier;
	}

	getAllWatchlistedTickers(): string[] {
		return Object.keys(this.watchlist);
	}

	addPosition(ticker: string, position: Position): void {
		if (!Object.prototype.hasOwnProperty.call(this.watchlist, ticker)) {
			this.watchlist[ticker] = new Holding(ticker);
		}

		this.watchlist[ticker].addOpenPosition(position);
	}

	addTicker(ticker: string): boolean {
		if (Object.prototype.hasOwnProperty.call(this.watchlist, ticker)) {
			return false;
		}

		this.watchlist[ticker] = new Holding(ticker);
		return true;
	}
}
