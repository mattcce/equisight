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

export const navContext: NavContext = $state(initNavContext());

function initNavContext(): NavContext {
	const init: NavContext = {
		previous: undefined,
		current: undefined
	};
	return init;
}

export function setNavContext(
	current: { title: string; supplement?: string; route: string },
	previous?: { title: string; route: string }
): void {
	navContext.current = current;
	navContext.previous = previous;
}
