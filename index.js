var net = require('net');
var http = require('http');
var https = require('https');

var itr = require('./iterator');

var DEFAULTS = {
	'http': [
		process.env.PORT,
		80,
		8080
	],
	'https': [
		443,
		8443
	]
};

function replaceWithDefaults(value) {
	if (Array.isArray(value)) {
		return value.map(replaceWithDefaults);
	} else if (typeof value === 'string' && value in DEFAULTS) {
		return DEFAULTS[value];
	}
	return value;
}

function loopAsync(fn, finalCallback) {
	function next() {
		fn(next, finalCallback);
	}
	next();
}

var listen = module.exports = function listen(server, options, callback) {

	if (arguments.length === 2) {
		callback = options;
		options = {};
	}
	var optionsType = typeof(options);
	if (optionsType === 'string' || optionsType === 'number' || Array.isArray(options)) {
		options = {
			port: options
		};
	}

	options = options || {};

	var host = options.host;
	var backlog = options.backlog;
	var ports = options.port;

	if (ports == null) {
		if (server instanceof http.Server) {
			ports = 'http';
		} else if (server instanceof https.Server) {
			ports = 'https';
		}
	}

	var portItr = itr.getIterator(replaceWithDefaults(ports));

	var port = portItr() || 0;
	loopAsync(function(next, done) {
		var d = require('domain').create();
		d.on('error', function(err) {
			port = portItr() || 0;
			next();
		});

		d.add(server);

		d.run(function () {
			server.listen(port, host, backlog, function () {
				done(port);
			});
		});
	}, function(attemptedPort) {
		if (callback) {
			var actualPort = attemptedPort;
			if (actualPort === 0 && server.address) {
				actualPort = server.address().port;
			}
			callback(null, actualPort);
			callback = null; // avoid multi callbacks as happens in restify
		}
	});
};
