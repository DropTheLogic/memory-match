import React from 'react';
import LobbyPlayerCard from './LobbyPlayerCard';
import LobbyGameCard from './LobbyGameCard';

const Lobby = (props) => {
	return (
		<section className="lobby">
			<h2>Lobby</h2>

			<h3>Game Rooms</h3>
			<div className="lobby-list">
				{
					props.games.map(game =>
						<LobbyGameCard gameData={game} />
					)
				}
			</div>

			<h3>Players</h3>
			<div className="lobby-list">
				{
					props.players.map(player =>
						<LobbyPlayerCard player={player} />
					)
				}
			</div>
		</section>
	);
}

export default Lobby;
