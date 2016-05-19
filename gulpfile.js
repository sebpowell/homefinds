/////////////////////////////////////////////////////
// Gulp Dependencies
/////////////////////////////////////////////////////

var gulp = require("gulp"),
		autoprefixer = require("gulp-autoprefixer"),
		concat = require("gulp-concat"),
		jade = require('gulp-jade'),
		sass = require("gulp-sass"),
		uglify = require("gulp-uglify");;



/////////////////////////////////////////////////////
// HTML
/////////////////////////////////////////////////////


gulp.task("jade", function() {
	gulp.src('views/**/!(_)*.jade')
		.pipe(jade({
			pretty: true,
			locals: {
				base: "assets/",
				images: "assets/images/",
				repo: "https://github.com/sebpowell/barebones-sass",
				title: "Homefinds.co.uk | Discover exclusive discounts for the best homeware brands and home services",
				description: "Answer a few simple questions and see who would be the best mayor for you.",
				email: "hello@casanueva.com"
			}
		}))
		.pipe(gulp.dest("./"));
});

/////////////////////////////////////////////////////
// SASS
/////////////////////////////////////////////////////

gulp.task('sass', function () {
	gulp.src('assets/css/style.scss')
		.pipe(sass({
			outputStyle: "compact",
		}).on('error', sass.logError))
		// .pipe(autoprefixer({browsers: ['last 2 versions'], remove: false}))
		.pipe(gulp.dest(function(file) {
			return file.base;
		}));
	});

/////////////////////////////////////////////////////
// JavaScript
/////////////////////////////////////////////////////

gulp.task("uglify", function() {
	gulp.src(["assets/javascript/vendor/*.js", "assets/javascript/components/*.js"])
		.pipe(concat("application.js"))
		.pipe(uglify())
		.pipe(gulp.dest("assets/javascript/"))
});

/////////////////////////////////////////////////////
// Watch
/////////////////////////////////////////////////////

gulp.task("watch", function() {
	gulp.watch(['assets/css/**/*.scss'], ['sass']);
	gulp.watch(['assets/javascript/components/*.js'], ['uglify']);
	// gulp.watch(['views/**/*.jade'], ['jade']);
});

gulp.task("default", ["watch"], function() {

});
