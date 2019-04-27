import React, { Component } from 'react';
import { getRandomInt, getRandomName, removeSpaces, debounce } from './utils/helperFuncs';
import Cell from './Cell';

class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// Gameboard width & height. Must be divisible by 2
			size: props.size || 4,
			cellSize: props.cellSize || 72,
			board: [[]],
			uniqueTiles: [],
			pressed: [],
			isFrozen: false
		}

		this.randomizeNewBoard = this.randomizeNewBoard.bind(this);
		this.press = this.press.bind(this);
	}

	initializeGrid(size) {
		let grid = [];
		for (let i = 0; i < size; i++) {
			let row = [];
			for (let j = 0; j < size; j++) {
				row.push(null);
			}
			grid.push(row);
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

	// This whole operation will happen server-side
	randomizeNewBoard() {
		const { size, cellSize } = this.state;
		// Generate unique image/name for 1/2 gameboard size
		const uniqueTiles = this.getUniqueTiles((size * size / 2), cellSize);
		let board = this.initializeGrid(this.state.size);
		let unmatchedTileIndices = uniqueTiles.map((tile, i) => i);

		while (unmatchedTileIndices.length > 0) {
			let row = getRandomInt(0, size);
			let col = getRandomInt(0, size);

			if (!board[row][col]) {
				// Set first tile
				let index = unmatchedTileIndices[0];
				board[row][col] = {...uniqueTiles[index]};
				// Set the matching tile
				while (board[row][col]) {
					row = getRandomInt(0, size);
					col = getRandomInt(0, size);
					if (board[row][col] === null) {
						board[row][col] = {...uniqueTiles[index]};
						unmatchedTileIndices.shift();
						break;
					}
				}
			}
		}

		this.setState(() => ({ board }), this.preloadImages(uniqueTiles));
	}

	componentDidMount() {
		this.randomizeNewBoard(); // This should be handed from the server
	}

	press(e, position) {
		e.preventDefault();

		// Copy board state
		let board = [...this.state.board];
		board.forEach((row, i) => board[i] = [...row]);

		const [x, y] = position; // Position of pressed tile
		// Second pick, when one is already awaiting a match
		if (this.state.pressed.length > 0 && !board[x][y].isPressed) {
			// Callback function, flip pieces back over automatically
			const delayed = debounce((pressed) => {
				let tileA = board[this.state.pressed[0][0]][this.state.pressed[0][1]];
				let tileB = board[this.state.pressed[1][0]][this.state.pressed[1][1]];
				tileA.isPressed = false;
				tileB.isPressed = false;
				if (tileA.name === tileB.name) {
					tileA.isCaptured = true;
					tileB.isCaptured = true;
				}

				this.setState({
					pressed: [],
					board,
					isFrozen: false
				})
			}, 500);

			board[x][y].isPressed = true;

			this.setState((state) => ({
				pressed: [...state.pressed, [x,y]],
				board,
				isFrozen: true
			}), delayed());
		}
		// First pick
		else if (!board[x][y].isPressed) {
			board[x][y].isPressed = true;
			this.setState((state, props) => ({
				pressed: [[x, y]],
				board
			}));
		}
	}

	render() {
		return (
			<div>
				<div className="board">
				{
					this.state.board.map((row, i) =>
						<div key={`row${i}`} className="row">
							{
								row.map((cell, j) =>
									<Cell
										key={`row${i}col${j}`}
										cell={cell}
										size={this.state.cellSize}
										position={[i, j]}
										isFrozen={this.state.isFrozen}
										press={this.press}/>
								)
							}
						</div>
					)
				}
				</div>
			</div>
		);
	}
}

export default Board;
