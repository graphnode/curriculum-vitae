const fs = require('fs');
const { task, series, watch, src, dest } = require('gulp');
const del = require('del');
const moment = require('moment');
const mustache  = require('mustache');
const browserSync = require('browser-sync');
const through = require('through2');

task('clean', async function() {
    return del([
        './dist'
    ]);
});

task('build:static', async function() {
    return src('./static/**/*.*').pipe(dest('./dist/'));
});

task('build:pages', function() {
    let view = {
        firstName: function() { return this.name.split(' ')[0]; },
        lastName: function() { return this.name.split(' ')[1]; },

        currentDate: () => moment().format('YYYY-MM-DD')
    };

    view = Object.assign(view, JSON.parse(fs.readFileSync('./data/resume.json')));

    return src('./content/**/*.mustache')
        .pipe(through.obj((vinylFile, encoding, callback) => {
            var transformedFile = vinylFile.clone();
            transformedFile.extname = '.html';
            transformedFile.contents = Buffer.from(mustache.render(vinylFile.contents.toString(encoding), view), encoding);
            return callback(null, transformedFile);
        }))
        .pipe(dest('./dist/'));

        /*
    let template = fs.readFileSync('./content/index.mustache', 'utf8');

    let output = mustache.render(template, view);

    fs.mkdirSync('./dist/', { recursive: true });
    fs.writeFileSync('./dist/index.html', output);
        
    return Promise.resolve();*/
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
