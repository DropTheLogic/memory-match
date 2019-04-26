import React, { Component } from 'react';

class Cell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPressed: false
		}
	}



	render() {
		const { name, size, isPressed, position } = this.props;
		const classList = `cell${isPressed ? ' pressed' : ''}`
		return (
			<div className={classList} onClick={(e) => this.props.press(e, position)}>{
				isPressed ?
				<img
					src={`https://api.adorable.io/avatars/${size * 2}/${name}`}
					alt={name}
					style={{width: size, height: size}} />
				:
				null}
			</div>
		);
	}
}

export default Cell;
