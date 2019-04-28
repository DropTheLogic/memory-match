import React, { Fragment } from 'react';
import UserCard from './UserCard';

const PlayerPanel = (props) => {
	let me = (props.me.name) ? props.me : {};
	let opponent = (props.opponent) ? props.opponent : {};
	let home = props.me.hosting ? me : opponent // Divine who is "player 1" ???
	let away = home === me ? opponent : me; // and "player 2"
	console.log('in player panel, oppponent:', opponent)
	return (
		<Fragment>
		<div>RoomID: {props.roomId ? props.roomId : 'None set!'}</div>
		<section className="players">

			<UserCard user={home} imgSize={64} />
			<h2 className="vs-panel">VS</h2>
			<UserCard user={away} imgSize={64} />
		</section>
		</Fragment>
	);
}

export default PlayerPanel;
