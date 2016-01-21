(function() {
  var Echo, dgram, gen, parser,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  dgram = require('dgram');

  parser = require('./parser');

  gen = require('./generator');

  Echo = (function() {
    function Echo(port) {
      this.on_packet = bind(this.on_packet, this);
      this.s4 = dgram.createSocket({
        type: 'udp4',
        reuseAddr: true
      }, this.on_packet);
      this.s4.bind(port, (function(_this) {
        return function() {
          return console.log(_this.s4.address());
        };
      })(this));
    }

    Echo.prototype.on_packet = function(msg, rinfo) {
      console.log(rinfo);
      return parser.parse(msg).then((function(_this) {
        return function(s) {
          var resp;
          console.log('parsed', s);
          resp = gen.gen(s.tube, s.data);
          console.log("sending", resp);
          return _this.s4.send(resp, 0, resp.length, rinfo.address, rinfo.port);
        };
      })(this));
    };

    return Echo;

  })();

  new Echo(1402);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVjaG8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBOztFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7RUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1QsR0FBQSxHQUFNLE9BQUEsQ0FBUSxhQUFSOztFQUVBO0lBQ1MsY0FBQyxJQUFEOztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQU0sS0FBSyxDQUFDLFlBQU4sQ0FDSjtRQUFBLElBQUEsRUFBTSxNQUFOO1FBQ0EsU0FBQSxFQUFXLElBRFg7T0FESSxFQUdKLElBQUMsQ0FBQSxTQUhHO01BSU4sSUFBQyxDQUFBLEVBQUUsQ0FBQyxJQUFKLENBQVMsSUFBVCxFQUFlLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDYixPQUFPLENBQUMsR0FBUixDQUFZLEtBQUMsQ0FBQSxFQUFFLENBQUMsT0FBSixDQUFBLENBQVo7UUFEYTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZjtJQUxXOzttQkFRYixTQUFBLEdBQVcsU0FBQyxHQUFELEVBQU0sS0FBTjtNQUNULE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBWjthQUNBLE1BQU0sQ0FBQyxLQUFQLENBQWEsR0FBYixDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO0FBQ0osY0FBQTtVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixFQUFzQixDQUF0QjtVQUNBLElBQUEsR0FBTyxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsQ0FBQyxJQUFWLEVBQWdCLENBQUMsQ0FBQyxJQUFsQjtVQUNQLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBWixFQUF1QixJQUF2QjtpQkFDQSxLQUFDLENBQUEsRUFBRSxDQUFDLElBQUosQ0FBUyxJQUFULEVBQWUsQ0FBZixFQUFrQixJQUFJLENBQUMsTUFBdkIsRUFBK0IsS0FBSyxDQUFDLE9BQXJDLEVBQThDLEtBQUssQ0FBQyxJQUFwRDtRQUpJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROO0lBRlM7Ozs7OztFQVVULElBQUEsSUFBQSxDQUFLLElBQUw7QUF2QkoiLCJmaWxlIjoiZWNoby5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImRncmFtID0gcmVxdWlyZSAnZGdyYW0nXG5wYXJzZXIgPSByZXF1aXJlICcuL3BhcnNlcidcbmdlbiA9IHJlcXVpcmUgJy4vZ2VuZXJhdG9yJ1xuXG5jbGFzcyBFY2hvXG4gIGNvbnN0cnVjdG9yOiAocG9ydCkgLT5cbiAgICBAczQgPSBkZ3JhbS5jcmVhdGVTb2NrZXRcbiAgICAgIHR5cGU6ICd1ZHA0J1xuICAgICAgcmV1c2VBZGRyOiB0cnVlXG4gICAgLCBAb25fcGFja2V0XG4gICAgQHM0LmJpbmQgcG9ydCwgPT5cbiAgICAgIGNvbnNvbGUubG9nIEBzNC5hZGRyZXNzKClcblxuICBvbl9wYWNrZXQ6IChtc2csIHJpbmZvKSA9PlxuICAgIGNvbnNvbGUubG9nIHJpbmZvXG4gICAgcGFyc2VyLnBhcnNlIG1zZ1xuICAgIC50aGVuIChzKSA9PlxuICAgICAgY29uc29sZS5sb2cgJ3BhcnNlZCcsIHNcbiAgICAgIHJlc3AgPSBnZW4uZ2VuIHMudHViZSwgcy5kYXRhXG4gICAgICBjb25zb2xlLmxvZyBcInNlbmRpbmdcIiwgcmVzcFxuICAgICAgQHM0LnNlbmQgcmVzcCwgMCwgcmVzcC5sZW5ndGgsIHJpbmZvLmFkZHJlc3MsIHJpbmZvLnBvcnRcblxuXG5uZXcgRWNobyAxNDAyXG4iXX0=
