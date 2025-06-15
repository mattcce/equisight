import { Position, Direction } from '$lib/classes/holding.svelte';
import { User } from '$lib/classes/user.svelte';

export const getUser = (): User => {
	const user = new User('example');
	user.addPosition('VTI', new Position(Direction.BUY, 2, 4, new Date(0)));
	user.addPosition('VTI', new Position(Direction.BUY, 2, 6, new Date(0)));
	user.addPosition('NVDA', new Position(Direction.BUY, 2, 4, new Date(0)));
	return user;
};
