'use strict';

var path = require('path');
var _ = require('lodash');
var _confPath = '../local.env';
var _conf = require(_confPath) || {};
// Need to do this for working DIR to get priority if run from certain location with ('.')
// Because it gets overrided from config, and line of priority is User set > config set > default
var processCopy = {
    WORKING_DIR: process.env.WORKING_DIR || _conf.WORKING_DIR
};

process.env = _.assign(process.env, _conf, processCopy);

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================

var rootPath = path.normalize(__dirname + '/../../..');
var all = {
    env: process.env.NODE_ENV,

    // cottontail instance strategy
    strategy: process.env.STRATEGY || 'git',

    debug: process.env.DEBUG || true,

    // Root path of server
    root: rootPath,

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    logging: {
        path: rootPath + '/logs'
    },

    store: {
        path: process.env.WORKING_DIR
    },

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'cottontail-secret'
    },

    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    facebook: {
        clientID: process.env.FACEBOOK_ID || 'id',
        clientSecret: process.env.FACEBOOK_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
    },

    twitter: {
        clientID: process.env.TWITTER_ID || 'id',
        clientSecret: process.env.TWITTER_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
    },

    google: {
        clientID: process.env.GOOGLE_ID || 'id',
        clientSecret: process.env.GOOGLE_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
    },

    github: {
        clientID: process.env.GITHUB_ID || 'id',
        clientSecret: process.env.GITHUB_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/github/callback',
        scope: process.env.GUTHUB_SCOPE || ''
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') || {});
