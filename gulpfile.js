const fs = require('fs');
const { series, watch, src, dest } = require('gulp');
const logger = require('gulplog');
const chalk = require('chalk');
const del = require('del');
const moment = require('moment');
const mustache  = require('mustache');
const through = require('through2');
const { minify } = require('html-minifier');

async function clean() {
    return del(['./dist']);
}

async function buildStatic() {
    return src('./static/**/*').pipe(dest('./dist/'));
}

async function buildPages() {
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
}

async function buildPdf() {
    const path = require('path');
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const downloadPath = path.join(__dirname, 'dist/download/cv-dgomes.pdf');

    await page.goto(`file://${path.join(__dirname, 'dist/index.html')}`, {waitUntil: 'networkidle0'});
    
    let data = await page.pdf({ 
        format: 'A4',
        displayHeaderFooter: false
    });

    fs.writeFileSync(downloadPath, data, null);

    await browser.close();
}

/* EXPERIMENTAL */
async function devPdf() {
    const path = require('path');
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const downloadPath = path.join(__dirname, 'dist/download/cv-dgomes.pdf');

    const generatePdf = async function() {
        await page.goto(`file://${path.join(__dirname, 'dist/index.html')}`, {waitUntil: 'networkidle0'});
        await page.setCacheEnabled(false);
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
    
        const data = await page.pdf({ 
            format: 'A4',
            displayHeaderFooter: false
        });

        await del(downloadPath);

        fs.writeFileSync(downloadPath, data, null);
        logger.info(chalk.blue('Generated PDF.'));
    };

    await generatePdf();

    watch(['./static/**/*']).on('change', series(buildStatic, generatePdf));
    watch(['./data/**/*', './content/**/*']).on('change', series(buildPages, generatePdf));

    await new Promise(()=>{});
}

async function runServer() {
    const browserSync = require('browser-sync').create();

    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    watch(['./static/**/*']).on('change', series(buildStatic, browserSync.reload));
    watch(['./data/**/*', './content/**/*']).on('change', series(buildPages, browserSync.reload));

    await new Promise(()=>{});
}

async function publish() {
    const ghpages = require('gh-pages');
    ghpages.publish('dist', cb);
}

exports['clean'] = clean;
exports['dev'] = series(clean, buildStatic, buildPages, runServer);
exports['dev:pdf'] = series(clean, buildStatic, buildPages, devPdf);
exports['build'] = series(clean, buildStatic, buildPages);
exports['build:pdf'] = series(clean, buildStatic, buildPages, buildPdf);
exports['publish'] = publish;
