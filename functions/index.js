const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
admin.initializeApp();
firebase.functions().useFunctionsEmulator('http://localhost:3000');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase!");
});

var id = 1;
exports.findOrCreateUserByIP = functions.https.onRequest((req, res) => {
	var userName = req.query.name
	var user = {
		agent: req.header('user-agent'), // User Agent we get from headers
		referrer: req.header('referrer'), //  Likewise for referrer
		ip: req.header('x-forwarded-for') || req.connection.remoteAddress, // Get IP - allow for proxy
		createdAt: new Date().toISOString(),
		id: userName
	};

	var usersRef = admin.database().ref('/users');
	// var snapshot = await admin.database().ref('./users').push({user});
	usersRef.once("value")
		.then((snapshot) => {
			var hasUserId = snapshot.hasChild(`${user.id}`);
			if (!hasUserId) {
				var newSnapshot = db.ref(`users/${user.id}`).set(user);
			}
			return hasUserId ? newSnapshot : 'Id not found';
		}).catch((error) => {
			console.error(error);
		});
	console.log(user);
	res.send(user);
});

exports.generateTiles = functions.https.onRequest((req, res) => {


	res.sendStatus(202);
});

/**
 * Returns random three string "name"
 */
exports.getRandomName = functions.https.onCall(async (data, context) => {
	const adverbLength = 401;
	const adjLength = 1133;
	const nounLength = 877;
	let adverb = await axios.get(`https://memory-match-app.firebaseio.com/api/words/adverbs/data/${getRandomInt(0, adverbLength)}`);
	console.log(adverb);
	// let adj = adjectives[getRandomInt(0, adjLength)];
	// let noun = nouns[getRandomInt(0, nounLength)];
	// return `${titleCase(adverb)} ${titleCase(adj)} ${titleCase(noun)}`;
});

/**
 * Returns title cased word from
 * @param {string} word - word to convert
 */
const titleCase = (word) => word[0].toUpperCase() + word.slice(1).toLowerCase();

/**
 * Returns given string without spaces
 * @param {string} string - word to convert
 */
const removeSpaces = (word) => word.split(' ').join('');

/**
 * Returns random integer between given range
 * @param {integer} min - Minimum integer for range (inclusive)
 * @param {integer} max - Maximum integer for range (exclusive)
 */
const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
}
