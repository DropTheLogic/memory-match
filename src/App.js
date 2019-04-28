import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Media from 'react-media';
import fire from './fire';

import Board from './Board';
import Lobby from './Lobby';
import PlayerPanel from './Players';
import Main from './Main';

import me from './me';

import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			me: {}
		}
		this.myRef = {};
	}

	componentDidMount() {
		this.myRef = fire.database().ref(`users/${me.id}`);
		this.myRef.on('value', snapshot => {
			let me = snapshot.val();
			this.setState({ me: {...me} });
		});
	}

	componentWillUnmount() {
		this.myRef.off('value');
	}

	render() {
	return (
		<div className="App">
			<header>
				<h1>Memory Match Duel</h1>
				<small>{me.name}</small>
			</header>

			<main>
			<Media query="(min-width: 766px)">
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
								path="/game" exact
								render={props => (
									<Fragment>
										<Board {...props} />
										<PlayerPanel {...props} />
									</Fragment>
								)}
							/>
							<Route
								path="/lobby" exact
								component={Lobby}
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
}

export default App;
