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
var fs = require('fs');
var chalk = require('chalk');
var logger = require('../server/components/logger');
var config = require('./config');

var info = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/../package.json')).toString());

var parseOptions = function (options) {

    process.env.NODE_INTERPRETER = options.nodeInterpreter || 'node';
    process.env.BASE_DIR = options.baseDir || 'node';
    process.env.CONFIG = options.config || false;

    if (options.env) {
        process.env.NODE_ENV = options.env;
    }
    
};

program
    .version(info.version || '0.0.1')
    // Setup
    .command('setup')
    .description('Configure Cottontail.')
    .action(function (options) {
        console.log(chalk.green.italic('Running Cottontail setup.'));

        var questions = [
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
        
        prompt(questions, function (answers) {
            config.create(answers, __dirname + '/..', function () {
                console.log(chalk.green.italic('Config successfully created.'))
            });
        });
    });

program
    // Run
    .command('run')
    .description('Run Cottontail web app.')
    .action(function (options) {
        parseOptions(options.parent);
        logger.info('Starting Cottontail..');
        logger.info('Available commands: ');
        logger.info('start, stop, end(alias: close), restart (alias: rs) \n');
        spawn.start();
    });

program
    // Available Options
    .option('-e, --env [env]', 'Specify environment.')
    .option('-c, --config [config]', 'Specify custom config file.')
    .option('-n, --node-interpreter [nodeInterpreter]', 'Specify node interpreter')
    .option('-b, --base-dir [baseDir]', 'Specify base directory when running app');

program.parse(process.argv);

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

// Accept user input after commands run
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (data) {
    data = (data + '').trim().toLowerCase();

    if (typeof commands[data] === 'function') {
        commands[data]();
    }
});

