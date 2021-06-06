// jshint esversion: 8

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
			{ r: 0, c: 0 },
			{ r: 0, c: 0 },
			{ r: 0, c: 0 },
			{ r: 0, c: 0 },
		];

		this.offsets = [
			// 0deg => 90deg CW
			[{v: 0, h: 0}, {v: 0, h: 0}, {v: 0, h: 0}, {v: 0, h: 0},],
			// 90deg => 180deg CW
			[{v: 0, h: 0}, {v: 0, h: 0}, {v: 0, h: 0}, {v: 0, h: 0},],
			// 180deg => 270deg CW
			[{v: 0, h: 0}, {v: 0, h: 0}, {v: 0, h: 0}, {v: 0, h: 0},],
			// 270deg => 0deg CW
			[{v: 0, h: 0}, {v: 0, h: 0}, {v: 0, h: 0}, {v: 0, h: 0},],
		];

		this.spawn();
	}

	draw() {
		for (let b = 0; b < 4; b++) {
			this._tetris.drawBlock(this.blocks[b].r, this.blocks[b].c);
		}
	}

	clear() {
		for (let b = 0; b < 4; b++) {
			this._tetris.clearBlock(this.blocks[b].r, this.blocks[b].c);
		}
	}

	spawn() {
		// max, min - inclusive
		// js random -> Math.floor(Math.random() * (max - min + 1) + min)
		this._type = Math.floor(Math.random() * 7);
		console.log("type:", this._type);
		this._state = Math.floor(Math.random() * 2) ? 0 : 2;
		console.log("state:", this._state);

		// spawn tetromino and set offsets for rotations
		switch (this._type) {
			case I_TETROMINO: this._spawnI(); break;
			case S_TETROMINO: this._spawnS(); break;
			case J_TETROMINO: this._spawnJ(); break;
			case T_TETROMINO: this._spawnT(); break;
			case L_TETROMINO: this._spawnL(); break;
			case Z_TETROMINO: this._spawnZ(); break;
			case O_TETROMINO: this._spawnO(); break;
			default: console.log("really...??!! => something went wrong");
		}
	}


	drop() {
		this.clear();
		while (!this.collisionBottom()) {
			for (let b = 0; b < 4; b++) {
				this.blocks[b].r++;
			}
		}
		this.draw();

		this.anchor();
		this._tetris.detectLines();
	}

	down() {
		// if the next step is a collision with walls or blocks =>
		// just anchor tetromino and spawn new
		if (this.collisionBottom()) {
			if (this.anchor()) {
				this._tetris.detectLines();
				return true;
			}

			return false;
		}

		this._shift();

		return true;
	}

	left() {
		if (this.collisionLeft()) {
			return false;
		}

		this._shift(LEFT);
		return true;
	}

	right() {
		if (this.collisionRight()) {
			return false;
		}

		this._shift(RIGHT);
		return true;
	}

	rotate() {
		if (this._type === O_TETROMINO) {
			return false;
		}

		if (this.collisionRotate()) {
			return false;
		}

		this.clear();
		for (let b = 0; b < 4; b++) {
			// console.log(
			// "prev => x:", this.blocks[b].r,"y:", this.blocks[b].c);
			this.blocks[b].r += this.offsets[this._state][b].v;
			this.blocks[b].c += this.offsets[this._state][b].h;
			// console.log(
			// "curr => x:", this.blocks[b].r, "y:", this.blocks[b].c);
		}
		this.draw();

		this._state = this._state < 3 ? this._state + 1 : 0;

		return true;
	}

	anchor() {
		for (let b = 0; b < 4; b++) {
			if (this.blocks[b].r < 0) {
				return false;
			}

			this._tetris.toggleBlock(this.blocks[b].r, this.blocks[b].c);
		}

		this.spawn();

		return true;
	}

	collisionLeft() {
		for (let b = 0; b < 4; b++) {
			if (this.blocks[b].c - 1 === LEFT_BORDER) {
				console.log("collision: wall kick(left) on next move LEFT");
				return true;
			}

			if (this.blocks[b].r >= 0 &&
				this._tetris.getBlock(this.blocks[b].r, this.blocks[b].c - 1)) {
				console.log("collision: blocks on next move LEFT");
				return true;
			}
		}

		return false;
	}

	collisionRight() {
		for (let b = 0; b < 4; b++) {
			if (this.blocks[b].c + 1 === RIGHT_BORDER) {
				console.log("collision: wall kick(right) on next move RIGHT");
				return true;
			}

			if (this.blocks[b].r >= 0 &&
				this._tetris.getBlock(this.blocks[b].r, this.blocks[b].c + 1)) {
				console.log("collision: blocks on next move RIGHT");
				return true;
			}
		}

		return false;
	}

	collisionBottom() {
		for (let b = 0; b < 4; b++) {
			if (this.blocks[b].r + 1 === BOTTOM_BORDER) {
				console.log("collision: wall kick(bottom) on next move DOWN!");
				return true;
			}

			if (this.blocks[b].r + 1 >= 0 &&
				this._tetris.getBlock(this.blocks[b].r + 1, this.blocks[b].c)) {
				console.log("collision: blocks on next move DOWN");
				return true;
			}
		}

		return false;
	}

	collisionRotate() {
		for (let b = 0; b < 4; b++) {
			if (this.blocks[b].c + this.offsets[this._state][b].h >= RIGHT_BORDER) {
				console.log("collision: wall kick(right) on rotate");
				return true;
			}

			if (this.blocks[b].c + this.offsets[this._state][b].h <= LEFT_BORDER) {
				console.log("collision: wall kick(left) on rotate");
				return true;
			}

			if (this.blocks[b].r + this.offsets[this._state][b].v > 0 &&
				this._tetris.getBlock(
					this.blocks[b].r + this.offsets[this._state][b].v,
					this.blocks[b].c + this.offsets[this._state][b].h,
				)) {
				console.log("collision: blocks(rotate) on rotate");
				return true;
			}
		}

		return false;
	}

	// ==============================
	// PRIVATE
	// ==============================
	_spawnI() {
		this.blocks[0].r = this._state ? -1 : -1;
		this.blocks[0].c = this._state ?  6 :  3;
		this.blocks[1].r = this._state ? -1 : -1;
		this.blocks[1].c = this._state ?  5 :  4;
		this.blocks[2].r = this._state ? -1 : -1;
		this.blocks[2].c = this._state ?  4 :  5;
		this.blocks[3].r = this._state ? -1 : -1;
		this.blocks[3].c = this._state ?  3 :  6;

		this.offsets = [
			[{v: -1, h:  2}, {v:  0, h:  1}, {v:  1, h:  0}, {v:  2, h: -1},],
			[{v:  2, h:  1}, {v:  1, h:  0}, {v:  0, h: -1}, {v: -1, h: -2},],
			[{v:  1, h: -2}, {v:  0, h: -1}, {v: -1, h:  0}, {v: -2, h:  1},],
			[{v: -2, h: -1}, {v: -1, h:  0}, {v:  0, h:  1}, {v:  1, h:  2},],
		];
	}

	_spawnS() {
		this.blocks[0].r = this._state ? -2 : -1;
		this.blocks[0].c = this._state ?  5 :  3;
		this.blocks[1].r = this._state ? -2 : -1;
		this.blocks[1].c = this._state ?  4 :  4;
		this.blocks[2].r = this._state ? -1 : -2;
		this.blocks[2].c = this._state ?  4 :  4;
		this.blocks[3].r = this._state ? -1 : -2;
		this.blocks[3].c = this._state ?  3 :  5;

		this.offsets = [
			[{v: -1, h:  1}, {h:  0, v:  0}, {v:  1, h:  1}, {v:  2, h:  0},],
			[{v:  1, h:  1}, {h:  0, v:  0}, {v:  1, h: -1}, {v:  0, h: -2},],
			[{v:  1, h: -1}, {h:  0, v:  0}, {v: -1, h: -1}, {v: -2, h:  0},],
			[{v: -1, h: -1}, {h:  0, v:  0}, {v: -1, h:  1}, {v:  0, h:  2},],
		];
	}

	_spawnJ() {
		this.blocks[0].r = this._state ? -1 : -2;
		this.blocks[0].c = this._state ?  6 :  3;
		this.blocks[1].r = this._state ? -2 : -1;
		this.blocks[1].c = this._state ?  6 :  3;
		this.blocks[2].r = this._state ? -2 : -1;
		this.blocks[2].c = this._state ?  5 :  4;
		this.blocks[3].r = this._state ? -2 : -1;
		this.blocks[3].c = this._state ?  4 :  5;

		this.offsets = [
			[{v:  0, h:  2}, {v: -1, h:  1}, {h:  0, v:  0}, {v:  1, h: -1},],
			[{v:  2, h:  0}, {v:  1, h:  1}, {h:  0, v:  0}, {v: -1, h: -1},],
			[{v:  0, h: -2}, {v:  1, h: -1}, {h:  0, v:  0}, {v: -1, h:  1},],
			[{v: -2, h:  0}, {v: -1, h: -1}, {h:  0, v:  0}, {v:  1, h:  1},],
		];
	}

	_spawnT() {
		this.blocks[0].r = this._state ? -2 : -1;
		this.blocks[0].c = this._state ?  5 :  4;
		this.blocks[1].r = this._state ? -2 : -1;
		this.blocks[1].c = this._state ?  4 :  5;
		this.blocks[2].r = this._state ? -2 : -1;
		this.blocks[2].c = this._state ?  3 :  6;
		this.blocks[3].r = this._state ? -1 : -2;
		this.blocks[3].c = this._state ?  4 :  5;

		this.offsets = [
			[{v: -1, h:  1}, {v:  0, h:  0}, {v:  1, h: -1}, {v:  1, h:  1},],
			[{v:  1, h:  1}, {v:  0, h:  0}, {v: -1, h: -1}, {v:  1, h: -1},],
			[{v:  1, h: -1}, {v:  0, h:  0}, {v: -1, h:  1}, {v: -1, h: -1},],
			[{v: -1, h: -1}, {v:  0, h:  0}, {v:  1, h:  1}, {v: -1, h:  1},],
		];
	}

	_spawnL() {
		this.blocks[0].r = this._state ? -2 : -1;
		this.blocks[0].c = this._state ?  5 :  4;
		this.blocks[1].r = this._state ? -2 : -1;
		this.blocks[1].c = this._state ?  4 :  5;
		this.blocks[2].r = this._state ? -2 : -1;
		this.blocks[2].c = this._state ?  3 :  6;
		this.blocks[3].r = this._state ? -1 : -2;
		this.blocks[3].c = this._state ?  3 :  6;

		this.offsets = [
			[{v: -1, h:  1}, {v:  0, h:  0}, {v:  1, h: -1}, {v:  2, h:  0},],
			[{v:  1, h:  1}, {v:  0, h:  0}, {v: -1, h: -1}, {v:  0, h: -2},],
			[{v:  1, h: -1}, {v:  0, h:  0}, {v: -1, h:  1}, {v: -2, h:  0},],
			[{v: -1, h: -1}, {v:  0, h:  0}, {v:  1, h:  1}, {v:  0, h:  2},],
		];
	}

	_spawnZ() {
		this.blocks[0].r = this._state ? -1 : -2;
		this.blocks[0].c = this._state ?  6 :  4;
		this.blocks[1].r = this._state ? -1 : -2;
		this.blocks[1].c = this._state ?  5 :  5;
		this.blocks[2].r = this._state ? -2 : -1;
		this.blocks[2].c = this._state ?  5 :  5;
		this.blocks[3].r = this._state ? -2 : -1;
		this.blocks[3].c = this._state ?  4 :  6;

		this.offsets = [
			[{v:  0, h:  2}, {v:  1, h:  1}, {v:  0, h:  0}, {v:  1, h: -1},],
			[{v:  2, h:  0}, {v:  1, h: -1}, {v:  0, h:  0}, {v: -1, h: -1},],
			[{v:  0, h: -2}, {v: -1, h: -1}, {v:  0, h:  0}, {v: -1, h:  1},],
			[{v: -2, h:  0}, {v: -1, h:  1}, {v:  0, h:  0}, {v:  1, h:  1},],
		];
	}

	_spawnO() {
		this.blocks[0].r = -1;
		this.blocks[0].c =  4;
		this.blocks[1].r = -2;
		this.blocks[1].c =  4;
		this.blocks[2].r = -2;
		this.blocks[2].c =  5;
		this.blocks[3].r = -1;
		this.blocks[3].c =  5;
	}

	_shift(direction) {
		this.clear();
		for (let b = 0; b < 4; b++) {
			switch (direction) {
				case LEFT:
					this.blocks[b].c--;
					break;

				case RIGHT:
					this.blocks[b].c++;
					break;

				default:
					this.blocks[b].r++;
					break;
			}
		}
		this.draw();
	}
} // end Tetromino class

export default Tetromino;