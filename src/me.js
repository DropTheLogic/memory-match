import fire from './fire';
import { getRandomName, removeSpaces } from './utils/helperFuncs';

let name = getRandomName();
let nameNoSpaces = removeSpaces(name);

let me = {
	id: nameNoSpaces,
	name,
	imgSize: 64,
	createdAt: new Date().toISOString(),
	status: 'awaiting'
};

const init = async () => {
	await fire.database().ref(`users/${nameNoSpaces}`).set(me);
	let myRef = fire.database().ref(`users/${nameNoSpaces}`);
	myRef.onDisconnect().remove();
}

init();

export default me;
