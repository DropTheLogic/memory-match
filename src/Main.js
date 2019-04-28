import React from 'react';
import { Link } from 'react-router-dom';
import { addRoom } from './dbUpdates';

const Main = (props) => {
	const imgUrl = `https://api.adorable.io/avatars/${512}/${props.me.id}`;
	return (
		<section className="main-screen">
			<div className="user-landing">
				<h2> - Welcome - </h2>
				<div className="user-splash">
					<h2>{props.me.name}</h2>
					<img src={imgUrl} alt={props.me.name} />
				</div>
			</div>

			<div className="main-menu">
				<h3>What would you like to do?</h3>
				<Link to="/game">
					<button className="button-create-game" onClick={() => addRoom()}>
						Create New Game Room
					</button>
				</Link>

				<Link to="/lobby">
					<button className="button-join-game">
						Join Game
					</button>
				</Link>

				<Link className="isDisabled">
					<button className="button-create-user">
						Randomize My User
					</button>
				</Link>
			</div>


		</section>
	);

}

export default Main;
