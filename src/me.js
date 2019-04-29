import fire from './fire';
import { getRandomName, removeSpaces } from './utils/helperFuncs';

let name = getRandomName();
let nameNoSpaces = removeSpaces(name);

let me = {
	id: nameNoSpaces,
	name,
	imgSize: 64,
	createdAt: new Date().toISOString(),
	status: 'awaiting',
	matches: 0
};

const init = async () => {
	await fire.database().ref(`users/${nameNoSpaces}`).set(me);
	let myRef = fire.database().ref(`users/${nameNoSpaces}`);

	// Delete my own db entry
	myRef.onDisconnect().remove(() => {
		// TODO: make this work :()
		// If I was in a room, update db to move opponenet back to home
	// 	const roomId = myRef.child('roomId').toString();
	// 	let roomRef = fire.database().ref(`rooms/${roomId}`);
	// 	const roomUpdates = {
	// 		kick: true
	// 	}
	// 	roomRef.update(roomUpdates);
	});
}

init();

export default me;
