# statecore
A state-observable library.

## Installation

```bash
$ npm install statecore
```

## API

----------

### statecore.<strong>createStatecore([defaultValue])</strong>

Create a core object

```JavaScript
var coreObject = statecore.createStatecore();
// or
var coreObject = statecore.createStatecore('default value');
```

----------
### coreObject.<strong>statecoreSetState(newState)</strong> => newState
### coreObject.<strong>statecoreGetState()</strong> => any
### coreObject.<strong>statecoreAddObserver(observer)</strong> => removeObserver()
### coreObject.<strong>statecoreNotifyAllObservers(args1, arg2, ..., argN)</strong> => void
### coreObject.<strong>statecoreDiscard()</strong> => void
### coreObject.<strong>statecoreIsDiscarded()</strong> =>Boolean
