import React from 'react';

const LobbyPlayerCard = (props) => {
	const { name, url, status } = props.player;
	const isChillin = status !== 'ingame';
	const statusClass = isChillin ? 'awaiting' : 'ingame';
	return (
		<div className="lobby-player-card">
			<picture>
				<img src={url} alt={name} />
			</picture>

			<div className="lobby-player-info">
				<h4 className="lobby-player-name">{name}</h4>
				<span className={"lobby-player-status " + statusClass}>
					{isChillin ? 'CHILLIN' : 'IN GAME' }
				</span>
			</div>

		</div>
	);
}

export default LobbyPlayerCard;
