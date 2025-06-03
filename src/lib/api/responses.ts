import type { Article, PriceHistoryEntry, TickerInfo } from './types';

export type tickerNewsResponsePayload = {
	articles: Article[];
};

export type tickerInfoResponsePayload = TickerInfo;

export type tickerIntradayResponsePayload = {
	intraday: PriceHistoryEntry[];
};
