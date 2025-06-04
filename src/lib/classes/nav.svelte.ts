import { getContext, setContext } from 'svelte';

export type NavContext = {
	previous?: {
		display: string;
		route: string;
	};
	current?: {
		display: string;
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
	current: { display: string; route: string },
	previous?: { display: string; route: string }
): void {
	const navContext = getNavContext();
	navContext.current = current;
	navContext.previous = previous;
}
