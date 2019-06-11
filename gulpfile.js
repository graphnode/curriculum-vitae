const { series, watch, task, src, dest } = require('gulp');
const del = require('del');

function clean(cb) {
    del.sync('docs/**');

    cb && cb();
}

function build(cb) {
    const fs        = require('fs');
    const mustache  = require('mustache');
    const moment    = require('moment');
    const sass      = require('sass');

    fs.mkdirSync('docs', { recursive: true });

    let view = {
        firstName: function() { return this.name.split(' ')[0]; },
        lastName: function() { return this.name.split(' ')[1]; },

        currentDate: () => moment().format('YYYY-MM-DD')
    };

    let data = JSON.parse(fs.readFileSync('src/resume.json', 'utf8'));

    view = Object.assign(view, data);

    let template = fs.readFileSync('src/index.mustache', 'utf8');
    fs.writeFileSync('docs/index.html', mustache.render(template, view));

    fs.mkdirSync('docs/styles', { recursive: true });
    fs.writeFileSync('docs/styles/screen.css', sass.renderSync({file: "src/styles/screen.scss"}).css);
    fs.writeFileSync('docs/styles/print.css', sass.renderSync({file: "src/styles/print.scss"}).css);

    src(['src/**/*', '!src/**/*.mustache', '!src/**/*.scss', '!src/**/resume.json']).pipe(dest('docs/'));

    cb && cb();
}

function serve(cb) {
    const express = require('express');
    const app = express();
    const port = 3000;
    
    app.use(express.static('docs'));
    app.listen(port, () => console.log(`Listening on port ${port}!`));

    watch(['./src/**/*']).on("change", (f) => {
        console.log(`File changed: ${f}`);
        build();
    });
}

exports.build = build;
exports.clean = clean;
exports.default = series(clean, build, serve);
