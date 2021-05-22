// jshint esversion: 8

const
	WELL_PAD = 2,
	BLOCK_PAD = 3,
	BLOCK_SIZE = 27,
	LINE_WIDTH_FIX = 0.5;

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
		// vertical lines, 10boxes
		for (let w = WELL_PAD; w <= viewport.width; w += BLOCK_SIZE + 1) {
			this.ppr.moveTo(w + LINE_WIDTH_FIX, WELL_PAD);
			this.ppr.lineTo(w + LINE_WIDTH_FIX, viewport.height - WELL_PAD);
		}
		// horizontal lines, 20boxes
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
	}

	draw() {
		//
	}

	clear() {
		this.ppr.clearRect(0, 0, this._cvs.width, this._cvs.height);
	}
}

class Tetris {
	constructor(paper) {
		this._ppr = paper;
		this._well = ( () => {
			let matrix = new Array(20);

			for (let h = 0; h < 20; h++) {
				matrix[h] = new Array(10);
				for (let w = 0; w < 10; w++) {
					matrix[h][w] = false;
				}
			}

			return matrix;
		})();
	}

	async drawWell(fill) {
		// let tm;
		// console.log(tm = performance.now());
		// await delay(1000);
		for (let x = 0; x < 20; x++) {
			for (let y = 0; y < 10; y++) {
				if (!this._well[x][y]) {
					// y = row, x = col
					this._drawBlock(y, x, fill);
				}
				// await delay(25);
			}
			// await delay(125);
		}
		// console.log(performance.now() - tm);
		// drawing a full well take ~3 in avg
	}

	// ==============================
	// PRIVATE
	// ==============================
	_drawBlock(x, y, fill) {
		this._ppr.fillStyle = fill || "#226633";

		this._ppr.beginPath();
		this._ppr.rect(
			this._calcBlockPos(x),
			this._calcBlockPos(y),
			BLOCK_SIZE - 4, BLOCK_SIZE - 4);
		this._ppr.closePath();
		this._ppr.fill();
		// console.log("drawBlock...", posX, posY);
	}

	_clearBlock(x, y) {
		this._ppr.clearRect(
			this._calcBlockPos(x),
			this._calcBlockPos(y),
			BLOCK_SIZE - 4, BLOCK_SIZE - 4);
		// console.log("clearBlock...", posX, posY);
	}

	_calcBlockPos(coord) {
		return (BLOCK_SIZE + 1) * coord + WELL_PAD + BLOCK_PAD;
	}
}

class Tetromino {
	constructor(tetris) {
		this._tetris = tetris;

		// max, min - inclusive
		// js random -> Math.floor(Math.random() * (max - min + 1) + min)
		this.type = Math.floor(Math.random() * 7);
		console.log("type:", this.type);
		this.state = Math.floor(Math.random() * 2) ? 0 : 2;
		console.log("state:", this.state);

		this.blocks = [
			{x: 0, y: 0},
			{x: 0, y: 0},
			{x: 0, y: 0},
			{x: 0, y: 0}
		];

		switch (this.type) {
			// case 0: this._spawnI(); break;
			// case 1: this._spawnS(); break;
			default: this._spawnS();
			// case 2: this._spawnJ(); break;
			// case 3: this._spawnT(); break;
			// case 4: this._spawnL(); break;
			// case 5: this._spawnZ(); break;
			// case 6: this._spawnO(); break;
		}

		this._test();
	}

	fall() {
		//
	}

	drop() {
		//
	}

	// ==============================
	// PRIVATE
	// ==============================
	async _spawnI() {
		this.blocks[0].x = -1;
		this.blocks[0].y = 3;
		this.blocks[1].x = -1;
		this.blocks[1].y = 4;
		this.blocks[2].x = -1;
		this.blocks[2].y = 5;
		this.blocks[3].x = -1;
		this.blocks[3].y = 6;
	}

	_spawnS() {
		this.blocks[0].x = -2;
		this.blocks[0].y = 4;
		this.blocks[1].x = -2;
		this.blocks[1].y = 5;
		this.blocks[2].x = -1;
		this.blocks[2].y = 5;
		this.blocks[3].x = -1;
		this.blocks[3].y = 6;
	}

	async _test() {
		console.log(this.blocks);
		for (let f = 0; f < 20; f++) {
			console.log("clear...");
			for (let b = 0; b < 4; b++) {
				this._tetris._clearBlock(this.blocks[b].y, this.blocks[b].x);
				// console.log(this.blocks[b].x, this.blocks[b].y);
			}
			// await delay(200);
			console.log("draw...");
			for (let b = 0; b < 4; b++) {
				this.blocks[b].x++;
				this._tetris._drawBlock(this.blocks[b].y, this.blocks[b].x);
				// console.log(this.blocks[b].x, this.blocks[b].y);
			}
			await delay(100);
		}
	}
	// _spawnI
	// _spawnI
	// _spawnI
	// _spawnI
	// _spawnI
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

let tick = -1;
const gameloop = async () => {
	// await delay(100);
	// await delay(125);
	// await delay(150);
	// await delay(175);
	// await delay(200);
	// await delay(225);
	// await delay(250);
	// await delay(500);
	// await delay(750);
	// await delay(1000);
	// console.log(performance.now());

	if (++tick === 0) return;

	requestAnimationFrame(gameloop);
};

// ==================================================
// TEST
// ==================================================

const viewport = new Viewport("viewport");
const grid = new Grid("grid", viewport);
const scene = new Scene("scene", viewport);

grid.draw();
// scene.tetris.drawWell();

const init = () => {
	gameloop();
};

// everthing start here
init();

// 	fill: this._state ? "#226633" : "#aacc55",

