#! /usr/bin/env coffee

spud = require '../'
bunyan = require 'bunyan'

class Echo
  constructor: (opts) ->
    log = opts.log
    @m = new spud.TubeManager
      port: opts.port
      log: log
    @m.on 'data', (t, pkt) ->
      t.send pkt.reply(pkt.data)
    @m.on 'error', (er) ->
      log.error er
    @m.on 'recv', (t, pkt) ->
      log.debug 'RECV', pkt.buf
    @m.on 'send', (t, pkt) ->
      log.debug 'SEND', pkt.buf

args = require('./args') '',
  port:
    default: 1402
    alias: 'p'

new Echo args.argv
