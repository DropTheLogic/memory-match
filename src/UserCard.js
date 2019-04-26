import React, { Component } from 'react';
import { removeSpaces } from './utils/helperFuncs';

// const UserCard = ({ name, imgSize: size }) => {
// 	const imgUrl = `https://api.adorable.io/avatars/${size * 2}/${removeSpaces(name)}`;
// 	return (
// 		<card className="user-card">
// 			<picture>
// 			<img
// 				src={imgUrl}
// 				alt={name}
// 				style={{width: size, height: size}} />
// 			</picture>
// 		</card>
// 	);
// }

class UserCard extends Component {
	constructor(props) {
		super(props);
		this.state = {  }
	}

	componentDidMount() {

	}

	render() {
		const { name, imgSize: size } = this.props;
		const imgUrl = `https://api.adorable.io/avatars/${size * 2}/${removeSpaces(name)}`;
		return (
			<div className="user-card">
				<picture>
					<img
						src={imgUrl}
						alt={`Avatar for ${name}`}
						style={{width: size, height: size}} />
				</picture>
				<h3 className="card-name">{name}</h3>
				<div className="card-divider" />
				<div className="score">Matches: 6</div>
			</div>
		);
	}
}

export default UserCard;
