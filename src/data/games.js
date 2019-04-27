import { generateRoomId } from '../utils/helperFuncs';

let games = [
	{
		id: generateRoomId(5),
		status: 'full',

	},
	{
		id: generateRoomId(5),
		status: 'waiting for player',

	},
	{
		id: generateRoomId(5),
		status: 'full',

	},
	{
		id: generateRoomId(5),
		status: 'full',

	},
	{
		id: generateRoomId(5),
		status: 'waiting for player',

	}
];

export default games;
