import React, { Component } from 'react';
import fire from './fire';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			me: props.me
		}
		this.myRef = fire.database().ref(`users/${props.me.id}`);
	}

	componentDidMount() {
		this.myRef.on('value', snapshot => {
			let me = snapshot.val();
			this.setState({ me: {...me} });
		});
	}

	componentWillUnmount() {
		this.myRef.off('value');
	}

	render() {
		const imgUrl = `https://api.adorable.io/avatars/${512}/${this.state.me.id}`;
		return (
			<section className="main-screen">
				<h2> - Welcome - </h2>
				<div className="user-splash">
					<h2>{this.state.me.name}</h2>
					<img src={imgUrl} alt={this.state.me.name} />
				</div>
				<button className="button-create-user">
					New random user
				</button>

				<h3>What would you like to do?</h3>
				<div className="main-menu">
					<button className="button-create-game">
						Create Game Room
					</button>

					<button className="button-join-game">
						Join Game
					</button>
				</div>


			</section>
		);
	}
}

export default Main;
