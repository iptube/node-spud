(function() {
  var slice = [].slice;

  this.extend = function() {
    var a, adds, i, k, len, old, v;
    old = arguments[0], adds = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (old == null) {
      old = {};
    }
    for (i = 0, len = adds.length; i < len; i++) {
      a = adds[i];
      for (k in a) {
        v = a[k];
        old[k] = v;
      }
    }
    return old;
  };

  this["enum"] = function() {
    var e, i, k, len, n, names, ref, s, v;
    names = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    e = {};
    if (typeof names[0] === 'object') {
      ref = names[0];
      for (k in ref) {
        v = ref[k];
        e[k] = v;
        e[v] = k;
      }
    } else {
      for (i = 0, len = names.length; i < len; i++) {
        n = names[i];
        s = Symbol(n);
        e[n] = s;
        e[s] = n;
      }
    }
    return Object.freeze(e);
  };

  this.random = function(low, high) {
    if (low == null) {
      low = 0.0;
    }
    if (high == null) {
      high = 1.0;
    }
    return Math.random() * (high - low) + low;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQTtBQUFBLE1BQUE7O0VBQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxTQUFBO0FBQ1IsUUFBQTtJQURTLG9CQUFLOztNQUNkLE1BQU87O0FBQ1AsU0FBQSxzQ0FBQTs7QUFDRSxXQUFBLE1BQUE7O1FBQ0UsR0FBSSxDQUFBLENBQUEsQ0FBSixHQUFTO0FBRFg7QUFERjtXQUdBO0VBTFE7O0VBT1YsSUFBQyxDQUFBLE1BQUEsQ0FBRCxHQUFRLFNBQUE7QUFDTixRQUFBO0lBRE87SUFDUCxDQUFBLEdBQUk7SUFDSixJQUFHLE9BQU8sS0FBTSxDQUFBLENBQUEsQ0FBYixLQUFvQixRQUF2QjtBQUNFO0FBQUEsV0FBQSxRQUFBOztRQUNFLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztRQUNQLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztBQUZULE9BREY7S0FBQSxNQUFBO0FBS0UsV0FBQSx1Q0FBQTs7UUFDRSxDQUFBLEdBQUksTUFBQSxDQUFPLENBQVA7UUFDSixDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU87UUFDUCxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU87QUFIVCxPQUxGOztXQVNBLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBZDtFQVhNOztFQWFSLElBQUMsQ0FBQSxNQUFELEdBQVUsU0FBQyxHQUFELEVBQVUsSUFBVjs7TUFBQyxNQUFJOzs7TUFBSyxPQUFLOztXQUN2QixJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FBQyxJQUFBLEdBQU8sR0FBUixDQUFoQixHQUErQjtFQUR2QjtBQXBCViIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMgQ29weSBhbGwgb2Yga2V5cyBmcm9tIHRoZSBzZWNvbmQgYW5kIHN1YnNlcXVlbnQgb2JqZWN0cyBpbnRvIHRoZSBmaXJzdCBvYmplY3QuXG4jIEBwYXJhbSBvbGQgW09iamVjdF0gb3B0aW9uYWwgb2JqZWN0IHRvIGNvcHkgaW50byAoZGVmYXVsdDoge30pXG4jIEBwYXJhbSBhZGRzIFtPYmplY3QqXSBvcHRpb25hbCBhZGRpdGlvbmFsIG9iamVjdHMgdG8gY29weSBvbiB0b3AuICBUaGVzZSBnZXRcbiMgICBjb3BpZWQgbGVmdCB0byByaWdodCwgd2l0aCBsYXRlciBvYmplY3RzIG92ZXJ3cml0aW5nIHRoZSBrZXlzIGZyb21cbiMgICBwcmV2aW91cyBvbmVzLlxuQGV4dGVuZCA9IChvbGQsIGFkZHMuLi4pIC0+XG4gIG9sZCA/PSB7fVxuICBmb3IgYSBpbiBhZGRzXG4gICAgZm9yIGssdiBvZiBhXG4gICAgICBvbGRba10gPSB2XG4gIG9sZFxuXG5AZW51bSA9IChuYW1lcy4uLikgLT5cbiAgZSA9IHt9XG4gIGlmIHR5cGVvZihuYW1lc1swXSkgPT0gJ29iamVjdCdcbiAgICBmb3Igayx2IG9mIG5hbWVzWzBdXG4gICAgICBlW2tdID0gdlxuICAgICAgZVt2XSA9IGtcbiAgZWxzZVxuICAgIGZvciBuIGluIG5hbWVzXG4gICAgICBzID0gU3ltYm9sKG4pXG4gICAgICBlW25dID0gc1xuICAgICAgZVtzXSA9IG5cbiAgT2JqZWN0LmZyZWV6ZSBlXG5cbkByYW5kb20gPSAobG93PTAuMCwgaGlnaD0xLjApIC0+XG4gIE1hdGgucmFuZG9tKCkgKiAoaGlnaCAtIGxvdykgKyBsb3dcbiJdfQ==
