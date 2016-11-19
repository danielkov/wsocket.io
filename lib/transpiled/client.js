'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client(url) {
    var _this = this;

    _classCallCheck(this, Client);

    this.handleFunctions = {};
    var _url = url || window.location.hostname + ':8080';
    if (!_url.startsWith('ws://')) {
      _url = 'ws://' + _url;
    }
    this.socket = new WebSocket(_url);
    this.socket.onmessage = function (data) {
      var d = JSON.parse(data.data);
      var messageName = d.name;
      if (_this.handleFunctions[messageName]) {
        _this.handleFunctions[messageName](d.data);
      }
    };
  }

  _createClass(Client, [{
    key: 'send',
    value: function send(name, data) {
      if (this.socket) {
        this.socket.send(JSON.stringify({ name: name, data: data }));
      } else {
        throw new Error('No open WebSocket connections.');
      }
    }
  }, {
    key: 'on',
    value: function on(name, fn) {
      this.handleFunctions[name] = fn;
    }
  }, {
    key: 'off',
    value: function off(fn) {
      if (this.socket) {
        this.socket.close();
        handleFunctions = {};
        fn();
      } else {
        if (fn) {
          fn(new Error('No open WebSocket connections on service.'));
        } else {
          throw new Error('No open WebSocket connections on service.');
        }
      }
    }
  }]);

  return Client;
}();
