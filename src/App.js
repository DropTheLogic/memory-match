import React from 'react';
import Board from './Board';
import Lobby from './Lobby';
import PlayerPanel from './Players';
import Main from './Main';

import me from './me';

import './App.css';

function App() {
	return (
		<div className="App">
			<header><h1>Memory Match Duel</h1></header>
			<Main me={me} />
			<Lobby />

			<Board />
			<PlayerPanel />
		</div>
	);
}

export default App;
