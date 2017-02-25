'use strict';

const async     = require('async');
const envConfig = require('../environments/all');

module.exports.init = server => {
    return new Promise((resolve, reject) => {
        async.series({
            good(done) {
                server.register({
                    register : require('good')
                }, done);
            },
            blipp(done) {
                server.register({
                    register : require('blipp'),
                    options  : {
                        showStart : envConfig.log.showRouteAtStart,
                        showAuth  : true
                    }
                }, done);
            },
            boom(done) {
                server.register({
                    register : require('hapi-boom-decorators')
                }, done);
            },
            swagger(done) {
                server.register([
                    require('inert'),
                    require('vision'),
                    {
                        'register' : require('hapi-swagger')
                    }
                ], done);
            },
            ioClient(done) {
                server.register({
                    register : require('../../app/plugins/ioClient'),
                    options : {
                        server : 'http://127.0.0.1:9090'
                    }
                }, done);
            }
        }, err => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
};