# WSocket.io

Simple ws wrapper written with ES6 syntax for ease of use.

### Browser support

Client code needs to be transpiled with something like [Babel](https://babeljs.io/) to work in all browsers. Currently only browsers supporting WebSocket API are supported (no fallback to AJAX).

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
