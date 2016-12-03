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
      this.executeHandler(messageName, data);
    }
  }
  executeHandler (name, data) {
    if (this.handleFunctions[name]) {
      for (let i = this.handleFunctions[name].length; i > 0; i--) {
        this.handleFunctions[name][i](data);
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
    let _names = name.split(' ');
    let _fns = sortArgsIntoArray(fn, fns);
    if (_names.length > 1) {
      for (let i = _names.length; i > 0; i--) {
        this.subscribeToEvent(_names[i], _fns);
      }
    }
    else {
      this.subscribeToEvent(name, _fns);
    }
  }
  subscribeToEvent (name, fn) {
    if (this.handleFunctions[name]) {
      this.handleFunctions[name].concat(fn);
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

function sortArgsIntoArray () {
  let _fns = [];
  if (fns.length > 0 && !Array.isArray(fn)) {
    /* on ('example', function1, function2, function3) */
    _fns = fns;
    _fns.push(fn);
  }
  else if (!Array.isArray(fn) && fns.length == 0) {
    /* on ('example', function1) */
    _fns.push(fn);
  }
  else if (Array.isArray(fn) && fns.length == 0) {
    /* on ('example', [function1, function2, function3]) */
    _fns = fn;
  }
  else {
    /* on ('example', [function1, function2], function3, function4) */
    _fns = fn.concat(fns);
  }
  return _fns;
}
