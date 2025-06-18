import { format, PeriodType } from '@layerstack/utils';

import { type ClassValue, clsx } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number]
	): number => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function formatDate(d: Date): string {
	return format(d, PeriodType.Day, { variant: 'long' });
}

export function formatDateTime(d: Date): string {
	return format(d, PeriodType.DayTime, { variant: 'long' });
}

export function formatNumber(num: number, digits: number): string {
	if (num < 1) {
		return num.toFixed(digits);
	}

	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'k' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'B' }
	];
	const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
	const item = lookup.findLast((item) => num >= item.value);
	return item ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol) : '0';
}

export function toISOStringWithTZ(date: Date): string {
	const tzo = -date.getTimezoneOffset(),
		dif = tzo >= 0 ? '+' : '-',
		pad = function (num: number): string {
			return (num < 10 ? '0' : '') + num;
		};

	return (
		date.getFullYear() +
		'-' +
		pad(date.getMonth() + 1) +
		'-' +
		pad(date.getDate()) +
		'T' +
		pad(date.getHours()) +
		':' +
		pad(date.getMinutes()) +
		':' +
		pad(date.getSeconds()) +
		dif +
		pad(Math.floor(Math.abs(tzo) / 60)) +
		':' +
		pad(Math.abs(tzo) % 60)
	);
}
