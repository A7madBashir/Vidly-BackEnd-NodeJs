Displays usage and example if invoked without arguments:

  $ $FAWK_PATH/bin/fawk
  fawk <expression> <commands> <options>
  fawk file.txt '$1' --append ,
  [1]

Works when input is piped (TODO: figure out how to force not piping)

  $ cat $FAWK_PATH/test/fixtures/spaced-simple.txt | $FAWK_PATH/bin/fawk '$3' --append ,
  00:01:18,
  00:01:19,

Works with multiple conditions

  $ cat $FAWK_PATH/test/fixtures/spaced-simple.txt | $FAWK_PATH/bin/fawk '$3' --append , --if '18'
  00:01:18,
  00:01:19
