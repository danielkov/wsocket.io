const WebSocketServer = require('ws').Server;

module.exports = class Server {
  constructor(opts) {
    let opts = opts || {port:8080};
    this.socket = new WebSocketServer(opts);
    this._sockets = {};
  }
  connect (fn) {
    this.socket.on('connection', (ws) => {
      let socketId = genId();
      let newSocket = new WebsocketUser(ws, socketId, this);
      this._sockets[socketId] = newSocket;
      fn(newSocket);
    })
  }
  send (name, data) {
    for (socket of this._sockets) {
      socket.send(JSON.stringify({name:name, data:data}));
    }
  }
  sendTo(id, name, data) {
    if (this._sockets.hasOwnProperty(id)) {
      this._sockets[id].send(name, data)
    }
  }
  sendExclude (id, name, data) {
    for (socket of this._sockets) {
      if (socket._id !== id) {
        socket.send(JSON.stringify({name:name, data:data}));
      }
    }
  }
  closeSocket (id) {
    if (this._sockets[id]) {
      this._sockets[id] = null;
    }
  }
  close () {
    this.socket.close();
  }
}

class Socket {
  constructor (ws, id, handler) {
    this._handler = handler;
    this.handleFunctions = {};
    this.socket = ws;
    this._id = id;
    this.socket.on('message', (data) => {
      let d = JSON.parse(data);
      let messageName = d.name;
      if (this.handleFunctions[messageName]) {
        this.handleFunctions[messageName](d.data);
      }
    })
    this.socket.on('close', () => {
      this.off();
    })
  }
  on (name, fn) {
    this.handleFunctions[name] = fn;
  }
  send (name, data) {
    this.socket.send(JSON.stringify({name:name, data:data}));
  }
  broadcast (name, data) {
    this._handler.sendExclude(this._id, name, data)
  }
  off () {
    this._handler.closeSocket(this._id);
  }
}

function genId () {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let num = 10;
  let id = '';
  for (var i = 0; i < num; i++) {
    chars[i]
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
