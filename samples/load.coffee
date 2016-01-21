spud = require '../'
pkg = require '../package.json'
utils = require '../lib/utils'
choose = require 'choose-randomly-by-ratio'

NUM_CLIENTS = 1000

args = require 'yargs'
  .usage '$0 [options] <host> <port>',
    verbose:
      count: true
    time:
      alias: 't'
      describe: 'Time in milliseconds between sends'
      default: 50
  .version ->
    require('../package').version
  .alias 'version', 'v'
  .help 'help'
  .alias 'help', 'h'
  .demand 2, 'host and port required'
  .argv

process.on 'uncaughtException', (e) ->
  console.log 'Error', e

m = new spud.TubeManager()

weights =
  init: [
    ['open', 10]
    ['init', 90]
  ]
  open:    [['opening', 100]]
  opening: [
    ['close', 1]
    ['opening', 99]
  ]
  running: [
    ['close', 1]
    ['running', 99]
  ]
  close:   [['closing', 100]]
  closing: [['closing', 100]]
  closed:  [['init', 100]]

avg = 0
num = 0

SIM = Symbol 'sim'
class Sim
  constructor: ->
    @state = 'init'
    @q = []
    @interval = setInterval @tick, utils.random(10,50)

  stop: ->
    clearInterval @interval

  tick: =>
    #console.log @state
    switch @state
      when 'open'
        @t = m.open host, port
        @t[SIM] = @
      when 'running'
        d = new Date()
        @q.push d
        @t.send d
      when 'close'
        @t.close()
      when 'closed'
        @t = null
        @q = []
    @state = choose weights[@state]

  check: (rd) ->
    d = @q.shift()
    if d.getTime() != rd.getTime()
      console.log 'Bad match', d, rd
      @state = 'close'
    else
      latency = new Date() - d
      num++
      avg = avg + ((latency - avg) / num)

m.on 'listening', (addr) ->
  console.log 'Sending from:', addr
  for i in [0...NUM_CLIENTS]
    sim = new Sim()

m.on 'running', (t) ->
  sim = t[SIM]
  sim.state = 'running'

m.on 'remove', (t) ->
  sim = t[SIM]
  sim.state = 'closed'

m.on 'data', (t, pkt) ->
  try
    sim = t[SIM]
    sim.check pkt.data.get(0)
  catch e
    console.log e

setInterval ->
  console.log m.size(), m.sent, m.received, Math.round(avg)
, 1000
