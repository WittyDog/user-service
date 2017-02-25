'use strict';

const jsonToMongoose    = require('json-mongoose');
const async             = require('async');
const iut_encrypt       = require('iut-encrypt-lala');
const mongoose          = require('k7-mongoose').mongoose();
const schema            = require('../schemas/user');

module.exports = jsonToMongoose({

    mongoose    : mongoose,
    collection  : 'user',
    schema      : schema.creation,
    pre         : {
        save : (doc, next) => {
            async.parallel({
                password : done => {
                	doc.password = iut_encrypt.encodeSha1(doc.password);
                    done();
                }
            }, next);
        }
    },
    schemaUpdate : (schema) => {
        schema.login.unique = true;
        schema.email.unique = true;
        schema.nir.unique   = true;

        return schema;
    }

});