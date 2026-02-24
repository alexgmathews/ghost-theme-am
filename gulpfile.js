const { series, src, dest } = require('gulp');
const pump = require('pump');
const fs = require('fs');
const order = require('ordered-read-streams');

// Core plugins
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const postcss = require('gulp-postcss');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');

// Postcss plugins
const easyimport = require('postcss-easy-import');
const purgecss = require('@fullhuman/postcss-purgecss').default;


function handleError(done) {
    return function (err) {
        return done(err);
    };
}


function css(done) {
    pump([
        src('assets/css/screen.css', { sourcemaps: false }),
        postcss([
            easyimport,
            purgecss({
                content: ['../site-scrape/*.html'],
                safelist: [],
                blocklist: [],
                rejected: false,
                keyframes: true,
                fontFace: false,
                variables: true
            })
        ]),
        csso(),
        dest('assets/built/', { sourcemaps: false })
    ], handleError(done));
}


function getJsFiles(version) {
    const jsFiles = [
        src(`node_modules/@tryghost/shared-theme-assets/assets/js/${version}/lib/**/*.js`),
        src(`node_modules/@tryghost/shared-theme-assets/assets/js/${version}/main.js`),
    ];

    if (fs.existsSync(`assets/js/lib`)) {
        jsFiles.push(src(`assets/js/lib/*.js`));
    }

    jsFiles.push(src(`assets/js/main.js`));

    return jsFiles;
}

function js(done) {
    pump([
        order(getJsFiles('v1'), { sourcemaps: false }),
        concat('main.min.js'),
        uglify(),
        dest('assets/built/', { sourcemaps: false })
    ], handleError(done));
}


function zipper(done) {
    const filename = require('./package.json').name + '.zip';

    pump([
        src([
            '**',
            '!.**',
            '!dist', '!dist/**',
            '!node_modules', '!node_modules/**',
            '!package-lock.json',
            '!yarn.lock',
            '!yarn-error.log',
            '!assets/css', '!assets/css/**',
            '!assets/fonts', '!assets/fonts/**',
            '!assets/js', '!assets/js/**',
            '!gulpfile.js'
        ], { encoding: false }),
        zip(filename),
        dest('dist/')
    ], handleError(done));
}


// Exported tasks
exports.css = css;
exports.js = js;
exports.zip = zipper;
