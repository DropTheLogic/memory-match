import React, { Component } from 'react';
import fire from './fire';
import { generateRoomId } from './utils/helperFuncs';

import LobbyPlayerCard from './LobbyPlayerCard';
import LobbyGameCard from './LobbyGameCard';

class Lobby extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rooms: [],
			players: []
		}
		this.roomsRef = fire.database().ref('rooms').orderByKey().limitToLast(100);
	}

	componentDidMount() {
		this.roomsRef.on('child_added', snapshot => {
			// Update list of rooms when new data hits db
			let room = { data: snapshot.val(), id: snapshot.key };
			this.setState({
				rooms: [room, ...this.state.rooms]
			});
		})
	}

	componentWillUnmount() {
		this.roomsRef.off('child_added');
	}

	addRoom() {
		const db = fire.database();
		const roomId = generateRoomId();

		db.ref(`rooms/${roomId}`).set({
			id: roomId,
			createdAt: new Date().toISOString(),
			testing: '123',
			gameState: 'waiting for player'
		});
	}

	render() {
		return (
			<section className="lobby">
				<h2>Lobby</h2>

				<button className="button-create-game" onClick={() => this.addRoom()}>Create Game Room</button>

				<h3>Game Rooms</h3>
				<div className="lobby-list">
					{
						this.state.rooms.length > 0 ?
						this.state.rooms.map(room =>
							<LobbyGameCard gameData={{id: room.id, status: room.data.gameState}} />
						)
						:
						<div>
							<h2>
								<div>No rooms yet!</div>
								<div>Start one now:</div>
							</h2>
							<button className="button-create-game pulsing">
								Create Game Room
							</button>
						</div>

					}
				</div>

				<h3>Players</h3>
				<div className="lobby-list">
					{
						this.state.players.map(player =>
							<LobbyPlayerCard player={player} />
						)
					}
				</div>
			</section>
		);
	}
}

export default Lobby;
