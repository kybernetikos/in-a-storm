In A Storm
==========

Finds a port to bind your server to.  'In A Storm' is inspired by (and some code has been
taken from) [find-and-bind](https://github.com/gyllstromk/node-find-and-bind), but gives
you more ways of specifying what port(s) you want.

    $ npm install in-a-storm

Usage
-----

'In A Storm' provides a listen function that is designed to work with any server
that exposes the same interface for a listen method as the node `net.Server` class.

```js

var listen = require('in-a-storm');

listen(app, function(err, port) {
	console.log('Listening on port', port);
});
```

It will select an unused port, and bind your app to it.

If your app is an instance of http.Server, it will try the port in the environment variable PORT
first, then it will try port 80, then it will try port 8080 before trying a port at random.

If your app is an instance of https.Server, it will try 443, then 8443 before a random port.

### Specifying the ports to use

There are a number of ways to specify preferences for ports to use.


```js

// try port 8080, if that fails, select a random port.
listen(server, 8080, function(err, port) {});
listen(server, "8080", function(err, port) {});

// try port 8080, then 8081, then 8082, then if that fails, select a random port.
listen(server, "8080-8082", function(err, port) {});

// try port 80, then port 8080, then port 1000, then port 1001, then 1002, then a random port.
listen(server, [80, 8080, "1000-1002"], function(err, port) {});

// bind to a specific host address 'myhost' with backlog.
listen(server, {
		host: myhost,
		backlog: backlog,
		port: [80, 8080, "1000-1002"]
},	function(err, port) {});

```

Future Work
-----------

The tests are mainly just modified versions of what findandbind does, so more work is needed
there.

The listen with the backlog optional value is relatively new, so not every
kind of server will support this way of listening.  It might be better to just pass all
arguments through to the underlying listen, and just change the first argument.

There might well be other sensible default behaviours that can be added based on the
instance of the server.