const { src, dest, parallel, series, watch } = require("gulp");

const browserSync = require("browser-sync").create();
const newer = require("gulp-newer");
const del = require("del");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const extreplace = require("gulp-ext-replace");
const rename = require("gulp-rename");

const uglify = require("gulp-uglify-es").default;
const eslint = require("gulp-eslint");
const rigger = require("gulp-rigger");

const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const shortсss = require("gulp-shorthand");
const cleancss = require("gulp-clean-css");

const pug = require("gulp-pug");
const htmlformatter = require("gulp-pretty-html");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");

function browsersync() {
	browserSync.init({
		server: { baseDir: "./docs/" },
		notify: false,
		online: false,
	});
}

function scriptsDev() {
	return src("./src/js/index.js").pipe(rigger()).pipe(eslint()).pipe(eslint.format()).pipe(concat("scripts.min.js")).pipe(dest("./docs/js/")).pipe(browserSync.stream());
}

function scriptsProd() {
	return src("./src/js/index.js").pipe(rigger()).pipe(uglify()).pipe(concat("scripts.min.js")).pipe(dest("./docs/js/"));
}

function jade() {
	return src("./src/pug/pages/**/*.pug")
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: "Pug",
						sound: false,
						message: err.message,
					};
				}),
			})
		)
		.pipe(pug())
		.pipe(
			htmlformatter({
				indent_size: 1,
				indent_char: "	",
			})
		)
		.pipe(dest("./docs/"))
		.pipe(browserSync.stream());
}

function stylesDev() {
	return src("./src/sass/**.sass")
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: "Styles",
						sound: false,
						message: err.message,
					};
				}),
			})
		)
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(shortсss())
		.pipe(concat("styles.min.css"))
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
		.pipe(dest("./docs/css/"))
		.pipe(browserSync.stream());
}

function stylesProd() {
	return src("./src/sass/**.sass")
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: "Styles",
						sound: false,
						message: err.message,
					};
				}),
			})
		)
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(shortсss())
		.pipe(concat("styles.min.css"))
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
		.pipe(dest("./docs/css/"));
}

function imagesoptimize() {
	return src("./src/img/src/**/*")
		.pipe(newer("./src/img/dest/"))
		.pipe(imagemin([imagemin.optipng({ optimizationLevel: 3 }), imagemin.mozjpeg({ progressive: true }), imagemin.svgo()]))
		.pipe(dest("./src/img/dest/"));
}

function imgWebp() {
	return src("./src/img/src/content/**/*")
		.pipe(imagemin(imagemin({ quality: 80 })))
		.pipe(extreplace(".webp"))
		.pipe(dest("./src/img/dest/content/"));
}

function sprite() {
	return src("./src/img/src/**/icon-*.svg")
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(rename("sprite.svg"))
		.pipe(dest("./src/img/src/"));
}

function cleandocs() {
	return del("./docs/**/*");
}
function copyfonts() {
	return src("./src/fonts/**/*").pipe(dest("./docs/fonts/"));
}
function copyimg() {
	return src(["./src/img/dest/**/*", "!./src/img/dest/**/sprite.svg"]).pipe(dest("./docs/img/"));
}
function copylibs() {
	return src("./src/libs/**/*").pipe(dest("./docs/libs/"));
}

function startwatch() {
	watch("./src/**/*.js", scriptsDev);
	watch("./src/**/*.sass", stylesDev);
	watch("./src/**/*.pug", jade);
	watch("./src/img/src/**/*", imagesoptimize);
	watch("./src/img/src/content/*", imgWebp);
	watch("./src/img/src/**/icon-*.svg", sprite);
	watch("./src/img/dest/**/*", copyimg);
	watch("./src/libs/**/*", copylibs);
	watch("./src/fonts/**/*", copyfonts);
}

exports.dev = series(cleandocs, imagesoptimize, imgWebp, sprite, copyimg, parallel(stylesDev, jade, scriptsDev, copylibs, copyfonts, parallel(browsersync, startwatch)));

exports.prod = series(cleandocs, imagesoptimize, imgWebp, sprite, copyimg, parallel(stylesProd, jade, scriptsProd, copylibs, copyfonts));

exports.scripts = series(scriptsProd);

exports.styles = series(stylesProd);

exports.img = series(imagesoptimize, imgWebp, copyimg);
