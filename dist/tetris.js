// jshint esversion: 8

import Tetromino from "./tetromino.js";

const
	WELL_PAD = 2,
	BLOCK_PAD = 3,
	BLOCK_SIZE = 27,
	LINE_WIDTH_FIX = 0.5;

const
	WELL_WIDTH = 10,
	WELL_HEIGHT = 20;

let
	PAUSE = false;

// ==================================================
// TETRIS
// ==================================================

class Viewport {
	constructor(id, width, height) {
		this._container = document.getElementById(id);
		if (width && height) {
			this._container.clientWidth = this.width;
			this._container.clientHeight = this.height;
		} else {
			this._container.classList.toggle("default");
		}

		this.width = this._container.clientWidth;
		this.height = this._container.clientHeight;
	}
}

class Grid {
	constructor(id, viewport) {
		this._cvs = document.getElementById(id);
		this._cvs.width = viewport.width;
		this._cvs.height = viewport.height;

		this.ppr = this._cvs.getContext("2d");
	}

	draw(stroke) {
		this.ppr.strokeStyle = stroke || "#226633";
		// vertical lines, 10blocks
		for (let w = WELL_PAD; w <= viewport.width; w += BLOCK_SIZE + 1) {
			this.ppr.moveTo(w + LINE_WIDTH_FIX, WELL_PAD);
			this.ppr.lineTo(w + LINE_WIDTH_FIX, viewport.height - WELL_PAD);
		}
		// horizontal lines, 20blocks
		for (let h = WELL_PAD; h <= viewport.height; h += BLOCK_SIZE + 1) {
			this.ppr.moveTo(WELL_PAD, h + LINE_WIDTH_FIX);
			this.ppr.lineTo(viewport.width - WELL_PAD, h + LINE_WIDTH_FIX);
		}

		this.ppr.stroke();
	}
}

class Scene {
	constructor(id, viewport) {
		this._cvs = document.getElementById("scene");
		this._cvs.width = viewport.width;
		this._cvs.height = viewport.height;

		this.ppr = this._cvs.getContext("2d");

		this.tetris = new Tetris(this.ppr);
		this.tetromino = new Tetromino(this.tetris);

		this._bindEvents();
	}

	draw() {
		//
	}

	clear() {
		this.ppr.clearRect(0, 0, this._cvs.width, this._cvs.height);
	}

	// ==============================
	// PRIVATE
	// ==============================
	_bindEvents() {
		window.addEventListener("keydown", (e) => {
			if (e.key === " ") {
				console.log("pause: ", !PAUSE ? "on" : "off");
				PAUSE = !PAUSE;
			}

			switch (e.key) {
				case "ArrowUp":
					console.log("arrow up was pressed.");
					this.tetromino.rotate();
					break;

				case "ArrowDown":
					console.log("arrow down was pressed.");
					this.tetromino.drop();
					break;

				case "ArrowLeft":
					console.log("arrow left was pressed.");
					this.tetromino.left();
					break;

				case "ArrowRight":
					console.log("arrow right was pressed.");
					this.tetromino.right();
					break;

				case "d":
					console.log("d(detect) was pressed.");
					this.tetris.detectLines();
					break;

				case "c":
					console.log("c(clear) was pressed.");
					this.tetris.clearLines(window.rows);
					break;

				case "p":
					console.log("p(draw) was pressed.");
					this.tetris.drawWell();
					break;

				case "t":
					console.log("t(test) was pressed.");
					this.tetris.testcase01();
					break;
			}
		});
	}
}

class Tetris {
	constructor(paper) {
		this._ppr = paper;
		this._well = ( () => {
			let matrix = new Array(WELL_HEIGHT);

			for (let row = 0; row < WELL_HEIGHT; row++) {
				matrix[row] = new Array(WELL_WIDTH);
				for (let col = 0; col < WELL_WIDTH; col++) {
					matrix[row][col] = false;
				}
			}

			return matrix;
		})();
	}

	drawWell(fill) {
		// let tm;
		// console.log(tm = performance.now());
		for (let row = 0; row < WELL_HEIGHT; row++) {
			for (let col = 0; col < WELL_WIDTH; col++) {
				if (this.getBlock(row, col)) {
					this.drawBlock(row, col, fill);
				}
			}
		}
		// console.log(performance.now() - tm);
		// drawing a full well take ~3 in avg
	}

	clearWell() {
		for (let row = 0; row < WELL_HEIGHT; row++) {
			for (let col = 0; col < WELL_WIDTH; col++) {
				if (this.getBlock(row, col)) {
					this.clearBlock(row, col);
				}
			}
		}
	}

	drawBlock(row, col, fill) {
		this._ppr.fillStyle = fill || "#226633";

		this._ppr.beginPath();
		this._ppr.rect(
			// x = col, y = row => draw rect in reverse order
			this._calcBlockCoord(col),
			this._calcBlockCoord(row),
			BLOCK_SIZE - 4, BLOCK_SIZE - 4);
		this._ppr.closePath();
		this._ppr.fill();
	}

	clearBlock(row, col) {
		this._ppr.clearRect(
			// x = col, y = row
			this._calcBlockCoord(col),
			this._calcBlockCoord(row),
			BLOCK_SIZE - 4, BLOCK_SIZE - 4);
	}

	setBlock(row, col, state) {
		this._well[row][col] = state;
	}

	getBlock(row, col) {
		return this._well[row][col] ? true : false;
	}

	toggleBlock(row, col) {
		this._well[row][col] = !this._well[row][col];
	}

	detectLines() {
		let
			isFilled, lastNonEmptyRow, lines = [];

		for (let row = WELL_HEIGHT - 1; row >= 0; row--) {
			isFilled = 0;
			for (let col = WELL_WIDTH - 1; col >= 0; col--) {
				if (!this.getBlock(row, col)) {
					continue;
				}

				isFilled++;
			}

			// when meet empty row => stop looking well for filled lines
			if (isFilled === 0) {
				lastNonEmptyRow = row + 1;
				// console.log(row, ": empty row.");
				break;
			}

			if (isFilled === WELL_WIDTH) {
				lines.push(row);
				// console.log(row, ": line detected.");
			}
		}

		// if lines not empty then clear filled lines
		if (lines.length > 0) {
			console.log("lines pos:", lines);
			this.clearLines(lines, lastNonEmptyRow);
		}
	}

	clearLines(lines, lastNonEmptyLine) {
		let offset, start, end;

		offset = 0;
		start = lines[0];
		end = lastNonEmptyLine || 0;
		for (let row = start; row >= end; row--) {
			if (row === lines[0]) {
				console.log("clear line...");
				for (let col = 0; col < WELL_WIDTH; col++) {
					this.clearBlock(row, col);
					this.setBlock(row, col, false);
				}
				// remove cleared row from lines
				lines.shift();
				// increase offset for next row shift
				offset++;
			} else {
				console.log("shift line...");
				// console.log("row:", row, "offset:", offset);
				for (let col = 0; col < WELL_WIDTH; col++) {
					if (this.getBlock(row, col)) {
						// "deactivate" current block
						this.setBlock(row, col, false);
						this.clearBlock(row, col);
						// shift current block to (row + offset, col) pos
						this.setBlock(row + offset, col, true);
						this.drawBlock(row + offset, col);
					}
				}
			}
		}
	}

	testcase01() {
		this._well = [
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[false, false, false, false, false, false, false, false, false, false,],
			[ true,  true,  true, false,  true,  true,  true, false, false,  true,],
			[false, false,  true,  true, false, false,  true,  true, false, false,],
			[ true, false,  true, false,  true, false,  true, false,  true, false,],
			[ true,  true,  true,  true,  true,  true,  true,  true,  true,  true,],
			[false,  true, false,  true, false,  true, false,  true, false,  true,],
			[ true,  true,  true,  true,  true,  true,  true,  true,  true,  true,],
		];
	}

	// ==============================
	// PRIVATE
	// ==============================
	_calcBlockCoord(pos) {
		return (BLOCK_SIZE + 1) * pos + WELL_PAD + BLOCK_PAD;
	}
}


// ==================================================
// GAME
// ==================================================

const delay = (n) => {
	// 1000ms = 1s
	n = n || 1000;
	return new Promise( (done) => {
		setTimeout(() => {
			done();
		}, n);
	});
};

// ==================================================
// TEST
// ==================================================

let viewport, grid, scene;

let tick = -1;
const gameloop = async () => {
	// return;
	if (!PAUSE) {
		if (!scene.tetromino.down()) {
			console.log("=====# GAME OVER #=====");
			return;
		}
		console.log("-----------------");
	}

	// await delay(100);
	// await delay(125);
	// await delay(150);
	// await delay(175);
	// await delay(200);
	// await delay(225);
	// await delay(250);
	await delay(500);
	// await delay(750);
	// await delay(1000);
	// console.log(performance.now());

	if (++tick === 500) {
		console.log("##########################");
		console.log("########## TICK ##########");
		console.log("##########################");
		return;
	}
	// console.log("tick:", tick);

	requestAnimationFrame(gameloop);
};

const init = () => {
	viewport = new Viewport("viewport");
	grid = new Grid("grid", viewport);
	scene = new Scene("scene", viewport);

	grid.draw();

	gameloop();
};

// everthing start here
init();

