import React, { Fragment } from 'react';
import { Route, Switch, Redirct } from 'react-router-dom';
import Media from 'react-media';

import Board from './Board';
import Lobby from './Lobby';
import PlayerPanel from './Players';
import Main from './Main';

import me from './me';

import './App.css';

function App() {
	return (
		<div className="App">
			<header>
				<h1>Memory Match Duel</h1>
				<small>{me.name}</small>
			</header>
			<main>
			<Media query="(min-width: 800px)">
				{matches =>
					matches ? (
						<Switch>
							<Route
								path="/" exact
								render={props => (
									<Fragment>
										<Main me={me} {...props} />
										<Lobby {...props} />
									</Fragment>
								)}
							/>
							<Route
								path="/game"
								render={props => (
									<Fragment>
										<Board {...props} />
										<PlayerPanel {...props} />
									</Fragment>
								)}
							/>
						</Switch>


					) : (
						<Switch>
							<Route
								path="/" exact
								render={props => (
									<Main me={me} {...props} />
								)}
							/>
							<Route
								path="/lobby" exact
								component={Lobby}
							/>
							<Route
								path="/game"
								render={props => (
									<Fragment>
										<Board {...props} />
										<PlayerPanel {...props} />
									</Fragment>
								)}
							/>
						</Switch>
					)
				}
			</Media>
			</main>
		</div>
	);
}

export default App;
