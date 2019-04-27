import React from 'react';

const LobbyGameCard = (props) => {
	const { id, status } = props.gameData;
	const statusClass = status === 'full' ? 'ingame' : 'awaiting';
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
				<button
					type="button"
					className="button-join-game">
					Join!
				</button>
			}

		</div>
	);
}

export default LobbyGameCard;
