# WSocket.io

Simple ws wrapper written with ES6 syntax for ease of use.

### Notice

This is the repo for the NPM module that pulls in both [wsocket.io-client](https://github.com/danielkov/wsocket.io-client) and [wsocket.io-server](https://github.com/danielkov/wsocket.io-server) modules. If you notice any errors, mistakes or just want to share your thoughts and contribute to this project, feel free to send pull requests on the GitHub pages of the respective projects.

### Simple use

server.js
```js
const SocketServer = require('wsocket.io').Server;

/*
Default port is 8080
*/
let wss = new SocketServer()

wss.connect((ws) => {
  ws.send('welcome', {message:'hello world'});
  ws.on('reply', (data) => {
    console.log(data);
  })
})
```

client.js
```js
import Client from wsocket.io;

/*
Default port is 8080
*/
let client = new Client();

client.on('welcome', (data) => {
  console.log(data);
  client.send('reply', {message: 'hello back'});
})

client.off();
```

## Supported methods

### Client

### `.constructor([url: String <optional>])`
The parameter is the url to open a WebSocket connection with. This defaults to `window.location.hostname` on port: 8080.

### `.on([name: String], [fn: function <callback>])`
Handles incoming messages matching the name provided in the first parameter.

### `.send([name: String], [data: Object])`
Sends a message to the server with the name of first parameter and the data in the form of a stringified object.

### `.off([fn: function <callback, optional>])`
Closes open WebSocket connection if there is one and executes callback. If there aren't any open connections the callback will receive an error. If no callback is provided an Error will be thrown.


### Server

### `.constructor([opts: Object])`
Sends the `opts` object into the original ws Server constructor. Defaults to `{port: 8080}`.

### `.connect([fn: function <callback>])`
The callback handles each separate incoming connection. It receives a single Socket object (read below).

### `.send([name: String], [data: Object])`
Sends the data in the form of a stringified object to each open connection.

### `.sendTo([id: String], [name: String], [data: Object])`
Sends the data to the socket with the id provided in the first parameter.

### `.sendExclude([id: String], [name: String], [data: Object])`
Sends the data to all the sockets excluding the one with the id in the first parameter. This is the underlying method of `Socket.broadcast()`.

### `.close()`
Closes the server.


### Socket

### `.constructor([ws: WebSocket], [id: String], [handler: Object <Server>])`
Creates a new Socket object and assigns an id, which is stored in `Server._sockets` object by id.

### `.on([name: String], [fn: function <callback>])`
Handles incoming messages matching the name provided in the first parameter.

### `.send([name: String], [data: Object])`
Sends a message to the socket in the form of a stringified object.

### `.broadcast()`
Sends a message to all sockets but the current one, using the server's `sendExclude()` method.

### `.off()`
Removes socket from the handled sockets. Triggered automatically when socket closes on the client side.


## Changes in Version 1.0

### Event middleware

The middleware-based approach is quite popular among JavaScript developers, especially on the server-side, which is why I've decided to add support for multiple handle functions for the same WebSocket event.

Multiple handlers on the same event can work in various ways:

Via multiple functions:

```js
ws.on('example',
data => {
  console.log(data);
},
data => {
  storeLogs(data);
},
data => {
  ws.send('response', { message: `Your message: ${data.message}, has been stored.`});
})
```

By passing in an array of functions:

```js
ws.on('example',
[
  data => {
    console.log(data);
  },
  data => {
    storeLogs(data);
  },
  data => {
    ws.send('response', { message: `Your message: ${data.message}, has been stored.`});
  }
])
```

Aside from the previous 2 best practices, it won't break if you do something like this:

```js
ws.on('example', [
  data => {
    console.log('Hi there!');
  },
  data => {
    console.log('This will also work.');
  }
],
data => {
  console.log(`Someone sent me: ${data.message}`);
},
data => {
  ws.send('reply', { message: 'This is cool.' })
}
)
```

### Support for `on('close')`

This had been an oversight by me, as it required some tweaking, but the method on server-side now works and is called before the socket finally closes. The parameter of the callback will receive an object `{ id: clientId }` so that identification of the disconnected user is easy.

### Subscribe to multiple WebSocket events with same function

This change also supports the use of middleware. You can now subscribe to multiple events, using this API. You can separate the events you want to assign the function to, separated with spaces.

Example:

```js
ws.on('message reply login logout', data => {
  console.log(`Oh look, we got some data: ${data.message}!`);
})
/*send('message') will trigger this once, and so will send('reply') and so on...*/
```
