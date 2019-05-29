import React, { Component } from 'react';
import { getRandomInt, getRandomName, removeSpaces, debounce } from './utils/helperFuncs';
import me from './me';
import fire from './fire';
import Cell from './Cell';

// const functions = fire.functions();
// fire.functions().useFunctionsEmulator('http://localhost:3000');

class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// Gameboard width & height. Must be divisible by 2
			size: props.size || 4,
			cellSize: props.cellSize || 72,
			tileData: {},
			pressedA: -1,
			pressedB: -1,
			isFrozen: false
		}

		this.randomizeNewBoard = this.randomizeNewBoard.bind(this);
		this.press = this.press.bind(this);
	}

	initializeGrid(size) {
		let grid = [];
		for (let i = 0; i < size * size; i++) {
			grid.push(null);
		}
		return grid;
	}

	preloadImages(arrOfImageObjects) {
		// Here we should peek from board state to load images, since
		// they will be hidden from the DOM until the user clicks a tile
		arrOfImageObjects.forEach(imageObj => {
			new Image().src = imageObj.url;
		});
	}

	getUniqueTiles(numberOfTiles, pixelSize) {
		// TODO: though unlikely, this could produce duplicates. Prevent dupes!
		return new Array(numberOfTiles).fill({}).map(tile => {
			let name = getRandomName();
			let imageSize = pixelSize * 2; // This is for the benifit of x2 screens
			// adorable.io generates images by hashing a given string
			let api = 'https://api.adorable.io/avatars';
			let url = `${api}/${imageSize}/${removeSpaces(name)}`;
			return ({name, url});
		});
	}

	// This whole operation should happen server-side ¯\_(ツ)_/¯
	randomizeNewBoard() {
		const { size, cellSize } = this.state;
		// Generate unique image/name for 1/2 gameboard size
		const uniqueTiles = this.getUniqueTiles((size * size / 2), cellSize);
		let tiles = this.initializeGrid(this.state.size);
		let unmatchedTileIndices = uniqueTiles.map((tile, i) => i);

		while (unmatchedTileIndices.length > 0) {
			let i = getRandomInt(0, tiles.length);

			if (!tiles[i]) {
				// Set first tile
				let index = unmatchedTileIndices[0];
				tiles[i] = {...uniqueTiles[index]};
				// Set the matching tile
				while (tiles[i]) {
					i = getRandomInt(0, tiles.length);
					if (tiles[i] === null) {
						tiles[i] = {...uniqueTiles[index]};
						unmatchedTileIndices.shift();
						break;
					}
				}
			}
		}

		// Turn array into object
		tiles = tiles.reduce((obj, tile, i) => {
			obj[i] = tile;
			return obj;
		}, {});

		this.setState(() => ({ tileData: tiles }), () => {
			// Preload images locally
			this.preloadImages(uniqueTiles);

			// Add board data to database
			const db = fire.database();
			const newBoardKey = db.ref().child('boards').push().key;
			db.ref(`boards/${newBoardKey}`).set({
				id: newBoardKey,
				roomId: this.props.roomId || {},
				...this.state
			});
			// Establish listening point to db
			this.boardRef = db.ref(`boards/${newBoardKey}`);
			this.boardRef.on('value', snapshot => {
				let boardState = snapshot.val();
				// Update local state when db updates
				this.setState(boardState);
			});
			this.setState({boardId: newBoardKey});
		});
	}

	componentDidMount() {
		const db = fire.database();
		this.myRef = db.ref(`users/${me.id}`);
		this.myRef.on('value', snapshot => {
			let myInfo = snapshot.val();
			const hosting = myInfo.hosting;

			if (hosting) {
				// This should be handed from the server
				// But since it's not, we'll hand it up here
				// This will create a newly randomized board,
				// set it on to local state, then push local state
				// up to database. Finally, it will establish
				// a connection to the database, where the database
				// will be updated, and then local state will reflect
				// that change.
				this.randomizeNewBoard();
			}
		});
	}

	componentDidUpdate(prevProps) {
		// Update room id when it comes in
		if (this.props.roomId && this.props.roomId !== prevProps.roomId) {
			const db = fire.database();

			if (!this.boardRef) {
				db.ref(`rooms/${this.props.roomId}`).once('value', snapshot => {
					let room = snapshot.val();
					let boardId = room.boardId;
					// Establish listening point to db
					this.boardRef = db.ref(`boards/${boardId}`);
					this.boardRef.on('value', snapshot => {
						let boardState = snapshot.val();
						// Update local state when db updates
						this.setState(boardState);
					});
				})
			}
			else {
				db.ref(`rooms/${this.props.roomId}/boardId`).set(this.state.boardId);
				db.ref(`boards/${this.state.boardId}/roomId`).set(this.props.roomId);
			}
		}
	}

	press(e, index) {
		e.preventDefault();

		// Copy board state
		let tileData = {...this.state.tileData};

		// Target pick, when one tile is already awaiting a match
		if (this.state.pressedA >= 0 && !tileData[index].isPressed) {
			const targetIndex = this.state.pressedA;
			const tileGuess = tileData[index];
			const tileTarget = tileData[targetIndex];

			// If tiles match, set captured properties to true
			if (tileGuess.name === tileTarget.name) {
				tileGuess.isCaptured = true;
				tileGuess.isPressed = false;
				tileTarget.isCaptured = true;
				tileTarget.isPressed = false;

				this.boardRef.update({pressedA: -1, pressedB: -1, tileData, isFrozen: false});

			}
			else { // If no match was found
				// Callback: flip both tiles back over automatically
				const delayed = debounce(() => {
					tileTarget.isPressed = false;
					tileGuess.isPressed = false;

					this.boardRef.update({pressedA: -1, pressedB: -1, tileData, isFrozen: false});
				}, 500);

				// Initially, flip over second/unmatching tile
				tileData[index].isPressed = true;
				this.boardRef.update({
					pressedB: index,
					tileData,
					isFrozen: true
				}).then(() => delayed()); // Then callback to flip unmatched tiles back
			}
		}
		// First pick, when no tiles are currently pressed
		else if (!tileData[index].isPressed) {
			tileData[index].isPressed = true;
			this.boardRef.update({pressedA: index, tileData });
		}
	}

	render() {
		return (
			<div>
				<div className="board">
				{
					Object.values(this.state.tileData).map((tile, i) =>
						<Cell
							key={`row${Math.floor(i / 4)}col${i % 4}`}
							cell={tile}
							size={this.state.cellSize}
							position={i}
							isFrozen={this.state.isFrozen}
							press={this.press}/>
					)
				}
				</div>
			</div>
		);
	}
}

export default Board;
