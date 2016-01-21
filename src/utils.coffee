# Copy all of keys from the second and subsequent objects into the first object.
# @param old [Object] optional object to copy into (default: {})
# @param adds [Object*] optional additional objects to copy on top.  These get
#   copied left to right, with later objects overwriting the keys from
#   previous ones.
@extend = (old, adds...) ->
  old ?= {}
  for a in adds
    for k,v of a
      old[k] = v
  old

@enum = (names...) ->
  e = {}
  if typeof(names[0]) == 'object'
    for k,v of names[0]
      e[k] = v
      e[v] = k
  else
    for n in names
      s = Symbol(n)
      e[n] = s
      e[s] = n
  Object.freeze e

@random = (low=0.0, high=1.0) ->
  Math.random() * (high - low) + low
