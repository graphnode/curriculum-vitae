const fs = require('fs');
const path = require('path');
const { series, watch, src, dest } = require('gulp');
const logger = require('gulplog');
const chalk = require('chalk');
const del = require('del');
const mustache  = require('mustache');
const through = require('through2');
const { minify } = require('html-minifier');

const config = require('./config.json');

async function clean() {
    return del(config.buildPath);
}

async function buildStatic() {
    return src(path.resolve(config.assetsPath, '**', '*')).pipe(dest(config.buildPath));
}

function cleanAndRequire(id) {
    // Purge data cache and children, recursively.
    const resolvedId = require.resolve(id);
    const cachedIds = Object.keys(require.cache);

    let toRemove = [resolvedId];
    let count = 0;

    while (toRemove.length !== 0) {
        let currentId = toRemove.pop();
        toRemove.push(...cachedIds.filter(m => require.cache[m] && require.cache[m].parent && require.cache[m].parent.id === currentId));
        delete require.cache[currentId];
        count++;
    }

    logger.info('Cleaned %s entries from cache.', chalk.magenta(count));

    return require(id);
}

async function buildPages() {
    const view = cleanAndRequire(path.resolve(config.dataPath, config.dataEntry));

    let partialLoader = function(name) {
        let parts = name.split(' ');
        let template = fs.readFileSync(path.resolve(config.pagesPartialsPath, `${parts[0]}.mustache`), 'utf8');
        let partialView = (parts.length > 1) ? view[parts[1]] : view; 
        let html = mustache.render(template, partialView, partialLoader);
        return html;
    };

    return src([config.pagesPath + '/**/*.mustache', '!' + config.pagesPartialsPath + '/**'])
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
        .pipe(dest(config.buildPath));
}

async function buildPdf() {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const downloadPath = path.resolve(config.buildPath, 'download/cv-dgomes.pdf');

    await page.goto(`file://${path.resolve(config.buildPath, 'index.html')}`, {waitUntil: 'networkidle0'});
    
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

    const downloadPath = path.join(__dirname, config.buildPath, 'download/cv-dgomes.pdf');

    const generatePdf = async function() {
        await page.goto(`file://${path.resolve(config.buildPath, 'index.html')}`, {waitUntil: 'networkidle0'});
        await page.setCacheEnabled(false);
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
    
        const data = await page.pdf({
            format: 'A4'
        });

        await del(downloadPath);

        fs.writeFileSync(downloadPath, data, null);
        logger.info(chalk.blue('Generated PDF.'));
    };

    await generatePdf();
    

    watch([config.assetsPath + '/**/*']).on('change', series(buildStatic, generatePdf));
    watch([config.dataPath + '/**/*', config.pagesPath + '/**/*']).on('change', series(buildPages, generatePdf));

    await new Promise(()=>{});
}

async function runServer() {
    const browserSync = require('browser-sync').create();

    browserSync.init({
        server: {
            baseDir: config.buildPath
        }
    });

    watch([config.assetsPath + '/**/*']).on('change', series(buildStatic, browserSync.reload));
    watch([config.dataPath + '/**/*', config.pagesPath + '/**/*']).on('change', series(buildPages, browserSync.reload));

    await new Promise(()=>{});
}

function publish(cb) {
    const ghpages = require('gh-pages');
    ghpages.publish(config.buildPath, cb);
}

exports['clean'] = clean;
exports['dev'] = series(clean, buildStatic, buildPages, runServer);
exports['dev:pdf'] = series(buildStatic, buildPages, devPdf);
exports['build'] = series(clean, buildStatic, buildPages);
exports['build:pdf'] = series(clean, buildStatic, buildPages, buildPdf);
exports['publish'] = publish;
