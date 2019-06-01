import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import fire from './fire';
import me from './me';

import BoardBack from './BoardBack';
import UserCard from './UserCard';

class GameSpace extends Component {
	constructor(props) {
		super(props);
		this.state = {
			me: {},
			opponent: {},
			roomData: {}
		}

		this.myRef = {};
		this.opponentRef = {};
		this.roomRef = {};
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
		}
		else {
			// If unmounting because I am navigating away, first confirm
			let navigateAway = window.confirm('Really leave?');
			if (navigateAway) {
				// If I was alone, go ahead and delete room as well
				if (!this.state.roomData.awayPlayerId) {
					this.roomRef.remove();
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
		if (this.myRef.off) this.myRef.off('value');
		if (this.opponentRef.off) this.opponentRef.off('value');
		if (this.roomRef.off) this.roomRef.off('value');
	}

	render() {
		let { me, opponent } = this.state;
		let roomId = (this.state.roomData.id) ? this.state.roomData.id : 'None set!';
		opponent = (opponent.name) ? opponent : {};
		let home = me.hosting ? me : opponent
		let away = home === me ? opponent : me;

		// If there was a disconnection, go back home
		if (this.state.roomData.kick === true) {
			return <Redirect to="/" />
		}
		return (
			<Fragment>
				<BoardBack roomId={this.state.roomData.id} />

				<div>RoomID: {roomId}</div>
				<section className="players">
					<UserCard user={home} imgSize={64} />
					<h2 className="vs-panel">VS</h2>
					<UserCard user={away} imgSize={64} />
				</section>
			</Fragment>
		);
	}
}

export default GameSpace;
