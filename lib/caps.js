(function() {
  var cache, cbor, crypto,
    slice = [].slice;

  crypto = require('crypto');

  cbor = require('cbor');

  cache = {};

  this.hash = function(ary, doCache) {
    var a, b, d, i, len, s, v;
    if (doCache == null) {
      doCache = true;
    }
    s = new Set();
    for (i = 0, len = ary.length; i < len; i++) {
      v = ary[i];
      switch (typeof v) {
        case 'number':
          if (v !== (v | 0)) {
            return null;
          }
          break;
        case 'string':
          if (v.length === 0) {
            return null;
          }
          break;
        default:
          return null;
      }
      if (s.has(v)) {
        return null;
      }
      s.add(v);
    }
    a = ary.slice(0);
    b = cbor.encode(a.sort());
    d = crypto.createHash('sha256').update(b).digest();
    if (doCache) {
      cache[d.toString('hex')] = a;
      return d;
    } else {
      return [d, a];
    }
  };

  this.get = function(hash) {
    if (Buffer.isBuffer(hash)) {
      hash = hash.toString('hex');
    }
    return cache[hash];
  };

  this.check = function(ary, hash) {
    var a, h, ret;
    ret = this.hash(ary, false);
    if (ret == null) {
      return false;
    }
    h = ret[0], a = ret[1];
    if (h.equals(hash)) {
      cache[h.toString('hex')] = a;
      return true;
    } else {
      return false;
    }
  };

  this.combine = function() {
    var a, ary, i, len, o, others, s;
    ary = arguments[0], others = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (ary == null) {
      ary = [];
    }
    s = new Set(ary);
    for (i = 0, len = others.length; i < len; i++) {
      o = others[i];
      s.add(o);
    }
    a = Array.from(s);
    return a.sort();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxtQkFBQTtJQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7RUFDVCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBSVAsS0FBQSxHQUFROztFQUVSLElBQUMsQ0FBQSxJQUFELEdBQVEsU0FBQyxHQUFELEVBQU0sT0FBTjtBQUVOLFFBQUE7O01BRlksVUFBUTs7SUFFcEIsQ0FBQSxHQUFRLElBQUEsR0FBQSxDQUFBO0FBQ1IsU0FBQSxxQ0FBQTs7QUFDRSxjQUFPLE9BQU8sQ0FBZDtBQUFBLGFBQ08sUUFEUDtVQUVJLElBQUcsQ0FBQSxLQUFLLENBQUMsQ0FBQSxHQUFFLENBQUgsQ0FBUjtBQUNFLG1CQUFPLEtBRFQ7O0FBREc7QUFEUCxhQUlPLFFBSlA7VUFLSSxJQUFHLENBQUMsQ0FBQyxNQUFGLEtBQVksQ0FBZjtBQUNFLG1CQUFPLEtBRFQ7O0FBREc7QUFKUDtBQVFJLGlCQUFPO0FBUlg7TUFTQSxJQUFHLENBQUMsQ0FBQyxHQUFGLENBQU0sQ0FBTixDQUFIO0FBQ0UsZUFBTyxLQURUOztNQUVBLENBQUMsQ0FBQyxHQUFGLENBQU0sQ0FBTjtBQVpGO0lBZUEsQ0FBQSxHQUFJLEdBQUcsQ0FBQyxLQUFKLENBQVUsQ0FBVjtJQUNKLENBQUEsR0FBSSxJQUFJLENBQUMsTUFBTCxDQUFZLENBQUMsQ0FBQyxJQUFGLENBQUEsQ0FBWjtJQUVKLENBQUEsR0FBSSxNQUFNLENBQUMsVUFBUCxDQUFrQixRQUFsQixDQUNGLENBQUMsTUFEQyxDQUNNLENBRE4sQ0FFRixDQUFDLE1BRkMsQ0FBQTtJQUdKLElBQUcsT0FBSDtNQUNFLEtBQU0sQ0FBQSxDQUFDLENBQUMsUUFBRixDQUFXLEtBQVgsQ0FBQSxDQUFOLEdBQTJCO2FBQzNCLEVBRkY7S0FBQSxNQUFBO2FBSUUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUpGOztFQXhCTTs7RUE4QlIsSUFBQyxDQUFBLEdBQUQsR0FBTyxTQUFDLElBQUQ7SUFDTCxJQUFHLE1BQU0sQ0FBQyxRQUFQLENBQWdCLElBQWhCLENBQUg7TUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxLQUFkLEVBRFQ7O1dBRUEsS0FBTSxDQUFBLElBQUE7RUFIRDs7RUFLUCxJQUFDLENBQUEsS0FBRCxHQUFTLFNBQUMsR0FBRCxFQUFNLElBQU47QUFDUCxRQUFBO0lBQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxJQUFELENBQU0sR0FBTixFQUFXLEtBQVg7SUFDTixJQUFJLFdBQUo7QUFBYyxhQUFPLE1BQXJCOztJQUNDLFVBQUQsRUFBRztJQUNILElBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULENBQUg7TUFDRSxLQUFNLENBQUEsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxLQUFYLENBQUEsQ0FBTixHQUEyQjthQUMzQixLQUZGO0tBQUEsTUFBQTthQUlFLE1BSkY7O0VBSk87O0VBVVQsSUFBQyxDQUFBLE9BQUQsR0FBVyxTQUFBO0FBQ1QsUUFBQTtJQURVLG9CQUFROztNQUFSLE1BQUk7O0lBQ2QsQ0FBQSxHQUFRLElBQUEsR0FBQSxDQUFJLEdBQUo7QUFDUixTQUFBLHdDQUFBOztNQUNFLENBQUMsQ0FBQyxHQUFGLENBQU0sQ0FBTjtBQURGO0lBRUEsQ0FBQSxHQUFJLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWDtXQUNKLENBQUMsQ0FBQyxJQUFGLENBQUE7RUFMUztBQXBEWCIsImZpbGUiOiJjYXBzLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiY3J5cHRvID0gcmVxdWlyZSAnY3J5cHRvJ1xuY2JvciA9IHJlcXVpcmUgJ2Nib3InXG5cbiMga2V5OiBiYXNlNjQoaGFzaClcbiMgdmFsOiBzZXQoKVxuY2FjaGUgPSB7fVxuXG5AaGFzaCA9IChhcnksIGRvQ2FjaGU9dHJ1ZSkgLT5cbiAgIyBzdHJpbmdzIGFuZCBpbnRzLCBkZS1kdXBlZFxuICBzID0gbmV3IFNldCgpXG4gIGZvciB2IGluIGFyeVxuICAgIHN3aXRjaCB0eXBlb2YodilcbiAgICAgIHdoZW4gJ251bWJlcidcbiAgICAgICAgaWYgdiAhPSAodnwwKVxuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICB3aGVuICdzdHJpbmcnXG4gICAgICAgIGlmIHYubGVuZ3RoID09IDBcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIGlmIHMuaGFzIHZcbiAgICAgIHJldHVybiBudWxsXG4gICAgcy5hZGQgdlxuXG4gICMgY29weS4gIERvbid0IHdhbnQgY2FjaGUgdG8gYmUgc3ViamVjdCB0byBtYW5pcHVsYXRpb24sIG9yIHRvIG1vZGlmeSBpbnB1dC5cbiAgYSA9IGFyeS5zbGljZSAwXG4gIGIgPSBjYm9yLmVuY29kZSBhLnNvcnQoKVxuXG4gIGQgPSBjcnlwdG8uY3JlYXRlSGFzaCAnc2hhMjU2J1xuICAgIC51cGRhdGUgYlxuICAgIC5kaWdlc3QoKVxuICBpZiBkb0NhY2hlXG4gICAgY2FjaGVbZC50b1N0cmluZygnaGV4JyldID0gYVxuICAgIGRcbiAgZWxzZVxuICAgIFtkLCBhXVxuXG5AZ2V0ID0gKGhhc2gpIC0+XG4gIGlmIEJ1ZmZlci5pc0J1ZmZlciBoYXNoXG4gICAgaGFzaCA9IGhhc2gudG9TdHJpbmcoJ2hleCcpXG4gIGNhY2hlW2hhc2hdXG5cbkBjaGVjayA9IChhcnksIGhhc2gpIC0+XG4gIHJldCA9IEBoYXNoKGFyeSwgZmFsc2UpXG4gIGlmICFyZXQ/IHRoZW4gcmV0dXJuIGZhbHNlXG4gIFtoLGFdID0gcmV0XG4gIGlmIGguZXF1YWxzIGhhc2hcbiAgICBjYWNoZVtoLnRvU3RyaW5nKCdoZXgnKV0gPSBhXG4gICAgdHJ1ZVxuICBlbHNlXG4gICAgZmFsc2VcblxuQGNvbWJpbmUgPSAoYXJ5PVtdLCBvdGhlcnMuLi4pIC0+XG4gIHMgPSBuZXcgU2V0KGFyeSlcbiAgZm9yIG8gaW4gb3RoZXJzXG4gICAgcy5hZGQgb1xuICBhID0gQXJyYXkuZnJvbShzKVxuICBhLnNvcnQoKVxuIl19
