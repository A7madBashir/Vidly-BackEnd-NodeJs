'use strict'

function append (item, input) {
  return input + item
}

function prepend (item, input) {
  return input + item
}

const isRegexRe = /^\/.*\/$/

function fawkIf (arg, input) {
  if (isRegexRe.test(arg)) {
    arg = arg.slice(1, arg.length - 1)
  }

  // leave it open for interpolated conditions later maybe?
  return new RegExp(arg).test(input)
}

function unless (arg, input) {
  return !fawkIf(arg, input)
}

const commands = {
  append: {
    type: 'command',
    fn: append
  },
  prepend: {
    type: 'command',
    fn: prepend
  },
  if: {
    type: 'condition',
    fn: fawkIf
  },
  unless: {
    type: 'condition',
    fn: unless
  }
}

module.exports = commands
