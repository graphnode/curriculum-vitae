const { series, watch, task } = require('gulp');

function clean(cb) {
    // body omitted
    cb();
}

function build(cb) {
    const util      = require('util');
    const fs        = require('fs');
    const mustache  = require('mustache');
    const moment    = require('moment');

    let view = {
        firstName: function() { return this.name.split(' ')[0]; },
        lastName: function() { return this.name.split(' ')[1]; },

        currentDate: () => moment().format('YYYY-MM-DD')
    };

    view = Object.assign(view, require('./data/resume.json'));

    let template = fs.readFileSync('templates/index.mustache', 'utf8');

    let output = mustache.render(template, view);

    fs.writeFileSync('index.html', output);

    cb();
}

function serve(cb) {
    const express = require('express');
    const app = express();
    const port = 3000;
    
    app.use(express.static('.'));
    app.listen(port, () => console.log(`Listening on port ${port}!`));

    watch(['./assets/**/*', './data/**/*', './templates/**/*']).on("change", build);
}

exports.build = build;
exports.default = series(clean, build, serve);
