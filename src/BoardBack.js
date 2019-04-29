import React, { Component } from 'react';
import { getRandomInt, getRandomName, removeSpaces, debounce } from './utils/helperFuncs';
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
			tileData: [],
			uniqueTiles: [],
			pressed: [],
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

		this.setState(() => ({ tileData: tiles }), this.preloadImages(uniqueTiles));
	}

	componentDidMount() {
		this.randomizeNewBoard(); // This should be handed from the server
		// But since it's not, we'll hand it up here
		const db = fire.database();
		const newBoardKey = db.ref().child('boards').push().key;
		db.ref(`boards/${newBoardKey}`).set({
			id: newBoardKey,
			roomId: this.props.roomId || {},
			...this.state
		});
		this.setState({boardId: newBoardKey});
	}

	componentDidUpdate(prevProps) {
		// Update room id when it comes in
		if (this.props.roomId && this.props.roomId !== prevProps.roomId) {
			const db = fire.database();
			db.ref(`rooms/${this.props.roomId}/boardId`).set(this.state.boardId);
			db.ref(`boards/${this.state.boardId}/roomId`).set(this.props.roomId);
		}
	}

	press(e, index) {
		e.preventDefault();

		// Copy board state
		let tileData = [...this.state.tileData];

		// Target pick, when one tile is already awaiting a match
		if (this.state.pressed.length > 0 && !tileData[index].isPressed) {
			const targetIndex = this.state.pressed[0];
			const tileGuess = tileData[index];
			const tileTarget = tileData[targetIndex];

			// If tiles match, set captured properties to true
			if (tileGuess.name === tileTarget.name) {
				tileGuess.isCaptured = true;
				tileGuess.isPressed = false;
				tileTarget.isCaptured = true;
				tileTarget.isPressed = false;
				this.setState({
					pressed: [],
					tileData,
					isFrozen: false
				});
			}
			else { // If no match was found
				// Callback: flip both tiles back over automatically
				const delayed = debounce(() => {
					tileTarget.isPressed = false;
					tileGuess.isPressed = false;

					this.setState({
						pressed: [],
						tileData,
						isFrozen: false
					})
				}, 500);

				// Initially, flip over second/unmatching tile
				tileData[index].isPressed = true;
				this.setState((state) => ({
					pressed: [...state.pressed, index],
					tileData,
					isFrozen: true
				}), delayed()); // Then callback to flip unmatched tiles back
			}
		}
		// First pick, when no tiles are currently pressed
		else if (!tileData[index].isPressed) {
			tileData[index].isPressed = true;
			this.setState({
				pressed: [index],
				tileData
			});
		}
	}

	render() {
		return (
			<div>
				<div className="board">
				{
					this.state.tileData.map((tile, i) =>
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
