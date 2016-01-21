crypto = require 'crypto'
cbor = require 'cbor'

# key: base64(hash)
# val: set()
cache = {}

@hash = (ary, doCache=true) ->
  # strings and ints, de-duped
  s = new Set()
  for v in ary
    switch typeof(v)
      when 'number'
        if v != (v|0)
          return null
      when 'string'
        if v.length == 0
          return null
      else
        return null
    if s.has v
      return null
    s.add v

  # copy.  Don't want cache to be subject to manipulation, or to modify input.
  a = ary.slice 0
  b = cbor.encode a.sort()

  d = crypto.createHash 'sha256'
    .update b
    .digest()
  if doCache
    cache[d.toString('hex')] = a
    d
  else
    [d, a]

@get = (hash) ->
  if Buffer.isBuffer hash
    hash = hash.toString('hex')
  cache[hash]

@check = (ary, hash) ->
  ret = @hash(ary, false)
  if !ret? then return false
  [h,a] = ret
  if h.equals hash
    cache[h.toString('hex')] = a
    true
  else
    false

@combine = (ary=[], others...) ->
  s = new Set(ary)
  for o in others
    s.add o
  a = Array.from(s)
  a.sort()
