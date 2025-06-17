import { Holding, Position } from './holding.svelte';

export class User {
	readonly #identifier: string;
	#watchlist: { [ticker: string]: Holding } = $state({});

	constructor(identifier: string) {
		this.#identifier = identifier;
	}

	get identifier(): string {
		return this.#identifier;
	}

	get watchlistTickers(): string[] {
		return Object.keys(this.#watchlist);
	}

	addTicker(ticker: string): boolean {
		if (ticker in this.#watchlist) {
			return false;
		}

		this.#watchlist[ticker] = new Holding(ticker);
		return true;
	}

	removeTicker(ticker: string): boolean {
		if (!(ticker in this.#watchlist)) {
			return false;
		}

		delete this.#watchlist[ticker];
		return true;
	}

	addPosition(ticker: string, position: Position): void {
		if (!(ticker in this.#watchlist)) {
			this.#watchlist[ticker] = new Holding(ticker);
		}

		this.#watchlist[ticker].addOpenPosition(position);
	}

	removePosition(ticker: string, position: Position): boolean {
		return this.#watchlist[ticker].removeOpenPosition(position);
	}

	getHolding(ticker: string): Holding {
		const holding = this.#watchlist[ticker];

		if (holding === undefined) {
			throw new Error('Attempted to retrieve holding for ticker not in watchlist');
		}

		return holding;
	}
}
