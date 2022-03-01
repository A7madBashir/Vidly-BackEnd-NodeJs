'use strict'

let commands = require('./commands')

function partial (fn, ...initialArgs) {
  return function (...args) {
    return fn(...initialArgs.concat(args))
  }
}

function reifyCommands (args) {
  args.forEach((arg) => {
    if (!commands[arg.name]) { throw new Error(`Unrecognized command ${arg.name}`) }

    arg.fn = partial(
      commands[arg.name].fn,
      arg.args
    )

    arg.conditions.map((condition) => {
      if (!commands[condition.name]) { throw new Error(`Unrecognized condition ${condition.name} for command ${arg.name}`) }
      condition.fn = partial(
        commands[condition.name].fn,
        condition.args
      )

      return condition
    })
  })

  return args
}

module.exports = reifyCommands
