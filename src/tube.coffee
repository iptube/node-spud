crypto = require 'crypto'
caps = require './caps'
SPUDpacket = require './packet'
utils = require './utils'
{COMMAND} = require './constants'

STATES = utils.enum [
  'START'
  'OPENING'
  'RUNNING'
  'CLOSING'
  'CLOSED'
]

class TubeError extends Error
  constructor: (tube, msg, @packet) ->
    Error.captureStackTrace @, @constructor
    @name = @constructor.name
    @message = "#{tube}: #{msg}"
    @sent = 0
    @received = 0

module.exports = class SPUDtube
  constructor: (@manager, @options={}) ->
    @state = STATES.START
    @options.caps = caps.combine @options.caps
    if @options.packet?
      # Received OPEN
      @peer = @options.packet.from
      @tube = @options.packet.tube
      @key  = @options.packet.key
    else
      @peer =
        address: @options.address
        port: @options.port
      @tube = crypto.randomBytes 8
      @key = SPUDpacket.key @peer, @tube

  toString: ->
    "<Tube #{@tube.toString('hex')}>"

  open: (data) ->
    console.log 'open'
    if @state != STATES.START
      throw new Error 'Invalid open state: ' + STATES[@state]
    @state = STATES.OPENING
    m = new Map
    if data?
      m.set 0, data
    if @options.caps
      m.set 1, caps.hash(@options.caps)
    @send new SPUDpacket
      cmd: COMMAND.OPEN
      data: data
      key: @key

  close: (data) ->
    @state = STATES.CLOSING
    @send new SPUDpacket
      cmd: COMMAND.CLOSE
      data: data
      key: @key

  send: (pkt) ->
    @sent++
    if !(pkt instanceof SPUDpacket)
      data = pkt
      if !(data instanceof Map)
        data = new Map
        data.set 0, pkt
      pkt = new SPUDpacket
        cmd: COMMAND.DATA
        data: data
        key: @key
    pkt.tube = @tube

    @manager._send @, pkt

  emit: (event, params...) ->
    @manager.emit event, params...

  error: (msg, pkt) ->
    @emit 'error', new TubeError(@, msg, pkt)

  recv: (pkt) ->
    @received++
    switch @state
      when STATES.START
        # open from other side.  TODO: check policy either here or manager
        @state = STATES.RUNNING
        @send pkt.reply()
      when STATES.OPENING
        # ack from other side.
        if pkt.cmd != COMMAND.ACK
          return @error 'Ignoring non-ACK packet before ACK', pkt
        @state = STATES.RUNNING
        @emit 'running', @
      when STATES.RUNNING
        switch pkt.cmd
          when COMMAND.DATA then @emit 'data', @, pkt
          when COMMAND.CLOSE
            @state = STATES.CLOSED
            @send pkt.reply()
            @manager.remove @
      when STATES.CLOSING
        switch pkt.cmd
          when COMMAND.DATA then @emit 'data', @, pkt
          when COMMAND.CLOSE
            @state = STATES.CLOSED
            @send pkt.reply()
            @manager.remove @
          when COMMAND.ACK
            @state = STATES.CLOSED
            @manager.remove @
