import React from 'react';
import UserCard from './UserCard';

import { getRandomName } from './utils/helperFuncs';

// TODO: users should already come in with their names from backend
const PlayerPanel = (props) => {
	return (
		<section className="players">
			<UserCard name={getRandomName()} imgSize={64} />
			<h2 className="vs-panel">VS</h2>
			<UserCard name={getRandomName()} imgSize={64} />
		</section>
	);
}

export default PlayerPanel;
