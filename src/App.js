import React from 'react';
import Board from './Board';
import PlayerPanel from './Players';

import './App.css';


function App() {
	return (
		<div className="App">
			<header><h1>Memory Match</h1></header>
			<Board />
			<PlayerPanel />
		</div>
	);
}

export default App;
