import { apiClient } from '$lib/api/mock-client';

import { Direction, Holding, Position } from './holding';

export const userStore = $state({ user: undefined });

export async function initialiseCurrentUser(): void {
	if (userStore.user) {
		return;
	}

	const user = new User('mock');

	const watchlist = await apiClient(`/users/me/watchlist`, { method: 'GET' })
		.then((r) => r.json())
		.then((r) => r.watchlist);

	const holdings = await Promise.all(
		watchlist.map((t) =>
			apiClient(`/users/me/watchlist/${t}`, { method: 'GET' })
				.then((r) => r.json())
				.then((r) => r.positions)
				.then((ps) => {
					const holding = new Holding(t);

					ps.forEach((p) => {
						const direction =
							p.direction === 'BUY'
								? Direction.BUY
								: p.direction === 'SELL'
									? Direction.SELL
									: (() => {
											throw new Error('Invalid direction');
										})();
						const { quantity, unitCost } = p;
						const createdAt = new Date(p.createdAt);

						holding.addOpenPosition(new Position(direction, quantity, unitCost, createdAt));
					});

					return holding;
				})
		)
	);

	holdings.forEach((h) => user.addHolding(h.ticker, h));

	userStore.user = user;
}

export class User {
	readonly #identifier: string;
	#watchlist: { [ticker: string]: Holding } = $state({});

	constructor(identifier: string) {
		this.#identifier = identifier;
	}

	get identifier(): string {
		return this.#identifier;
	}

	get watchlist(): { [ticker: string]: Holding } {
		return this.#watchlist;
	}

	get watchlistTickers(): string[] {
		return Object.keys(this.#watchlist);
	}

	addHolding(ticker: string, holding: Holding): void {
		if (Object.prototype.hasOwnProperty.call(this.watchlist, ticker)) {
			throw new Error('Cannot add multiple holdings to the same ticker.');
		}

		this.watchlist[ticker] = holding;
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

	removeTicker(ticker: string): boolean {
		if (!Object.prototype.hasOwnProperty.call(this.watchlist, ticker)) {
			return false;
		}

		delete this.watchlist[ticker];
		return true;
	}
}
