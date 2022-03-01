const cmdRegex = /^--(append|prepend)/
const condRegex = /^--(unless|if)/

function commandArgs (opts = [], args = []) {
  if (!opts.length || /^--/.test(opts[0])) {
    return [opts, args]
  }

  return [opts.slice(1), args.concat([opts[0]])]
}

function parseArgs (args = [], command = false, commands = [], opts = []) {
  if (!args.length) {
    if (command) {
      commands.push(command)
    }

    return [commands, opts]
  }

  let head = args[0]
  let rest = args.slice(1)

  if (cmdRegex.test(head)) {
    if (command) {
      commands.push(command)
    }
    let [_rest, cmdArg] = commandArgs(rest)
    command = {
      name: head.slice(2),
      args: cmdArg,
      conditions: []
    }
    return parseArgs(_rest, command, commands, opts)
  }

  if (condRegex.test(head)) {
    if (command) {
      command.conditions.push({
        name: head.slice(2),
        args: rest[0]
      })

      return parseArgs(
        rest.slice(1),
        command,
        commands,
        opts
      )
    }
  }

  return parseArgs(rest, command, commands, opts.concat([head]))
}

module.exports = parseArgs
