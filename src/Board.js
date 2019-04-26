import React, { Component } from 'react';
import { getRandomName, removeSpaces, debounce } from './utils/helperFuncs';
import Cell from './Cell';

class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
			size: props.size || 4,
			cellSize: props.cellSize || 72,
			board: [[]],
			pressed: [],
			isFrozen: false
		}

		this.randomizeNewBoard = this.randomizeNewBoard.bind(this);
		this.press = this.press.bind(this);
	}

	randomizeNewBoard() {
		let board = [];
		for (let i = 0; i < this.state.size; i++) {
			let row = [];
			for (let j = 0; j < this.state.size; j++) {
				row.push({ name: removeSpaces(getRandomName()) })
			}
			board.push(row);
		}
		this.setState({ board });
	}

	componentDidMount() {
		this.randomizeNewBoard();
	}

	press(e, position) {
		if (!this.state.isFrozen) {
		e.preventDefault();
		let board = [...this.state.board];
		const [x, y] = position;
		if (this.state.pressed.length > 0 && !board[x][y].isPressed) {
			const delayed = debounce((pressed) => {
				board.forEach((row, i) => board[i] = [...row]);
				board[this.state.pressed[0][0]][this.state.pressed[0][1]].isPressed = false;
				board[this.state.pressed[1][0]][this.state.pressed[1][1]].isPressed = false;

				this.setState({
					pressed: [],
					board,
					isFrozen: false
				})
			}, 1000);

			board.forEach((row, i) => board[i] = [...row]);
				board[x][y].isPressed = true;

			this.setState((state) => ({
				pressed: [...state.pressed, [x,y]],
				board,
				isFrozen: true
			}), delayed());
		}
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
										name={cell.name}
										size={this.state.cellSize}
										position={[i, j]}
										isPressed={cell.isPressed}
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
