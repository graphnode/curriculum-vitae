const fs = require('fs');
const util = require('util');
const { task, series, watch, src, dest } = require('gulp');
const logger = require('gulplog');
const chalk = require('chalk');
const del = require('del');
const moment = require('moment');
const mustache  = require('mustache');
const browserSync = require('browser-sync');
const through = require('through2');
const { minify } = require('html-minifier');

task('clean', async function() {
    return del([
        './dist'
    ]);
});

task('build:static', async function() {
    return src('./static/**/*').pipe(dest('./dist/'));
});

task('build:pages', function() {
    let view = {
        firstName: function() { return this.name.split(' ')[0]; },
        lastName: function() { return this.name.split(' ')[1]; },

        currentDate: () => moment().format('YYYY-MM-DD')
    };

    view = Object.assign(view, JSON.parse(fs.readFileSync('./data/resume.json')));

    let partialLoader = function(name) {
        let parts = name.split(' ');
        let template = fs.readFileSync(`./content/partials/${parts[0]}.mustache`, 'utf8');
        let partialView = (parts.length > 1) ? view[parts[1]] : view; 
        let html = mustache.render(template, partialView, partialLoader);
        return html;
    };

    return src(['./content/**/*.mustache', '!./content/partials/**'])
        .pipe(through.obj((vinylFile, encoding, callback) => {
            var transformedFile = vinylFile.clone();
            transformedFile.extname = '.html';

            try {
                let template = vinylFile.contents.toString(encoding);
                let html = mustache.render(template, view, partialLoader);
                transformedFile.contents = Buffer.from(html);
            } catch (e) {
                logger.error(chalk.red('Failed to parse template \'%s\', skipping.'), vinylFile.basename);
                transformedFile.contents = Buffer.from(
                    `<html><body style="margin: 64px">
                        <div style="font-family: consolas; background: black; color: red; padding: 32px;">
                            <h1>Failed to parse template '${vinylFile.basename}'</h1><pre>${e.stack}</pre>
                        </div>
                    </body></html>`
                );
            }

            return callback(null, transformedFile);
        }))
        .pipe(through.obj((vinylFile, encoding, callback) => {
            var transformedFile = vinylFile.clone();
            try {
                transformedFile.contents = Buffer.from(minify(vinylFile.contents.toString(encoding), {
                    html5: true,
                    removeRedundantAttributes: true,
                    removeComments: true,
                    collapseWhitespace: true
                }))
            } catch(e) {
                logger.error(chalk.red('Failed to minify file \'%s\', skipping.'), vinylFile.basename);
                transformedFile.contents = vinylFile.contents;
            }
            return callback(null, transformedFile);
        }))
        .pipe(dest('./dist/'));
});

task('build', series('build:static', 'build:pages'));

task('build:pdf', async function() {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/', {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({ 
        format: 'A4',
        displayHeaderFooter: false
    });

    fs.writeFileSync(`download/cv-dgomes-${moment().format('YYYY-MM-DD')}.pdf`, pdf);

    await browser.close();
    return pdf;
});

task('serve', async function() {
    let bs = browserSync.create();

    bs.init({
        server: {
            baseDir: "./dist"
        }
    });

    watch(['./static/**/*']).on('change', series('build:static', bs.reload));
    watch(['./data/**/*', './content/**/*']).on('change', series('build:pages', bs.reload));

    await new Promise(() => {});
});

task('publish', function(cb) {
    const ghpages = require('gh-pages');
    ghpages.publish('dist', cb);
});

exports.clean = task('clean');
exports.build = task('build');
exports.buildPdf = task('build:pdf');
exports.dev = series('clean', 'build', 'serve');
exports.publish = task('publish');
