// local storage keys
export const LAST_NEWS_QUERY = 'lastNewsQuery';
export const BACKTESTING_HISTORY = 'backtestingHistory';
export const FAIR_VALUATION_HISTORY = 'fairValuationHistory';
export const GRAHAM_VALUE_HISTORY = 'grahamValueHistory';

export function getLocalStorage<T>(key: string, defaultValue: T): T {
	const item = localStorage.getItem(key);
	return item ? JSON.parse(item) : defaultValue;
}

export function setLocalStorage<T>(key: string, value: T): void {
	localStorage.setItem(key, JSON.stringify(value));
}
