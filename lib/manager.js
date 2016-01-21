(function() {
  var COMMAND, EE, SPUDtube, TubeManager, dgram, packet,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  dgram = require('dgram');

  EE = require('events').EventEmitter;

  packet = require('./packet');

  SPUDtube = require('./tube');

  COMMAND = require('./constants').COMMAND;

  module.exports = TubeManager = (function(superClass) {
    extend(TubeManager, superClass);

    function TubeManager(options) {
      var ref;
      this.options = options != null ? options : {};
      this._on_packet = bind(this._on_packet, this);
      this.tubes = {};
      this.num = 0;
      this.sent = 0;
      this.received = 0;
      this.s4 = dgram.createSocket({
        type: 'udp4',
        reuseAddr: true
      }, this._on_packet);
      this.port = (ref = this.options.port) != null ? ref : 0;
      this.log = this.options.log ? this.options.log.child({
        port: this.port
      }) : require('bunyan').createLogger({
        name: 'TubeManager',
        level: 'info',
        port: this.port
      });
      this.s4.bind(this.port, (function(_this) {
        return function() {
          var addr;
          addr = _this.s4.address();
          _this.log.fields.port = addr.port;
          _this.log.info('listening', addr);
          return _this.emit('listening', addr);
        };
      })(this));
    }

    TubeManager.prototype._on_packet = function(msg, rinfo) {
      this.received++;
      return packet.parse(msg, rinfo).then((function(_this) {
        return function(pkt) {
          var t;
          t = _this.tubes[pkt.key];
          if (t == null) {
            if (pkt.cmd !== COMMAND.OPEN) {
              _this.log.error('Invalid tube open: ', pkt);
              return _this.emit('error', new Error('Invalid tube open: ' + pkt));
            }
            t = new SPUDtube(_this, {
              packet: pkt
            });
            _this.tubes[t.key] = t;
            _this.num++;
            _this.log.debug('add', t);
            _this.emit('add', t);
          }
          _this.emit('recv', t, pkt);
          return t.recv(pkt);
        };
      })(this), (function(_this) {
        return function(er) {
          return _this.emit(er);
        };
      })(this));
    };

    TubeManager.prototype.address = function() {
      return this.s4.address();
    };

    TubeManager.prototype.size = function() {
      return this.num;
    };

    TubeManager.prototype._send = function(t, pkt) {
      var addr, buf, port;
      buf = pkt.toBuffer();
      if (t.peer.sockaddr != null) {
        addr = t.peer.sockaddr;
        port = -1;
      } else {
        addr = t.peer.addr;
        port = t.peer.port;
      }
      return this.s4.send(buf, 0, buf.length, port, addr, (function(_this) {
        return function(er, size) {
          if (er) {
            return _this.emit('error', er);
          } else {
            if (size !== buf.length) {
              return _this.emit('error', new Error("Truncated send: " + size + "!=" + buf.length));
            } else {
              _this.sent++;
              return _this.emit('send', t, pkt);
            }
          }
        };
      })(this));
    };

    TubeManager.prototype.add = function(opts) {
      var t;
      t = new SPUDtube(this, opts);
      if (this.tubes[t.key] != null) {
        throw new Error('Duplicate tube id.  That was *really* unlikely.');
      }
      this.tubes[t.key] = t;
      this.num++;
      return t;
    };

    TubeManager.prototype.open = function(opts) {
      var t;
      t = this.add(opts);
      t.open(opts.data);
      return t;
    };

    TubeManager.prototype.remove = function(tube) {
      delete this.tubes[tube.key];
      this.num--;
      this.log.debug('remove', tube);
      return this.emit('remove', tube);
    };

    return TubeManager;

  })(EE);

}).call(this);

//# sourceMappingURL=data:application/json;base64,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QixHQUF3QixJQUF4QixHQUE0QixHQUFHLENBQUMsTUFBdEMsQ0FBbkIsRUFERjthQUFBLE1BQUE7Y0FHRSxLQUFDLENBQUEsSUFBRDtxQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNLE1BQU4sRUFBYyxDQUFkLEVBQWlCLEdBQWpCLEVBSkY7YUFIRjs7UUFGdUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDO0lBUks7OzBCQW1CUCxHQUFBLEdBQUssU0FBQyxJQUFEO0FBQ0gsVUFBQTtNQUFBLENBQUEsR0FBUSxJQUFBLFFBQUEsQ0FBUyxJQUFULEVBQVksSUFBWjtNQUNSLElBQUcseUJBQUg7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFNLGlEQUFOLEVBRFo7O01BRUEsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFDLENBQUMsR0FBRixDQUFQLEdBQWdCO01BQ2hCLElBQUMsQ0FBQSxHQUFEO2FBQ0E7SUFORzs7MEJBUUwsSUFBQSxHQUFNLFNBQUMsSUFBRDtBQUNKLFVBQUE7TUFBQSxDQUFBLEdBQUksSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMO01BQ0osQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFJLENBQUMsSUFBWjthQUNBO0lBSEk7OzBCQUtOLE1BQUEsR0FBUSxTQUFDLElBQUQ7TUFDTixPQUFPLElBQUMsQ0FBQSxLQUFNLENBQUEsSUFBSSxDQUFDLEdBQUw7TUFDZCxJQUFDLENBQUEsR0FBRDtNQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFXLFFBQVgsRUFBcUIsSUFBckI7YUFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sRUFBZ0IsSUFBaEI7SUFKTTs7OztLQXBGaUM7QUFQM0MiLCJmaWxlIjoibWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImRncmFtID0gcmVxdWlyZSAnZGdyYW0nXG5FRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxuXG5wYWNrZXQgPSByZXF1aXJlICcuL3BhY2tldCdcblNQVUR0dWJlID0gcmVxdWlyZSAnLi90dWJlJ1xue0NPTU1BTkR9ID0gcmVxdWlyZSAnLi9jb25zdGFudHMnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHViZU1hbmFnZXIgZXh0ZW5kcyBFRVxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuICAgIEB0dWJlcyA9IHt9XG4gICAgQG51bSA9IDBcbiAgICBAc2VudCA9IDBcbiAgICBAcmVjZWl2ZWQgPSAwXG4gICAgQHM0ID0gZGdyYW0uY3JlYXRlU29ja2V0XG4gICAgICB0eXBlOiAndWRwNCdcbiAgICAgIHJldXNlQWRkcjogdHJ1ZVxuICAgICwgQF9vbl9wYWNrZXRcbiAgICBAcG9ydCA9IEBvcHRpb25zLnBvcnQgPyAwXG4gICAgQGxvZyA9IGlmIEBvcHRpb25zLmxvZ1xuICAgICAgQG9wdGlvbnMubG9nLmNoaWxkXG4gICAgICAgIHBvcnQ6IEBwb3J0XG4gICAgZWxzZVxuICAgICAgcmVxdWlyZSgnYnVueWFuJykuY3JlYXRlTG9nZ2VyXG4gICAgICAgIG5hbWU6ICdUdWJlTWFuYWdlcidcbiAgICAgICAgbGV2ZWw6ICdpbmZvJ1xuICAgICAgICBwb3J0OiBAcG9ydFxuICAgIEBzNC5iaW5kIEBwb3J0LCA9PlxuICAgICAgYWRkciA9IEBzNC5hZGRyZXNzKClcbiAgICAgIEBsb2cuZmllbGRzLnBvcnQgPSBhZGRyLnBvcnRcbiAgICAgIEBsb2cuaW5mbyAnbGlzdGVuaW5nJywgYWRkclxuICAgICAgQGVtaXQgJ2xpc3RlbmluZycsIGFkZHJcblxuICBfb25fcGFja2V0OiAobXNnLCByaW5mbykgPT5cbiAgICBAcmVjZWl2ZWQrK1xuICAgIHBhY2tldC5wYXJzZSBtc2csIHJpbmZvXG4gICAgLnRoZW4gKHBrdCkgPT5cbiAgICAgIHQgPSBAdHViZXNbcGt0LmtleV1cbiAgICAgIGlmICF0P1xuICAgICAgICBpZiBwa3QuY21kICE9IENPTU1BTkQuT1BFTlxuICAgICAgICAgIEBsb2cuZXJyb3IgJ0ludmFsaWQgdHViZSBvcGVuOiAnLCBwa3RcbiAgICAgICAgICByZXR1cm4gQGVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdJbnZhbGlkIHR1YmUgb3BlbjogJyArIHBrdCkpXG4gICAgICAgIHQgPSBuZXcgU1BVRHR1YmUgQCxcbiAgICAgICAgICBwYWNrZXQ6IHBrdFxuICAgICAgICBAdHViZXNbdC5rZXldID0gdFxuICAgICAgICBAbnVtKytcbiAgICAgICAgQGxvZy5kZWJ1ZyAnYWRkJywgdFxuICAgICAgICBAZW1pdCAnYWRkJywgdFxuICAgICAgQGVtaXQgJ3JlY3YnLCB0LCBwa3RcbiAgICAgIHQucmVjdiBwa3RcbiAgICAsIChlcikgPT5cbiAgICAgIEBlbWl0IGVyXG5cbiAgYWRkcmVzczogLT5cbiAgICBAczQuYWRkcmVzcygpXG5cbiAgc2l6ZTogLT5cbiAgICBAbnVtXG5cbiAgIyBDYWxsIFNQVUR0dWJlLnNlbmQgaW5zdGVhZFxuICBfc2VuZDogKHQsIHBrdCkgLT5cbiAgICBidWYgPSBwa3QudG9CdWZmZXIoKVxuICAgIGlmIHQucGVlci5zb2NrYWRkcj9cbiAgICAgIGFkZHIgPSB0LnBlZXIuc29ja2FkZHJcbiAgICAgIHBvcnQgPSAtMVxuICAgIGVsc2VcbiAgICAgIGFkZHIgPSB0LnBlZXIuYWRkclxuICAgICAgcG9ydCA9IHQucGVlci5wb3J0XG4gICAgQHM0LnNlbmQgYnVmLCAwLCBidWYubGVuZ3RoLCBwb3J0LCBhZGRyLCAoZXIsIHNpemUpID0+XG4gICAgICAjIE5vdGU6IGRncmFtLnNlbmQncyBjYWxsYmFja3MgaGF2ZSAnMCcgYXMgdGhlIG5vbi1lcnJvciBlci5cbiAgICAgIGlmIGVyXG4gICAgICAgIEBlbWl0ICdlcnJvcicsIGVyXG4gICAgICBlbHNlXG4gICAgICAgIGlmIHNpemUgIT0gYnVmLmxlbmd0aFxuICAgICAgICAgIEBlbWl0ICdlcnJvcicsIG5ldyBFcnJvciBcIlRydW5jYXRlZCBzZW5kOiAje3NpemV9IT0je2J1Zi5sZW5ndGh9XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBzZW50KytcbiAgICAgICAgICBAZW1pdCAnc2VuZCcsIHQsIHBrdFxuXG4gIGFkZDogKG9wdHMpIC0+XG4gICAgdCA9IG5ldyBTUFVEdHViZSBALCBvcHRzXG4gICAgaWYgQHR1YmVzW3Qua2V5XT9cbiAgICAgIHRocm93IG5ldyBFcnJvciAnRHVwbGljYXRlIHR1YmUgaWQuICBUaGF0IHdhcyAqcmVhbGx5KiB1bmxpa2VseS4nXG4gICAgQHR1YmVzW3Qua2V5XSA9IHRcbiAgICBAbnVtKytcbiAgICB0XG5cbiAgb3BlbjogKG9wdHMpIC0+XG4gICAgdCA9IEBhZGQgb3B0c1xuICAgIHQub3BlbiBvcHRzLmRhdGFcbiAgICB0XG5cbiAgcmVtb3ZlOiAodHViZSkgLT5cbiAgICBkZWxldGUgQHR1YmVzW3R1YmUua2V5XVxuICAgIEBudW0tLVxuICAgIEBsb2cuZGVidWcgJ3JlbW92ZScsIHR1YmVcbiAgICBAZW1pdCAncmVtb3ZlJywgdHViZVxuIl19
