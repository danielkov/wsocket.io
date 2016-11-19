module.exports = class Client {
  constructor(url) {
    this.handleFunctions = {};
    let _url = url || window.location.hostname + ':8080';
    if (!_url.startsWith('ws://')) {
			_url = 'ws://' + _url;
		}
    this.socket = new WebSocket(url);
    this.socket.onmessage = function (data) {
      var d = JSON.parse(data.data);
      var messageName = d.name;
      if (this.handleFunctions[messageName]) {
        this.handleFunctions[messageName](d.data);
      }
    }
  }
  send (name, data) {
    if (this.socket) {
      this.socket.send(JSON.stringify({name:name, data:data}));
    }
    else {
      throw new Error('No open WebSocket connections.')
    }
  }
  on (name, fn) {
    this.handleFunctions[name] = fn;
  }
  off (fn) {
    if (this.socket) {
      this.socket.close();
      handleFunctions = {};
    }
    else {
      if (fn) {
        fn(new Error('No open WebSocket connections on service.'));
      }
      else {
        throw new Error('No open WebSocket connections on service.')
      }
    }
    else {
      fn()
    }
  }
}
