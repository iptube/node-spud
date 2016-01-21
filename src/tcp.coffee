caps = require './caps'
Manager = require './manager'
utils = require './utils'
crypto = require 'crypto'

TcpFlags = class @TcpFlags
  @FIN:  1
  @SYN:  2
  @RST:  4
  @PSH:  8
  @ACK: 16
  @URG: 32

URI_TCP = 'tag:cursive.net,2015:tcp'

@connect = @createConnection = (manager, options, cb) ->
  new @Tcp manager, options
    .connect options, cb

class @Tcp
  constructor: (@manager, @options) ->
    # we're likely to eventually have multiple tubes, once we deal with
    # interface changes and multi-path.
    @tubes = []
    @options.caps = caps.combine @options.caps, URI_TCP

  connect: (options, cb) ->
    @options = utils.extend @options, options
    t = @manager.add @options
    @tubes.push t
    @manager.on 'running', cb
    t.open
      data:
        seq: crypto.randomBytes(4).readUInt32BE()
        ack: 0
        flags: TcpFlags.SYN
    @

m = new Manager
@connect m,
  address: 'localhost'
  port: 1402
, ->
  console.log 'connect'
