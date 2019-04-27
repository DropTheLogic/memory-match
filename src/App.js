import React from 'react';
import Board from './Board';
import Lobby from './Lobby';
import PlayerPanel from './Players';

import './App.css';

import playerData from './data/players';
import gameData from './data/games';

function App() {
	return (
		<div className="App">
			<header><h1>Memory Match Duel</h1></header>
			<Lobby players={playerData} games={gameData} />

			<Board />
			<PlayerPanel />
		</div>
	);
}

export default App;
