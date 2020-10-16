# statecore
A state-observable library.

## Installation

```bash
$ npm install statecore
```

## API

----------

### StateCore.<strong>createStateCore([defaultValue])</strong>

Create a core object

```JavaScript
var coreObject = StateCore.createStateCore();
// or
var coreObject = StateCore.createStateCore('default value');
```

----------
### coreObject.<strong>setState(newState)</strong> => newState
### coreObject.<strong>getState()</strong> => any
### coreObject.<strong>addObserver(observer)</strong> => removeObserver()
### coreObject.<strong>notifyAllObservers(args1, arg2, ..., argN)</strong> => void
### coreObject.<strong>discard()</strong> => void
### coreObject.<strong>isDiscarded()</strong> =>Boolean
