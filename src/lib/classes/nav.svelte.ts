import { getContext, setContext } from 'svelte';

export type NavContext = {
	previous?: {
		title: string;
		route: string;
	};
	current?: {
		title: string;
		supplement?: string;
		route: string;
	};
};

export function getNavContext(): NavContext {
	return getContext('nav-context');
}

export function initNavContext(): void {
	const init: NavContext = $state({
		previous: undefined,
		current: undefined
	});
	setContext('nav-context', init);
}

export function setNavContext(
	current: { title: string; supplement?: string; route: string },
	previous?: { title: string; route: string }
): void {
	const navContext = getNavContext();
	navContext.current = current;
	navContext.previous = previous;
}
