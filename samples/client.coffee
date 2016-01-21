spud = require '../'

args = require('./args') '<host> <port>',
  time:
    alias: 't'
    describe: 'Time in milliseconds between sends'
.demand 2, 'host and port required'
.argv

[host, port] = args._

interval = null
m = new spud.TubeManager()
m.on 'listening', (addr) ->
  console.log 'Sending from:', addr
  m.open host, port

m.on 'data', (t, pkt) ->
  console.log pkt.data.get 0

m.on 'running', (t) ->
  interval = setInterval ->
    t.send new Date
  , 500

if args.verbose
  m.on 'add', (t) ->
    console.log 'Tube added'
  m.on 'remove', (t) ->
    console.log 'Tube removed'
  m.on 'error', (er) ->
    console.log 'Error', er
  m.on 'recv', (t, pkt) ->
    console.log "RECV (#{pkt.buf.length}):", t.peer, pkt.buf
  m.on 'send', (t, pkt) ->
    console.log "SEND (#{pkt.buf.length}):", t.peer, pkt.buf
