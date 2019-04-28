import React, { Component } from 'react';
import fire from './fire';
import { addRoom } from './dbUpdates';

import LobbyPlayerCard from './LobbyPlayerCard';
import LobbyGameCard from './LobbyGameCard';

class Lobby extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rooms: {},
			users: {}
		}
		this.roomsRef = fire.database().ref('rooms').orderByChild('createdAt').limitToLast(100);
		this.usersRef = fire.database().ref('users').orderByKey().limitToLast(100);
	}

	componentDidMount() {
		this.roomsRef.on('value', snapshot => {
			// Update list of rooms when new data hits db
			let rooms = snapshot.val();
			this.setState({ rooms: {...rooms} });
		});
		this.usersRef.on('value', snapshot => {
			let users = snapshot.val();
			this.setState({ users: {...users} });
		});
	}

	componentWillUnmount() {
		this.roomsRef.off('value');
		this.usersRef.off('value');
	}

	render() {
		const { rooms, users } = this.state;
		const roomKeys = Object.keys(this.state.rooms);
		const userKeys = Object.keys(this.state.users);
		return (
			<section className="lobby">
				<h2>Lobby</h2>

				<button className="button-create-game" onClick={() => addRoom()}>Create New Game Room</button>

				<div className="games-container">
					<h3>Game Rooms</h3>
					<div className="lobby-list">
						{
							roomKeys.length > 0 ?
							roomKeys.map(key =>
								<LobbyGameCard key={key} gameData={{id: key, status: rooms[key].gameState}} />
							)
							:
							<div>
								<h2>
									<div>No rooms yet!</div>
									<div>Start one now:</div>
								</h2>
								<button className="button-create-game pulsing">
									Create New Game Room
								</button>
							</div>

						}
					</div>
				</div>

				<div className="players-container">
					<h3>Players</h3>
					<div className="lobby-list">
						{
							userKeys.map(key =>
								<LobbyPlayerCard key={key} player={users[key]} size={48} />
							)
						}
					</div>
				</div>
			</section>
		);
	}
}

export default Lobby;
