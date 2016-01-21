utils = require './utils'

@MAGIC = new Buffer 'd80000d8', 'hex'
@SPUD_SIZE = 13

COMMAND = @COMMAND = utils.enum
  DATA:      0
  OPEN:   0x40
  CLOSE:  0x80
  ACK:    0xC0

@DECL =
  CMD:    0xC0
  A2P:    0x20
  P2A:    0x10
  toString: (decl) ->
    cmd = COMMAND[decl & @CMD]
    "#{cmd}|#{!!(decl&0x20)}|#{!!(decl&0x10)}"
