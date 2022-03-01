'use strict'

let process = require('./src/process')
let parseArgs = require('./src/parse-args')
let reifyCommands = require('./src/reify-commands')

class Nawk {
  constructor (argv) {
    let [expression, ...args] = argv || []
    let [tree] = parseArgs(args)

    this.expression = expression
    this.commands = reifyCommands(tree)
  }

  processLine (line) {
    let processedLine = process(line, this.expression)

    return this.commands.reduce((accum, command) => {
      if (command.conditions.every((f) => {
        return f.fn(processedLine)
      })) {
        return command.fn(processedLine)
      } else {
        return processedLine
      }
    }, processedLine)
  }
}

module.exports = Nawk
