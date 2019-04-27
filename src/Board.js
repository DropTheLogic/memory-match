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

	// This whole operation will happen server-side
	randomizeNewBoard() {
		const { size, cellSize } = this.state;
		// Generate unique image/name for 1/2 gameboard size
		let uniqueTiles = new Array(size * size / 2).fill('').map(tile => {
			let name = getRandomName();
			let imageSize = cellSize * 2; // This is for the benifit of x2 screens
			// adorable.io generates images by hashing a given string
			let url = `https://api.adorable.io/avatars/${imageSize}/${removeSpaces(name)}`;
			return ({name, url});
		});

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

		this.setState(() => ({ board }), this.preloadImages());
	}

	componentDidMount() {
		this.randomizeNewBoard(); // This should be handed from the server
	}

	preloadImages() {
		// Here we should peek from board state to load images, since
		// they will be hidden from the DOM until the user clicks a tile
	}

	press(e, position) {
		if (!this.state.isFrozen) {
		e.preventDefault();
		let board = [...this.state.board];
		const [x, y] = position;
		// Second pick
		if (this.state.pressed.length > 0 && !board[x][y].isPressed) {
			const delayed = debounce((pressed) => {
				board.forEach((row, i) => board[i] = [...row]);
				let tileA = board[this.state.pressed[0][0]][this.state.pressed[0][1]];
				let tileB = board[this.state.pressed[1][0]][this.state.pressed[1][1]]
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

			board.forEach((row, i) => board[i] = [...row]);
				board[x][y].isPressed = true;

			this.setState((state) => ({
				pressed: [...state.pressed, [x,y]],
				board,
				isFrozen: true
			}), delayed());
		}
		// First pick
		else if (!board[x][y].isPressed) {
			let board = [...this.state.board];
			board[x] = [...board[x]];
			board[x][y].isPressed = true;
			this.setState((state, props) => ({
				pressed: [[x, y]],
				board
			}));
		}
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
