bunyan = require 'bunyan'

module.exports = (extra='', opts={}) ->
  require 'yargs'
    .usage "$0 [options] #{extra}",
      verbose:
        alias: 'v'
        count: true
    .options opts
    .version ->
      require('../package').version
    .alias 'version', 'V'
    .check (args) ->
      args.verbose = bunyan.FATAL - (args.verbose * 10)
      if args.verbose < 0
        args.verbose = 0
      args.log = bunyan.createLogger
        name: args.$0
        level: args.verbose
      true
    .help 'help'
    .alias 'help', 'h'
    .strict()
