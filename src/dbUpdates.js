import fire from './fire';
import { generateRoomId, getRandomName } from './utils/helperFuncs';
import me from './me';

const db = fire.database();

export function addRoom() {
	const roomId = generateRoomId();

	db.ref(`rooms/${roomId}`).set({
		id: roomId,
		createdAt: new Date().toISOString(),
		gameState: 'waiting for player',
		homePlayerId: me.id
	}).then(() => {
		putMeInRoom(roomId, true);
	});
}

export async function putMeInRoom(roomId, amHost) {
	const myData = await db.ref(`users/${me.id}`);
	let myUpdates = {};

	if (!amHost) {
		let roomUpdates = {
			awayPlayerId: me.id,
			gameState: 'playing'
		};
		// Since I'm the second one here, update room gameState to 'in game'
		db.ref(`rooms/${roomId}`).update(roomUpdates);

		// Update opponent's status as well
		let opponentRef = db.ref(`rooms/${roomId}/homePlayerId`);
		opponentRef.on('value', snapshot => {
			let opponentId = snapshot.val();
			db.ref(`users/${opponentId}`).update({status: 'in game'});
		});
		opponentRef.off('value');

		// Lastly, set my own update
		myUpdates = {status: 'in game', hosting: amHost, roomId};
	}
	else {
		myUpdates = {hosting: amHost, roomId};
	}
	myData.update(myUpdates);
}

export async function changeMyName(string = '') {
	const myData = await db.ref(`users/${me.id}`);
	let name = string ? string : getRandomName();
	let myUpdates = { name };

	myData.update(myUpdates);
}
