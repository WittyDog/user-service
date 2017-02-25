'use strict'

var Joi = require('joi');

module.exports.creation = Joi.object({
    login 		: Joi.string().alphanum().min(3).max(20).required().example('soso87'),
    password 	: Joi.string().example('azerty'),
    email 		: Joi.string().email().example('sophie.fonfec@email.com'),
    firstname 	: Joi.string().example('sophie'),
    lastname 	: Joi.string().example('fonfec'),
    company 	: Joi.string().example('Super Company'),
    function 	: Joi.string().example('something'),
    nir 		: Joi.number().min(100000000000000).max(999999999999999).example(123456789123456)
});

module.exports.update = Joi.object({
	_id			: Joi.string().required(),
    login 		: Joi.string().alphanum().min(3).max(20).example('soso87'),
    password 	: Joi.string().example('azerty'),
    email 		: Joi.string().email().example('sophie.fonfec@email.com'),
    firstname 	: Joi.string().example('sophie'),
    lastname 	: Joi.string().example('fonfec'),
    company 	: Joi.string().example('Super Company'),
    function 	: Joi.string().example('something'),
    nir 		: Joi.number().min(100000000000000).max(999999999999999).example(123456789123456)
});

