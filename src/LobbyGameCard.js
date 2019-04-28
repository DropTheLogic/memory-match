import React from 'react';
import { Link } from 'react-router-dom';
import { putMeInRoom } from './dbUpdates';

const LobbyGameCard = (props) => {
	const { id, status } = props.gameData;
	const statusClass = status === 'waiting for player' ? 'awaiting' : 'ingame';
	return (
		<div className="lobby-game-card">
			<div className="lobby-game-info">
				<h4 className="lobby-game-id">Game Room Code: {id}</h4>
				<span className={"lobby-game-status " + statusClass}>
					{status.toUpperCase()}
				</span>
			</div>
			{
				status === 'full' ? null :
				<Link to="/game">
					<button
						type="button"
						className="button-join-game"
						onClick={() => putMeInRoom(id, false)}>
						Join!
					</button>
				</Link>
			}

		</div>
	);
}

export default LobbyGameCard;
