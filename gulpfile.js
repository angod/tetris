const gulp = require("gulp");
const connect = require("gulp-connect");

const server = function(done) {
	connect.server({
		port: 1337,
		root: "./dist",
		livereload: true
	});

	done();
}

const livereload = function(done) {
	gulp.src("./dist/*.html")
		.pipe(connect.reload());

	done();
}

const watch = function(done) {
	gulp.watch([
		"./dist/index.html",
		"./dist/tetris.css",
		"./dist/tetris.js"
		], gulp.series(livereload));

	done();
}

// exports.livereload = livereload
// exports.watch = watch;
// exports.server = server;
exports.default = gulp.series(server, watch);

