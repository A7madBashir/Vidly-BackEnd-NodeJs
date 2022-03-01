'use strict'

function interpolate (expression, context) {
  return expression.replace(/\$\w+/g, (match) => {
    return context[match] ? context[match] : ''
  })
}

function process (input = '', expression, delim = ' ') {
  let columns = input.split(delim).filter((x) => x !== '')
  let context = columns.reduce((accum, item, index) => {
    accum[`$${index + 1}`] = item
    return accum
  }, {
    // "special" globals on context
    '$0': columns.join(' ')
  })

  return interpolate(expression, context)
}

module.exports = process
