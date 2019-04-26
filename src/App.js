import { getRandomName } from './utils/helperFuncs';

import React from 'react';
import Board from './Board';
import UserCard from './UserCard';

import './App.css';

function App() {
	return (
		<div className="App">
			<header><h1>Memory Match</h1></header>
			<Board />
			<section className="players">
				<UserCard name={getRandomName()} imgSize={64} />
				<h2 className="vs-panel">Vs.</h2>
				<UserCard name={getRandomName()} imgSize={64} />
			</section>
		</div>
	);
}

export default App;
