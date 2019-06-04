import React, { Component } from 'react';
import { removeSpaces } from './utils/helperFuncs';

class UserCard extends Component {
	constructor(props) {
		super(props);
		this.state = {  }
	}

	componentDidMount() {
		// Retrieve player data here? Or just have it handed as props?
	}

	render() {
		if (this.props.user.name) {
			const { user, imgSize: size } = this.props;
			const { name, matches } = user;
			const imgUrl = `https://api.adorable.io/avatars/${size * 2}/${removeSpaces(name)}`;
			return (
				<div className="user-card">
					<picture>
						<img
							src={imgUrl}
							alt={`Avatar for ${name}`}/>
					</picture>
					<h3 className="card-name">{name}</h3>
					<div className="card-divider" />
					<div className="score">Matches: {matches}</div>
				</div>
			);
		}
		else {
			let waitingSrc = `https://api.adorable.io/avatars/64/StillWaiting`;
			return (
				<div className="user-card">
					<div className="awaiting-user">
						<h3>Awaiting user...</h3>
						<div className="spinning">
							<img src={waitingSrc} alt="waiting animation" />
						</div>
					</div>

				</div>
			)
		}
	}
}

export default UserCard;
