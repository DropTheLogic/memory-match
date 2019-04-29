import React from 'react';

const LobbyPlayerCard = (props) => {
	const { id, name, status } = props.player;
	const imgUrl = `https://api.adorable.io/avatars/${props.size * 2}/${id}`;
	const statusClass = status === 'awaiting' ? 'awaiting' : 'ingame';
	return (
		<div className="lobby-player-card">
			<picture>
				<img src={imgUrl} alt={name} />
			</picture>

			<div className="lobby-player-info">
				<h4 className="lobby-player-name">{name}</h4>
				<span className={"lobby-player-status " + statusClass}>
					{status && status.toUpperCase()}
				</span>
			</div>

		</div>
	);
}

export default LobbyPlayerCard;
