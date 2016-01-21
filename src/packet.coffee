try
  require('source-map-support').install()
catch
  undefined

cbor = require 'cbor'
NoFilter = require 'nofilter'
{MAGIC, COMMAND, DECL, SPUD_SIZE} = require './constants'
utils = require './utils'

module.exports = class SPUDpacket
  constructor: (props) ->
    @key = props.key ? @constructor.key((props.from or props.to), props.tube)
    @magic = MAGIC
    @data = undefined
    utils.extend @, props

  @key: (rinfo, tid) ->
    if (!rinfo?) or (!tid?)
      throw new Error "Invalid key rinfo: '#{rinfo}' tid: '#{tid}'"
    "#{rinfo.address}|#{rinfo.port}|#{tid.toString('hex')}"

  @parse: (buf, rinfo) ->
    if buf.length < SPUD_SIZE
      e = new Error "Invalid SPUD packet length: " + buf.inspect()
      return Promise.reject e
    magic = buf.slice(0, 4)
    if !MAGIC.equals(magic)
      e = new Error "Invalid magic number: #{ret.magic.toString('hex')}"
      return Promise.reject e
    misc = buf.readUInt8(12)
    p = new SPUDpacket
      tube:  buf.slice(4,12)
      cmd:   misc & DECL.CMD
      a2p:   (misc & DECL.A2P) == DECL.A2P
      p2a:   (misc & DECL.P2A) == DECL.P2A
      from:  rinfo
      buf:   buf
    if buf.length > SPUD_SIZE
      cbor.decodeFirst buf.slice(SPUD_SIZE)
      .then (v) ->
        p.data = v
        p
    else
      Promise.resolve p

  toBuffer: ->
    if @buf
      return @buf
    nf = new NoFilter
    nf.write @magic
    nf.write @tube
    nf.writeUInt8 @cmd | ~~(@a2p and DECL.A2P) | ~~(@p2a and DECL.P2A)
    if typeof(@data) != 'undefined'
      nf.write cbor.encode(@data)
    @buf = nf.slice()

  reply: (data) ->
    new SPUDpacket
      to:    @from
      magic: @magic
      tube:  @tube
      a2p:   @p2a
      p2a:   @a2p
      cmd: switch @cmd
        when COMMAND.DATA then COMMAND.DATA
        when COMMAND.OPEN then COMMAND.ACK
        when COMMAND.CLOSE then COMMAND.ACK
        when COMMAND.ACK then throw new Error('Cannot reply to ack')
      data: data
