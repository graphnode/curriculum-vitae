const moment = require('moment');

module.exports = {
    "name": "Diogo Gomes",
    firstName: function() { return this.name.split(' ')[0]; },
    lastName: function() { return this.name.split(' ')[1]; },

    "job": "Software Developer",

    "email": "diogo@gomes.xyz",

    "url": "https://diogo.gomes.xyz",
    "github": "https://github.com/graphnode",
    "linkedin": "https://www.linkedin.com/in/dgomes-gomes-xyz",

    currentDate: () => moment().format('YYYY-MM-DD'),

    "experience": [
        {
            "when": "03/2020 – Now",
            "where": "Lisbon, Portugal",
            "company": "Millennium (Project)",
            "job": "Senior Software Developer",
            "stuff": [
                "Developed React Native components following Atomic Design System.",
                "Created documentation, proof of concept and component playground in Storybook.",
                "Did proof of concept with React Native Web for web documentation of React Native components.",
                "Managed development tasks for programming team and general project management at programming level."
            ]
        },{
            "when": "01/2017 – Now",
            "where": "Lisbon, Portugal",
            "company": "Axians",
            "job": "Senior Automation, Tools and Support Developer",
            "stuff": [
                "Developed wallboards using Grafana.",
                "Implemented data collectors in Node.js",
                "Implemented automation flows in HP Operations Orchestrator.",
                "Scripts and Utilities in Node.js to manage automation tools.",
                "Managing git repositories for automation team."
            ]
        }, {
            "when": "04/2016 – 12/2016",
            "where": "Lisbon, Portugal",
            "company": "Novabase",
            "job": "Automation, Tools and Support Developer",
            "stuff": [
                "Developed wallboards using Smashing and Ruby.",
                "Created a Skype bot to connect between automation system and client.",
                "Developed Client Portal in ServiceNow using Javascript, Angular and Bootstrap.",
                "Scripts, Utilities and Web Services in Node.js to manage automation tools."
            ]
        }, {
            "when": "02/2016 – 04/2016",
            "where": "Lisbon, Portugal",
            "company": "Rumos",
            "job": "Integration and Plugin Developer",
            "stuff": [
                "​​Developed plugins and integrations for CA Business Service Insight.",
                "Implemented output formatters for Office files in C# using OOXML."
            ]
        }, {
            "class": "print-hide",
            "when": "2010 – 02/2016",
            "where": "Lisbon, Portugal",
            "company": "FlowOptions",
            "job": "Business Solutions Developer",
            "description": "Web Projects, plugins for existing platforms and web server management.",
            "stuff": [
                "Development of the back end and front end of public websites from design templates",
                "Integration with the Portuguese Citezen Card authentication system.",
                "Refactoring an internal CMS to use updated technologies.",
                "Developed a small issues/tickets application from scratch in ASP.NET.",
                "Integrations with Remedy BMC: Ported C++ plugins into Java. Updated obsolete plugins for new versions.",
                "Developed middleware for Oracle Identity Management in Java.",
                "Basic management of internal servers (IIS &amp; SQL Server) and Microsoft Azure.",
                "Used Node.js to make utility scripts to export and manage data."
            ]
        }, {
            "class": "print-hide",
            "when": "2010",
            "where": "Lisbon, Portugal",
            "company": "FlowOptions",
            "job": "Vocational Course Internship",
            "description": "The vocational course internship in a professional environment.",
            "stuff": [
                "Added features and did maintenance for a proprietary ASP.NET C# CMS.",
                "Created a temporary landing page for client.",
                "Fixed security failure in the public website."
            ]
        }, {
            "class": "print-hide",
            "when": "2008",
            "where": "Lourinhã, Portugal",
            "company": "LourInfor",
            "job": "High School Internship",
            "description": "Adquired professional experience as a web developer.",
            "stuff": [
                "Development of a simple PHP website with a MySQL database.",
                "Configuration and deployment of the website in an Apache server."
            ]
        }
    ],

    "education": [{
            "when": "2008 – 2009",
            "where": "Citeforma",
            "description": "Software Developer Vocational Course",
            "stuff": [
                "Programming in multiple languages; Databases; Project Management; Operating Systems; Hardware installation and maintenance."
            ]
        }, {
            "when": "– 2007",
            "where": "Escola Madeira Torres",
            "description": "12º Year",
            "stuff": [
                "Finished compulsory education (Course of Science and Technology)."
            ]
        }
    ],

    "competencies": [{
            "area": "Web",
            "stuff": [
                "Experience in the development of <strong>Single Page Applications</strong> using the the Angular.js framework, online interactive tools and the user of new technologies like <strong>WebSockets</strong>, <strong>WebGL</strong> and <strong>WebRTC</strong>.",
                "Implementation of <strong>REST</strong> services (<strong>Node.js</strong> and <strong>ASP.NET WebAPI</strong>), public websites using the MVC architecture (<strong>ASP.NET MVC</strong>).",
                "Deep knowledge in using transpilers like <strong>LESS</strong> and <strong>SASS/SCSS</strong> for CSS and <strong>Typescript</strong> for Javascript.",
                "Capable to using <strong>mocha</strong> and addional libraries for unit testing, continuous integration using <strong>travis-ci</strong> and other tools for code coverage.",
                "Basic knowledge in using <strong>Webpack</strong> and some knowledge in using <strong>Gulp</strong>."
            ]
        }, {
            "area": "Desktop and Mobile",
            "stuff": [
                "Developed components in <strong>React Native</strong> using <strong>Storybook</strong> and <strong>Styled Components</strong>.",
                "Organized design system tokens using <strong>Style Dictionary</strong>.",
                "Knowledge in the development of (or porting of web apps to) desktop applications using web tecnology using tools like <strong>NW.js</strong> and <strong>Electron</strong>.",
                "Experience developing applications in <strong>C#</strong> and <strong>WinForms</strong>."
            ]
        }, {
            "area": "Development Workflows",
            "stuff": [
                "A lot of experience using versioning control <strong>Git</strong> making some collaboration with open source on <strong>Github</strong>.",
                "Personal use of <strong>TDD</strong> methodology and participated in <strong>SCRUM</strong> at work.",
                "Basic knowledge of TFS and SVN."
            ]
        }, {
            "area": "Cloud",
            "stuff": [
                "Worked with big cloud providers like <strong>AWS</strong>, <strong>GCP</strong> and <strong>Azure</strong> and smaller ones like <strong>DigitalOcean</strong> and <strong>Linode</strong>.",
                "Used <strong>Terraform</strong> for infrastructure-as-code and experimented with <strong>Kubernetes</strong>.",
                "Mantains a <strong>Docker</strong> infrastructure in a small home server."
            ]
        }, {
            "area": "IOT",
            "stuff": [
				"Experimented with Node-RED and REST and developed code for <strong>ESP8266</strong> and <strong>Arduino</strong>."
            ]
        }, {
            "area": "Machine Learning & AI",
            "stuff": [
                "Experimented with TensorFlow.js and ML.NET."
            ]
        }, {
            "area": "Databases",
            "stuff": [
                "Experience in <strong>SQL</strong> and database management in <strong>Microsoft SQL Server</strong> and <strong>MySQL/MariaDB</strong>.",
                "Implemented application that use <strong>NoSQL</strong> servers like <strong>MongoDB</strong>, <strong>RethinkDB</strong> and <strong>CouchDB</strong>."
            ]
        }, {
            "area": "Operating Systems",
            "stuff": [
                "Server management in <strong>Linux</strong> (preferentially Debian/Ubuntu), <strong>Docker</strong> and basic knowledge of ZFS.",
                "Mostly uses Microsoft <strong>Windows</strong> for day-to-day development and is capable of basic management of <strong>Windows Servers</strong> with <strong>IIS</strong>."
            ]
        }, {
            "area": "Miscellaneous",
            "stuff": [
                "Years of experience in using <strong>Visual Studio</strong>.",
                "Deep experience in using editors like <strong>VSCode</strong>, <strong>Atom</strong>, <strong>Brackets</strong> and <strong>Eclipse</strong> for Java development.",
                "Some knowledge in Unity3D development."
            ]
        }
    ]
};