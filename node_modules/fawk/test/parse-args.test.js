let test = require('ava').test
let parseArgs = require('../src/parse-args')

test('parseArgs', t => {
  let args = ['--append', '","', '--unless', '/bad/']

  let result = parseArgs(args)
  t.deepEqual(result, [
    [
      {
        name: 'append',
        args: ['","'],
        conditions: [
          {
            name: 'unless',
            args: '/bad/'
          }
        ]
      }
    ],
    []
  ])
})

test('multiple args', t => {
  let args = ['--append', '","', '--unless', '/bad/', '--prepend', '$']

  let result = parseArgs(args)
  t.deepEqual(result, [
    [
      {
        name: 'append',
        args: ['","'],
        conditions: [
          {
            name: 'unless',
            args: '/bad/'
          }
        ]
      },
      {
        name: 'prepend',
        args: ['$'],
        conditions: []
      }
    ],
    []
  ])
})
