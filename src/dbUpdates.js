import fire from './fire';
import { generateRoomId } from './utils/helperFuncs';
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
	myData.update({hosting: amHost, roomId});
	if (!amHost) {
		db.ref(`rooms/${roomId}`).update({awayPlayerId: me.id});
	}
}
