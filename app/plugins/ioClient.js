const socket = require('socket.io-client');

module.exports.register = (server, options, next) => {
	let io = socket(options.server, {reconnect: true});
	
	io.on('connect', function () {
		console.log('socket.io is connected');
	});

	server.decorate('server', 'ioClient', io);
	next();
};

module.exports.register.attributes = {
	name :'ioClient'
};