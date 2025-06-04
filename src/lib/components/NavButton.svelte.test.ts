import { goto } from '$app/navigation';
import NavButton from './NavButton.svelte';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi, beforeEach, describe, expect, it } from 'vitest';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('NavButton', () => {
	const defaultProps = {
		location: '/testroute',
		display: 'TestRoute',
		icon: '/favicon.png'
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('navigates to target page on click', async () => {
		render(NavButton, { ...defaultProps, currentLocation: 'Home' });

		const button = screen.getByRole('button');
		await fireEvent.click(button);

		expect(goto).toHaveBeenCalledWith('/testroute');
	});
});
