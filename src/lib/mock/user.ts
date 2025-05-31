import { User } from '$lib/classes/user';
import { Position, Direction } from '$lib/classes/holding';

export const getUser = (): User => {
	const user = new User('example');
	user.addPosition('VTI', new Position(Direction.BUY, 2, 4));
	user.addPosition('VTI', new Position(Direction.BUY, 2, 6));
	user.addPosition('NVDA', new Position(Direction.BUY, 2, 4));
	return user;
};
