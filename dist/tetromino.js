// ==================================================
// TETROMINO
// ==================================================

const
	LEFT_BORDER = -1,
	RIGHT_BORDER = 10,
	BOTTOM_BORDER = 20;

const
	LEFT = 0,
	RIGHT = 1;

const
	I_TETROMINO = 0,
	S_TETROMINO = 1,
	J_TETROMINO = 2,
	T_TETROMINO = 3,
	L_TETROMINO = 4,
	Z_TETROMINO = 5,
	O_TETROMINO = 6;

class Tetromino {
	constructor(tetris) {
		this._tetris = tetris;

		this.blocks = [
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
		];

		this.offsets = [
			// 0deg => 90deg CW
			[{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0},],
			// 90deg => 180deg CW
			[{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0},],
			// 180deg => 270deg CW
			[{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0},],
			// 270deg => 0deg CW
			[{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0},],
		];

		this.spawn();
	}

	draw() {
		for (let b = 0; b < 4; b++) {
			this._tetris.drawBlock(this.blocks[b].y, this.blocks[b].x);
		}
	}

	clear() {
		for (let b = 0; b < 4; b++) {
			this._tetris.clearBlock(this.blocks[b].y, this.blocks[b].x);
		}
	}

	spawn() {
		// max, min - inclusive
		// js random -> Math.floor(Math.random() * (max - min + 1) + min)
		this.type = Math.floor(Math.random() * 7);
		console.log("type:", this.type);
		this.state = Math.floor(Math.random() * 2) ? 0 : 2;
		console.log("state:", this.state);

		// spawn tetromino and set offsets for rotations
		switch (this.type) {
			case I_TETROMINO: this._spawnI(); break;
			case S_TETROMINO: this._spawnS(); break;
			case J_TETROMINO: this._spawnJ(); break;
			case T_TETROMINO: this._spawnT(); break;
			case L_TETROMINO: this._spawnL(); break;
			case Z_TETROMINO: this._spawnZ(); break;
			case O_TETROMINO: this._spawnO(); break;
			default: console.log("something went wrong...??!!!");
		}
	}

	down() {
		if (!this.collisionBottom()) {
			this._shift();

			return true;
		} else {
			return false;
		}
	}

	drop() {
		this.clear();
		while (!this.collisionBottom()) {
			for (let b = 0; b < 4; b++) {
				this.blocks[b].x++;
			}
		}
		this.draw();
		this.anchor();
	}

	left() {
		if (!this.collisionLeft()) {
			this.clear();
			for (let b = 0; b < 4; b++) {
				this.blocks[b].y--;
			}
			this.draw();

			return true;
		} else {
			return false;
		}
	}

	right() {
		if (!this.collisionRight()) {
			// this.clear();
			// for (let b = 0; b < 4; b++) {
			// 	this.blocks[b].y++;
			// }
			// this.draw();
			this._shift(RIGHT);

			return true;
		} else {
			return false;
		}
	}

	anchor() {
		for (let b = 0; b < 4; b++) {
			this._tetris.toggleBlock(this.blocks[b].x, this.blocks[b].y);
		}

		this.spawn();
	}

	collisionLeft() {
		for (let b = 0; b < 4; b++) {
			if (this.blocks[b].y - 1 === LEFT_BORDER) {
				console.log("collision: wall kick(left) on next move LEFT");
				return true;
			}

			if (this.blocks[b].x >= 0 &&
				this._tetris.getBlock(this.blocks[b].x, this.blocks[b].y - 1)) {
				console.log("collision: blocks on next move LEFT");
				return true;
			}
		}

		return false;
	}

	collisionRight() {
		for (let b = 0; b < 4; b++) {
			if (this.blocks[b].y + 1 === RIGHT_BORDER) {
				console.log("collision: wall kick(right) on next move RIGHT");
				return true;
			}

			if (this.blocks[b].x >= 0 &&
				this._tetris.getBlock(this.blocks[b].x, this.blocks[b].y + 1)) {
				console.log("collision: blocks on next move RIGHT");
				return true;
			}
		}

		return false;
	}

	collisionBottom() {
		for (let b = 0; b < 4; b++) {
			if (this.blocks[b].x + 1 === BOTTOM_BORDER) {
				console.log("collision: wall kick(bottom) on next move DOWN!");
				return true;
			}

			if (this.blocks[b].x + 1 >= 0 &&
				this._tetris.getBlock(this.blocks[b].x + 1, this.blocks[b].y)) {
				console.log("collision: blocks on next move DOWN");
				return true;
			}
		}

		return false;
	}

	rotate() {
		if (this.type === O_TETROMINO) return;

		console.log("-----------------# rotate #-----------------");
		for (let b = 0; b < 4; b++) {
			this.clear();
			// console.log("prev => x:", this.blocks[b].x, "y:", this.blocks[b].y);
			this.blocks[b].x += this.offsets[this.state][b].y;
			this.blocks[b].y += this.offsets[this.state][b].x;
			this.draw();
			// console.log("curr => x:", this.blocks[b].x, "y:", this.blocks[b].y);
		}

		this.state = this.state < 3 ? this.state + 1 : 0;
	}

	// ==============================
	// PRIVATE
	// ==============================
	_spawnI() {
		this.blocks[0].x = this.state ? -1 : -1;
		this.blocks[0].y = this.state ?  6 :  3;
		this.blocks[1].x = this.state ? -1 : -1;
		this.blocks[1].y = this.state ?  5 :  4;
		this.blocks[2].x = this.state ? -1 : -1;
		this.blocks[2].y = this.state ?  4 :  5;
		this.blocks[3].x = this.state ? -1 : -1;
		this.blocks[3].y = this.state ?  3 :  6;

		this.offsets = [
			[{x:  2, y: -1}, {x:  1, y:  0}, {x:  0, y:  1}, {x: -1, y:  2},],
			[{x:  1, y:  2}, {x:  0, y:  1}, {x: -1, y:  0}, {x: -2, y: -1},],
			[{x: -2, y:  1}, {x: -1, y:  0}, {x:  0, y: -1}, {x:  1, y: -2},],
			[{x: -1, y: -2}, {x:  0, y: -1}, {x:  1, y:  0}, {x:  2, y:  1},],
		];
	}

	_spawnS() {
		this.blocks[0].x = this.state ? -2 : -1;
		this.blocks[0].y = this.state ?  5 :  3;
		this.blocks[1].x = this.state ? -2 : -1;
		this.blocks[1].y = this.state ?  4 :  4;
		this.blocks[2].x = this.state ? -1 : -2;
		this.blocks[2].y = this.state ?  4 :  4;
		this.blocks[3].x = this.state ? -1 : -2;
		this.blocks[3].y = this.state ?  3 :  5;

		this.offsets = [
			[{x:  1, y: -1}, {x:  0, y:  0}, {x:  1, y:  1}, {x:  0, y:  2},],
			[{x:  1, y:  1}, {x:  0, y:  0}, {x: -1, y:  1}, {x: -2, y:  0},],
			[{x: -1, y:  1}, {x:  0, y:  0}, {x: -1, y: -1}, {x:  0, y: -2},],
			[{x: -1, y: -1}, {x:  0, y:  0}, {x:  1, y: -1}, {x:  2, y:  0},],
		];
	}

	_spawnJ() {
		this.blocks[0].x = this.state ? -1 : -2;
		this.blocks[0].y = this.state ?  6 :  3;
		this.blocks[1].x = this.state ? -2 : -1;
		this.blocks[1].y = this.state ?  6 :  3;
		this.blocks[2].x = this.state ? -2 : -1;
		this.blocks[2].y = this.state ?  5 :  4;
		this.blocks[3].x = this.state ? -2 : -1;
		this.blocks[3].y = this.state ?  4 :  5;

		this.offsets = [
			[{x:  2, y:  0}, {x:  1, y: -1}, {x:  0, y:  0}, {x: -1, y:  1},],
			[{x:  0, y:  2}, {x:  1, y:  1}, {x:  0, y:  0}, {x: -1, y: -1},],
			[{x: -2, y:  0}, {x: -1, y:  1}, {x:  0, y:  0}, {x:  1, y: -1},],
			[{x:  0, y: -2}, {x: -1, y: -1}, {x:  0, y:  0}, {x:  1, y:  1},],
		];
	}

	_spawnT() {
		this.blocks[0].x = this.state ? -2 : -1;
		this.blocks[0].y = this.state ?  5 :  4;
		this.blocks[1].x = this.state ? -2 : -1;
		this.blocks[1].y = this.state ?  4 :  5;
		this.blocks[2].x = this.state ? -2 : -1;
		this.blocks[2].y = this.state ?  3 :  6;
		this.blocks[3].x = this.state ? -1 : -2;
		this.blocks[3].y = this.state ?  4 :  5;

		this.offsets = [
			[{x:  1, y: -1}, {x:  0, y:  0}, {x: -1, y:  1}, {x:  1, y:  1},],
			[{x:  1, y:  1}, {x:  0, y:  0}, {x: -1, y: -1}, {x: -1, y:  1},],
			[{x: -1, y:  1}, {x:  0, y:  0}, {x:  1, y: -1}, {x: -1, y: -1},],
			[{x: -1, y: -1}, {x:  0, y:  0}, {x:  1, y:  1}, {x:  1, y: -1},],
		];
	}

	_spawnL() {
		this.blocks[0].x = this.state ? -2 : -1;
		this.blocks[0].y = this.state ?  5 :  4;
		this.blocks[1].x = this.state ? -2 : -1;
		this.blocks[1].y = this.state ?  4 :  5;
		this.blocks[2].x = this.state ? -2 : -1;
		this.blocks[2].y = this.state ?  3 :  6;
		this.blocks[3].x = this.state ? -1 : -2;
		this.blocks[3].y = this.state ?  3 :  6;

		this.offsets = [
			[{x:  1, y: -1}, {x:  0, y:  0}, {x: -1, y:  1}, {x:  0, y:  2},],
			[{x:  1, y:  1}, {x:  0, y:  0}, {x: -1, y: -1}, {x: -2, y:  0},],
			[{x: -1, y:  1}, {x:  0, y:  0}, {x:  1, y: -1}, {x:  0, y: -2},],
			[{x: -1, y: -1}, {x:  0, y:  0}, {x:  1, y:  1}, {x:  2, y:  0},],
		];
	}

	_spawnZ() {
		this.blocks[0].x = this.state ? -1 : -2;
		this.blocks[0].y = this.state ?  6 :  4;
		this.blocks[1].x = this.state ? -1 : -2;
		this.blocks[1].y = this.state ?  5 :  5;
		this.blocks[2].x = this.state ? -2 : -1;
		this.blocks[2].y = this.state ?  5 :  5;
		this.blocks[3].x = this.state ? -2 : -1;
		this.blocks[3].y = this.state ?  4 :  6;

		this.offsets = [
			[{x:  2, y:  0}, {x:  1, y:  1}, {x:  0, y:  0}, {x: -1, y:  1},],
			[{x:  0, y:  2}, {x: -1, y:  1}, {x:  0, y:  0}, {x: -1, y: -1},],
			[{x: -2, y:  0}, {x: -1, y: -1}, {x:  0, y:  0}, {x:  1, y: -1},],
			[{x:  0, y: -2}, {x:  1, y: -1}, {x:  0, y:  0}, {x:  1, y:  1},],
		];
	}

	_spawnO() {
		this.blocks[0].x = -1;
		this.blocks[0].y =  4;
		this.blocks[1].x = -2;
		this.blocks[1].y =  4;
		this.blocks[2].x = -2;
		this.blocks[2].y =  5;
		this.blocks[3].x = -1;
		this.blocks[3].y =  5;
	}

	_shift(direction) {
		this.clear();
		for (let b = 0; b < 4; b++) {
			switch (direction) {
				case LEFT:
					this.blocks[b].y--;
					break;

				case RIGHT:
					this.blocks[b].y++;
					break;

				default:
					this.blocks[b].x++;
					break;
			}
		}
		this.draw();
	}
} // end Tetromino class

export default Tetromino;