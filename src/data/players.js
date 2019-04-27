import { getRandomName, removeSpaces, getRandomInt } from '../utils/helperFuncs';

const numPlayers = 10;

let players = new Array(numPlayers).fill('').map(() => {
	let name = getRandomName();
	let status = getRandomInt(0, 2) ? 'ingame' : 'awaiting';
	let api = 'https://api.adorable.io/avatars';
	let url = `${api}/${72}/${removeSpaces(name)}`;
	return {name, url, status};
})

export default players;
