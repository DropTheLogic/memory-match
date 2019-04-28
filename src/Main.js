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
		return (
			<section className="main-screen">
				<h2>Welcome {this.state.me.name}!</h2>
			</section>
		);
	}
}

export default Main;
