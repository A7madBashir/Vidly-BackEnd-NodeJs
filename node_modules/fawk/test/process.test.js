'use strict'

let test = require('ava').test
let process = require('../src/process')

test('replacing input with delimiter', t => {
  let input = 'tab0\ttab1\ttab2'
  let expression = '$1 and $2!'

  t.is(process(input, expression, '\t'), 'tab0 and tab1!')
})

test('replacing input with delimiter', t => {
  let input = 'one     two    three'
  let expression = '$1 and $2!'

  t.is(process(input, expression, ' '), 'one and two!')
})

test('includes special variables like $0', t => {
  let input = 'one two'
  let expression = 'The whole enchilada: $0 and time'

  t.is(process(input, expression), 'The whole enchilada: one two and time')
})

test('allows for a mix', t => {
  let input = 'one two'
  let expression = 'The whole enchilada: $0 and time $1'

  t.is(process(input, expression), 'The whole enchilada: one two and time one')
})

test('replaces invalid variables with an empty string', t => {
  let input = 'one'
  let expression = '$1 and $2!'

  t.is(process(input, expression), 'one and !')
})
