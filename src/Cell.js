import React, { Component } from 'react';

class Cell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPressed: false
		}
	}

	render() {
		const { cell, size, position } = this.props;
		const { name, url, isPressed, isCaptured } = cell;
		const isVisible = isPressed || isCaptured;
		const classList = `cell${isVisible ? ' pressed' : ''}`;

		return (
			<div
				className={classList}
				onClick={(e) => isVisible ?
					null : this.props.press(e, position)}>
				{
					isVisible ?
					<img
						src={url}
						alt={name}
						style={{width: size, height: size}} />
					:
					null
				}
			</div>
		);
	}
}

export default Cell;
