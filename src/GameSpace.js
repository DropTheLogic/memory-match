import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import fire from './fire';
import me from './me';

import BoardBack from './BoardBack';
import UserCard from './UserCard';
import Modal from './Modal';

class GameSpace extends Component {
	constructor(props) {
		super(props);
		this.state = {
			me: {},
			opponent: {},
			roomData: {},
			requestingNewBoard: false
		}

		this.myRef = {};
		this.opponentRef = {};
		this.roomRef = {};

		this.advanceTurn = this.advanceTurn.bind(this);
		this.requestNewBoard = this.requestNewBoard.bind(this);
	}

	advanceTurn() {
		let currentTurn = this.state.roomData.turn;
		this.roomRef.update({turn: currentTurn === 'home' ? 'away' : 'home'});
	}

	requestNewBoard() {
		this.setState(() => ({requestingNewBoard: true}));
		this.myRef.update({ matches: 0 });
		if (this.opponentRef.update) this.opponentRef.update({ matches: 0 });
	}

	// I'm so sorry to anyone who sees this...
	componentDidMount() {
		this.myRef = fire.database().ref(`users/${me.id}`);
		this.myRef.on('value', snapshot => {
			let me = snapshot.val();
			this.setState(() => ({ me: {...me}}), () => {
				// Keep track of changes to room
				if (this.state.me.roomId) {
					this.roomRef = fire.database().ref(`rooms/${this.state.me.roomId}`);
					this.roomRef.on('value', snapshot => {
						let roomData = snapshot.val();
						this.setState(() => ({roomData}), () => {
							// Keep track of opponenet.
							// If I am hosting, the opponenet will be on
							// the roomData.awayPlayerId--
							// but we are waiting--the property won't exist
							// the first time here.
							// If I am joining, the opponent should be on
							// the roomData.homePlayerId already
							if ((this.state.me.hosting && this.state.roomData.awayPlayerId)
								|| !this.state.me.hosting) {
								let opponentId = this.state.me.hosting ?
									this.state.roomData.awayPlayerId :
									this.state.roomData.homePlayerId
								this.opponentRef =
									fire.database().ref(`users/${opponentId}`);

								this.opponentRef.on('value', snapshot => {
									let opponent = snapshot.val();
									this.setState({ opponent })
								});
								this.myRef.update({status: 'in game'});
							}
						});
					});
				}
			});
		});
	}

	componentWillUnmount() {
		// If unmounting because our opponenet already left,
		// update my data, then destroy room
		// TODO: This should also fire when the opponent has an onDisconnect.
		let iWasKicked = this.state.roomData.kick;
		if (iWasKicked) {
			alert('Your opponenet has left');
			const myUpdates = {
				status: 'awaiting',
				roomId: null,
				matches: 0,
				hosting: false
			};
			this.myRef.update(myUpdates);
			this.roomRef.remove();
			let board = fire.database().ref(`boards/${this.state.roomData.boardId}`);
			board.remove();
		}
		else {
			// If unmounting because I am navigating away, first confirm
			let navigateAway = window.confirm('Really leave?');
			if (navigateAway) {
				// If I was alone, go ahead and delete room as well
				if (!this.state.roomData.awayPlayerId) {
					this.roomRef.remove();
					// And delete the board associated with the room too
					let board = fire.database().ref(`boards/${this.state.roomData.boardId}`);
					board.remove();
				}
				else {
					// Otherwise set kick property in db to redirect opponenet
					const roomUpdates = {
						kick: true
					}
					this.roomRef.update(roomUpdates);
				}
				// Update my info
				const myUpdates = {
					status: 'awaiting',
					roomId: null,
					matches: 0,
					hosting: false
				};
				this.myRef.update(myUpdates);
			}
		}
		// if (this.myRef.off) this.myRef.off('value');
		if (this.opponentRef.off) this.opponentRef.off('value');
		if (this.roomRef.off) this.roomRef.off('value');
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.requestingNewBoard && !prevState.requestingNewBoard) {
			this.setState({requestingNewBoard: false});
		}
	}

	endGameMessage() {
		if (!this.state.opponent.matches) {
			return `You Win! ` +
				`But you didn't really have an opponenet there, did you...`;
		}
		if (this.state.me.matches > 4) {
			return `You Win!`;
		}
		else if (this.state.me.matches < 4) {
			return `You Lose :()`;
		}
		return 'Tie Game!';
	}

	render() {
		let { me, opponent } = this.state;
		let { turn } = this.state.roomData;
		let roomId = (this.state.roomData.id) ? this.state.roomData.id : 'None set!';
		opponent = (opponent.name) ? opponent : {};
		let home = me.hosting ? me : opponent
		let away = home === me ? opponent : me;
		let myTurn = (turn === 'home' && me === home) || (turn === 'away' && me === away);
		let soloPlay = turn === 'solo play';
		let totalMatches = soloPlay ? home.matches : home.matches + away.matches;

		// If there was a disconnection, go back home
		if (this.state.roomData.kick === true) {
			return <Redirect to="/" />
		}
		return (
			<Fragment>
				<Modal openModal={totalMatches === 8}>
					<h1>Game Over Man!</h1>
					<h3>{this.endGameMessage()}</h3>
					<div>
						<button onClick={() => this.requestNewBoard()} autoFocus>
							Play Again
						</button>
					</div>
				</Modal>

				<BoardBack
					roomId={this.state.roomData.id}
					advanceTurn={this.advanceTurn}
					myTurn={myTurn}
					soloPlay={soloPlay}
					resetBoard={this.state.requestingNewBoard} />

				<section className="game-details">
					<div>RoomID: {roomId}</div>
					<div>{soloPlay ? 'FREE PLAY' : (myTurn ? 'Your turn!' : 'Wait...')}</div>
					{totalMatches === 8 ? <div>Rematch?<button onClick={() => this.requestNewBoard()}>Play Again</button></div> : null}
				</section>

				<section className="players">
					<UserCard user={home} imgSize={64} myTurn={myTurn && home === me} />
					<h2 className="vs-panel">VS</h2>
					<UserCard user={away} imgSize={64} myTurn={myTurn && away === me} />
				</section>
			</Fragment>
		);
	}
}

export default GameSpace;
