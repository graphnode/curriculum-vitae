const fs = require('fs');
const { series, watch, task } = require('gulp');
const del = require('del');
const moment = require('moment');

async function clean() {
    const deletedPaths = await del(['index.html']);
    console.log('Deleted files and directories:\n', deletedPaths.join('\n'));
}

async function build() {
    
    const mustache  = require('mustache');

    let view = {
        firstName: function() { return this.name.split(' ')[0]; },
        lastName: function() { return this.name.split(' ')[1]; },

        currentDate: () => moment().format('YYYY-MM-DD')
    };

    view = Object.assign(view, require('./data/resume.json'));

    let template = fs.readFileSync('templates/index.mustache', 'utf8');

    let output = mustache.render(template, view);

    fs.writeFileSync('index.html', output);
}

async function buildPdf() {
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
}

async function serve() {
    const express = require('express');
    const app = express();
    const port = 3000;
    
    app.use(express.static('.'));
    app.listen(port, () => console.log(`Listening on port ${port}!`));

    watch(['./assets/**/*', './data/**/*', './templates/**/*']).on("change", () => build());

    await new Promise(() => {});
}

exports.clean = clean;
exports.build = build;
exports.buildpdf = buildPdf;
exports.default = series(clean, build, serve);
