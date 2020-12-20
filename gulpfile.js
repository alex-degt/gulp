const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const extReplace = require("gulp-ext-replace");
const notify = require("gulp-notify");
const del = require("del");

const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const pug = require("gulp-pug");
const htmlmin = require("gulp-htmlmin");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const webp = require("imagemin-webp");
const newer = require("gulp-newer");
const svgstore = require("gulp-svgstore");

function browsersync() {
	browserSync.init({
		server: { baseDir: "./docs/" },
		notify: false,
		online: false,
	});
}

function scripts() {
	return src("./src/js/**/*.js").pipe(dest("./docs/js/")).pipe(browserSync.stream());
}

function jade() {
	return (
		src("./src/pug/pages/**/*.pug")
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
			.pipe(pug({ pretty: true }))
			// .pipe(
			// 	htmlmin({
			// 		collapseWhitespace: true,
			// 		removeComments: true,
			// 	})
			// )
			.pipe(dest("./docs/"))
			.pipe(browserSync.stream())
	);
}

function styles() {
	return (
		src("./src/sass/**.sass")
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
			// .pipe(concat("styles.min.css"))
			.pipe(
				autoprefixer({
					overrideBrowserslist: ["last 10 versions"],
					grid: true,
				})
			)
			.pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
			.pipe(dest("./docs/css/"))
			.pipe(browserSync.stream())
	);
}

function imagesoptimize() {
	return src("./src/img/src/**/*")
		.pipe(newer("./src/img/dest/"))
		.pipe(imagemin([imagemin.optipng({ optimizationLevel: 3 }), imagemin.mozjpeg({ progressive: true }), imagemin.svgo()]))
		.pipe(dest("./src/img/dest/"));
}

// function imgwebp() {
// 	return src(["./src/img/src/**/*.*", "!./src/img/src/favicon/**/*.*", "!./src/img/src/icons/**/*.*"])
// 		.pipe(imagemin([webp({ quality: 80 })]))
// 		.pipe(extReplace(".webp"))
// 		.pipe(dest("./src/img/dest/"));
// }

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
	return src("./src/fonts/**/*.*").pipe(dest("./docs/fonts/"));
}
function copyimg() {
	return src(["./src/img/dest/**/*", "!./src/img/dest/**/sprite.svg"]).pipe(dest("./docs/img/"));
}
function copylibs() {
	return src("./src/libs/**/*").pipe(dest("./docs/libs/"));
}

function startwatch() {
	watch("./src/**/*.js", scripts);
	watch("./src/**/*.sass", styles);
	watch("./src/**/*.pug", jade);
	watch("./src/img/src/**/*", imagesoptimize);
	// watch("./src/img/src/**/*", imgwebp);
	watch("./src/img/src/**/icon-*.svg", sprite);
	watch("./src/img/dest/**/*", copyimg);
	watch("./src/libs/**/*", copylibs);
	watch("./src/fonts/**/*", copyfonts);
}

exports.default = series(cleandocs, imagesoptimize, sprite, copyimg, parallel(styles, jade, scripts, copylibs, copyfonts, parallel(browsersync, startwatch)));
