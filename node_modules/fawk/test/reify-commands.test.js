'use strict'

let test = require('ava').test
let reifyCommands = require('../src/reify-commands')

test('reify commands', t => {
  let tree = [
    {
      name: 'append',
      args: [','],
      conditions: [
        {
          name: 'unless',
          args: '/foo/'
        }
      ]
    }
  ]

  let result = reifyCommands(tree)

  t.deepEqual(result[0].fn('foo'), 'foo,')
  t.deepEqual(result[0].conditions[0].fn('foo'), false)
  t.deepEqual(result[0].conditions[0].fn('bar'), true)
})

test('throws an error for unrecognized commands', t => {
  t.throws(() => {
    reifyCommands([
      {
        name: 'badcommand',
        args: []
      }
    ])
  }, 'Unrecognized command badcommand')
})

test('throws an error for unrecognized conditions', t => {
  t.throws(() => {
    reifyCommands([
      {
        name: 'append',
        args: [],
        conditions: [
          {
            name: 'badcondition',
            args: []
          }
        ]
      }
    ])
  }, 'Unrecognized condition badcondition for command append')
})

