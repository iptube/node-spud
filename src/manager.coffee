dgram = require 'dgram'
EE = require('events').EventEmitter

packet = require './packet'
SPUDtube = require './tube'
{COMMAND} = require './constants'

module.exports = class TubeManager extends EE
  constructor: (@options={}) ->
    @tubes = {}
    @num = 0
    @sent = 0
    @received = 0
    @s4 = dgram.createSocket
      type: 'udp4'
      reuseAddr: true
    , @_on_packet
    @port = @options.port ? 0
    @log = if @options.log
      @options.log.child
        port: @port
    else
      require('bunyan').createLogger
        name: 'TubeManager'
        level: 'info'
        port: @port
    @s4.bind @port, =>
      addr = @s4.address()
      @log.fields.port = addr.port
      @log.info 'listening', addr
      @emit 'listening', addr

  _on_packet: (msg, rinfo) =>
    @received++
    packet.parse msg, rinfo
    .then (pkt) =>
      t = @tubes[pkt.key]
      if !t?
        if pkt.cmd != COMMAND.OPEN
          @log.error 'Invalid tube open: ', pkt
          return @emit('error', new Error('Invalid tube open: ' + pkt))
        t = new SPUDtube @,
          packet: pkt
        @tubes[t.key] = t
        @num++
        @log.debug 'add', t
        @emit 'add', t
      @emit 'recv', t, pkt
      t.recv pkt
    , (er) =>
      @emit er

  address: ->
    @s4.address()

  size: ->
    @num

  # Call SPUDtube.send instead
  _send: (t, pkt) ->
    buf = pkt.toBuffer()
    if t.peer.sockaddr?
      addr = t.peer.sockaddr
      port = -1
    else
      addr = t.peer.addr
      port = t.peer.port
    @s4.send buf, 0, buf.length, port, addr, (er, size) =>
      # Note: dgram.send's callbacks have '0' as the non-error er.
      if er
        @emit 'error', er
      else
        if size != buf.length
          @emit 'error', new Error "Truncated send: #{size}!=#{buf.length}"
        else
          @sent++
          @emit 'send', t, pkt

  add: (opts) ->
    t = new SPUDtube @, opts
    if @tubes[t.key]?
      throw new Error 'Duplicate tube id.  That was *really* unlikely.'
    @tubes[t.key] = t
    @num++
    t

  open: (opts) ->
    t = @add opts
    t.open opts.data
    t

  remove: (tube) ->
    delete @tubes[tube.key]
    @num--
    @log.debug 'remove', tube
    @emit 'remove', tube
