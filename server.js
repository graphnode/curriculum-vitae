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