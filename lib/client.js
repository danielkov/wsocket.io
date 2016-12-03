module.exports = class Client {
  constructor(url) {
    this.handleFunctions = {};
    let _url = url || window.location.hostname + ':8080';
    if (!_url.startsWith('ws://')) {
			_url = 'ws://' + _url;
		}
    this.socket = new WebSocket(_url);
    this.socket.onmessage = (data) => {
      var d = JSON.parse(data.data);
      var messageName = d.name;
      if (this.handleFunctions[messageName]) {
        this.executeHandler(messageName, data);
      }
    }
  }
  executeHandler (name, data) {
    if (Array.isArray(this.handleFunctions[name])) {
      for (let i = this.handleFunctions[name].length; i > 0; i--) {
        this.handleFunctions[name][i](data);
      }
    }
    else {
      this.handleFunctions[name](data);
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
    let _names = name.split(' ');
    if (_names.length > 1) {
      for (let i = _names.length; i >= 0; i--) {
        this.subscribeToEvent(_names[i], fn);
      }
    }
    else {
      this.subscribeToEvent(name, fn);
    }
  }
  subscribeToEvent (name, fn) {
    if (this.handleFunctions[name] && !Array.isArray(this.handleFunctions[name])) {
      let arr = [this.handleFunctions[name]];
      arr.push(fn);
      this.handleFunctions[name] = arr;
    }else if (this.handleFunctions[name] && !Array.isArray(this.handleFunctions[name])) {
      this.handleFunctions[name].push(fn);
    }
    else {
      this.handleFunctions[name] = fn;
    }
  }
  off (fn) {
    if (this.socket) {
      this.socket.close();
      handleFunctions = {};
      fn();
    }
    else {
      if (fn) {
        fn(new Error('No open WebSocket connections on service.'));
      }
      else {
        throw new Error('No open WebSocket connections on service.')
      }
    }
  }
}

function parseHandleFunctions (name, fn) {

}
