#! /usr/bin/env node
/**
 * Created by filip on 8/25/15.
 */
"use strict";

var _ = require('lodash');
var path = require('path');
var program = require('commander');
var spawn = require('./spawn');
var prompt = require('./prompt');
var fs = require('fs-extra');
var chalk = require('chalk');
var logger = require('../server/components/logger');
var config = require('./config');

var cottontailRoot = __dirname + '/../';

var info = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/../package.json')).toString());

var parseOptions = function (options) {

    process.env.NODE_INTERPRETER = options.nodeInterpreter || 'node';
    process.env.BASE_DIR = options.baseDir || 'node';
    process.env.CONFIG = options.config || false;

    if (options.env) {
        process.env.NODE_ENV = options.env;
    }
    
};

var getQuestions = function () {
    return [
        {
            name: 'NODE_ENV',
            message: 'Set node env:',
            default: 'production'
        },
        {
            name: 'GITHUB',
            message: 'Enable Github auth',
            default: false,
            type: 'confirm'
        },
        {
            when: function (props) {
                return props.GITHUB;
            },
            name: 'GITHUB_ID',
            message: 'Github id:'
        },
        {
            when: function (props) {
                return props.GITHUB;
            },
            name: 'GITHUB_SECRET',
            message: 'Github secret:'
        },
        {
            when: function (props) {
                return props.GITHUB;
            },
            name: 'GITHUB_SCOPE',
            message: 'Github scope:'
        },
        {
            name: 'STRATEGY',
            message: 'Set cottontail strategy: ',
            type: 'list',
            choices: ['local', 'git', 'mongo']
        },
        {
            name: 'DEBUG',
            message: 'Output debug into console?',
            type: 'confirm',
            default: true
        },
        {
            when: function (props) {
                return props.DEBUG;
            },
            name: 'DEBUG_LEVEL',
            message: 'Set debug level',
            type: 'list',
            choices: ['all', 'debug', 'error', 'info', 'warn']
        }
    ];
};

var promptUser = function (callback) {

    prompt(getQuestions(), function (answers) {
        config.create(answers, cottontailRoot, callback || function () {});
    });

};

var runCottontail = function () {

    console.log('Starting Cottontail..');
    console.log('Available commands: ');
    console.log('start, stop, end(alias: close), restart (alias: rs) \n');

    spawn.start();

};

program
    .version(info.version || '0.0.1')
    // Setup
    .command('setup')
    .description('Configure Cottontail.')
    .action(function (options) {
        var configFile = options.parent.config;

        console.log(chalk.green.italic('Running Cottontail setup.'));

        var successCallback = function () {
            console.log(chalk.green.italic('Config successfully created.'));
            process.exit(0);
        };

        if (configFile) {

            config.fromFile(configFile, cottontailRoot, successCallback);

        } else {
            promptUser(successCallback);
        }


    });

program
    // Run
    .command('run')
    .description('Run Cottontail web app.')
    .action(function (options) {
        var configFile = options.parent.config;

        var successCallback = function () {
            console.log(chalk.green.italic('Config successfully created.'));
            runCottontail();
        };

        parseOptions(options.parent);

        if (configFile) {
            console.log('Got config file: ', chalk.magenta.italic(configFile));
            config.fromFile(configFile, cottontailRoot, successCallback);
        } else {
            runCottontail();
        }

    });

program
    // Available Options
    .option('-e, --env [env]', 'Specify environment.')
    .option('-c, --config [config]', 'Specify custom config file.')
    .option('-n, --node-interpreter [nodeInterpreter]', 'Specify node interpreter')
    .option('-b, --base-dir [baseDir]', 'Specify base directory when running app');

program.parse(process.argv);

/**
 * Commands available  during cottotail run
 *
 * @type {{stop: Function, start: Function, restart: Function, close: Function, end: Function, rs: Function}}
 */
var commands = {
    
    stop: function () {
        console.log(chalk.green.italic('> Stoping server.'));
        spawn.stop();
    },

    start: function () {
        console.log(chalk.green.italic('> Starting server.'));
        spawn.start();
    },

    restart: function () {
        console.log(chalk.green.italic('> Restarting server.'));
        spawn.restart();
    },

    close: function () {
        console.log(chalk.green.italic('> Closing process.'));
        this.stop();
        process.exit(0);
    },

    end: function () {
        return this.close();
    },

    rs: function () {
        return this.restart();
    }

};

// Accept user input after cottontail run ( continue listening on stdin )
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (data) {
    data = (data + '').trim().toLowerCase();

    if (typeof commands[data] === 'function') {
        commands[data]();
    }
});


