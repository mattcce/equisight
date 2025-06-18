import { describe, expect, it } from 'vitest';

import { navContext, setNavContext } from './nav.svelte';

describe('NavContext', () => {
	it('should correctly initialise', () => {
		expect(navContext).toEqual({
			previous: undefined,
			current: undefined
		});
	});

	it('should be correctly set', () => {
		setNavContext(
			{ title: 'Title', supplement: 'Supplement', route: '/supplement/title' },
			{ title: 'Previous', route: '/to/other' }
		);

		expect(navContext).toEqual({
			previous: {
				title: 'Previous',
				route: '/to/other'
			},
			current: {
				title: 'Title',
				supplement: 'Supplement',
				route: '/supplement/title'
			}
		});
	});
});
