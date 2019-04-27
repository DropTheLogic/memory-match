import firebase from 'firebase';

var config = {
	apiKey: "AIzaSyBsLdB7Ur5TYUpbmQpSDZl3sFJmmF_DPzM",
	authDomain: "memory-match-app.firebaseapp.com",
	databaseURL: "https://memory-match-app.firebaseio.com",
	projectId: "memory-match-app",
	storageBucket: "memory-match-app.appspot.com",
	messagingSenderId: "1021379223383"
};
var fire = firebase.initializeApp(config);

export default fire;
