import React, { Component, Fragment } from 'react';
import fire from './fire';
import me from './me';

import UserCard from './UserCard';

class PlayerPanel extends Component {
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
									console.log('this.state.roomData:', this.state.roomData)
								let opponentId = this.state.me.hosting ?
									this.state.roomData.awayPlayerId :
									this.state.roomData.homePlayerId
								this.opponentRef =
									fire.database().ref(`users/${opponentId}`);

								this.opponentRef.on('value', snapshot => {
									let opponent = snapshot.val();
									this.setState({ opponent })
								})
							}
						});
					});
				}
			});
		});
	}

	componentWillUnmount() {
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

		return (
			<Fragment>
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

export default PlayerPanel;
