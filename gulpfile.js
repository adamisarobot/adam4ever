/* Created 2019-02-10 */
var gulp       = require('gulp'),
	babel        = require('gulp-babel'),
	sourcemaps   = require('gulp-sourcemaps'),
	sass         = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	concat       = require('gulp-concat'),
	wait         = require('gulp-wait'),
	imagemin     = require('gulp-imagemin'),
	cache        = require('gulp-cache'),
	del          = require('del'),
	browserSync  = require('browser-sync').create();

/* Paths */
var sassWatch = './src/scss/**/*.scss',
	fontsWatch  = './src/fonts/**/*.+(woff|woff2|ttf|otf)',
	jsWatch     = './src/**/*.js',
	codeWatch   = './**/*.html',
	imagesWatch = './src/images/**/*.+(png|jpg|jpeg|gif|svg)',
	jsExcludes  = '!./src/js/vendors/*.js';

gulp.task('js', function() {
	return gulp
		.src([jsWatch, jsExcludes])
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/preset-env']
			})
		)
		.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});
});

gulp.task('clean:dist', function() {
	return del.sync('dist');
});

gulp.task('sass', function() {
	return gulp
		.src(sassWatch)
		.pipe(wait(500))
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(
			autoprefixer({
				grid: 'no-autoplace'
			})
		)
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', function() {
	return gulp.src(imagesWatch)
		.pipe(cache(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [
						{
							removeViewBox: false,
							collapseGroups: true
						}
					]
				})
			])
		))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
	return gulp.src(fontsWatch)
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('watch', function() {
	gulp.watch(sassWatch, gulp.series('sass'));
	gulp.watch(codeWatch, browserSync.reload);
	gulp.watch(jsWatch, gulp.series('js'));
});

gulp.task('default', gulp.parallel('js', 'sass', 'images', 'fonts', 'browser-sync', 'watch'));
