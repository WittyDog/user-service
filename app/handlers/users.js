'use strict';

const _ = require('lodash');
const async = require('async');
const iut_encrypt = require('iut-encrypt-lala');
const faker = require('faker');

module.exports.creation = (request, response) => {

	let model = new request.server.database.user();
	model.set(request.payload);
	
	model.save( (error,saved) => {
		if(error) {
			console.log(error)
			response.serverUnavailable("The database is not responding.");
		}

		request.server.ioClient.emit('registration', request.payload, (data) => {
			response(_.omit(saved, ['password','nir'])).code(201);
		});
	});
	
    
};

module.exports.deletion = (request, response) => {

	let model = request.server.database.user;
	model.remove({"_id": request.params.id}, null, null).then(result => {

		response(result);

	}).catch( err => {
		console.log(err);
		response.serverUnavailable("The database is not responding.");
	});
    
};

module.exports.update = (request, response) => {

	let model = request.server.database.user;

	let changes = _.omit(request.payload, ['_id']);

	if(_.has(changes, 'password'))
		changes.password = iut_encrypt.encodeSha1(request.payload.password);

	model.findOneAndUpdate({"_id": request.payload._id}, {$set: changes}).then( result => {
		if(!result)
			response.badData("The user is not found in the database.");

		response(_.omit(result, ['password','nir'])).code(201);

	}).catch( err => {
		console.log(err);
		response.serverUnavailable("The database is not responding.");
	});
    
};

module.exports.display = (request, response) => {

	let model = request.server.database.user;
	model.findOne({"_id": request.params.id}, null, null).then( result => {

		if(result)
			response(result);
		else
			response.badData("The id does not match with any user in the database.");

	}).catch( err => {
		response.serverUnavailable("The database is not responding.");
	});

    
};

module.exports.displayAll = (request, response) => {

	let model = request.server.database.user;

	model.find({}, null, null).then( result => {

		response(result);

	}).catch( err => {
		response.serverUnavailable("The database is not responding.");
	});

    
};

module.exports.authentification = (request, response) => {

	let model = request.server.database.user;

	let query = {
		"login": request.payload.login, 
		"password": iut_encrypt.encodeSha1(request.payload.password)
	};

	model.findOne(query, null, null).then( result => {

		if(result)
			response("You are authentified.");
		else
			response.badData('The login or the password is wrong.');

	}).catch( err => {
		response.serverUnavailable("The database is not responding.");
	});    
};

module.exports.reset = (request, response) => {

	let model = request.server.database.user;

	let plaintextPassword = faker.internet.password();
	let encryptedPassword = iut_encrypt.encodeSha1(plaintextPassword);

	console.log(plaintextPassword);

	model.findOneAndUpdate({"login": request.params.login}, {$set: {"password": encryptedPassword}}).then(result => {
		
		if (!result) {
            response.badData("The login does not match with any user in the database.");
        }

		result.password = plaintextPassword;

		request.server.ioClient.emit('password-reset', result, (data) => {
			response(result);
		});

	}).catch(err => {
		response.serverUnavailable("The database is not responding.");
	});
    
};

module.exports.generation = (request, response) => {

	let users = [];

	for(let i=0 ; i<100 ; i++) {
		users.push({
		    login : faker.internet.userName(),
		    password : faker.internet.password(),
		    email : faker.internet.email(),
		    firstname : faker.name.firstName(),
		    lastname : faker.name.lastName(),
		    company : faker.company.companyName(),
		    function : faker.name.jobTitle(),
		    nir : faker.random.number({min:100000000000000, max:999999999999999})
		});
	}
	
	let model;

	// Some of the users will not be saved given that their login already exist in the database, that is why I use a counter

	let counter = 0;

	async.each(users, (user, callback) => {

			model = new request.server.database.user();
			model.set(user);
			model.save( (error,saved) => {
				if(saved)
					counter++;

				callback();
			});

		},
		(error) => {
			if(error) {
				console.log(error);
				response.badImplementation('An internal server error occurred');
			}

			response(counter + " users have been generated randomly.");
		
		}
	);

    
};