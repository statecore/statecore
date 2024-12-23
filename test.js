const assert = require('assert');
const statecoreLib = require('./statecore.js');

// Test the module factory
const statecoreInstance = statecoreLib.createStatecore({ test: 'test' });
assert.deepEqual(statecoreInstance.statecoreGetState(), { test: 'test' });

// Test the observer
let observerCalled = false;
let observerCalledWithArgs = null;
const observer = function(...args) {
  observerCalled = true;
  observerCalledWithArgs = args;
}
const removeObserver = statecoreInstance.statecoreAddObserver(observer);
assert.deepEqual(statecoreInstance.statecoreGetAllObservers(), [observer]);
assert.equal(typeof removeObserver, 'function');
statecoreInstance.statecoreSetState({ test: 'test2' });
assert.deepEqual(statecoreInstance.statecoreGetState(), { test: 'test2' });
// The observer should have been called
assert.equal(observerCalled, true);
assert.deepEqual(observerCalledWithArgs, [statecoreLib.STATECORE_EVENT_NAME_STATE, { test: 'test2' }, { test: 'test' }]);

// Test the observer throwing an error
observerCalled = false;
observerCalledWithArgs = null;
const observerThrowingError = function() {
  throw new Error('Test error');
}
const removeObserverThrowingError = statecoreInstance.statecoreAddObserver(observerThrowingError);
assert.deepEqual(statecoreInstance.statecoreGetAllObservers(), [observerThrowingError, observer]); // The order is important, the last observer added should be the first to be called
statecoreInstance.statecoreSetState({ test: 'test3' });
assert.deepEqual(statecoreInstance.statecoreGetState(), { test: 'test3' });
// The 1st observer should have been called
assert.equal(observerCalled, true);
assert.deepEqual(observerCalledWithArgs, [statecoreLib.STATECORE_EVENT_NAME_STATE, { test: 'test3' }, { test: 'test2' }]);
// Test remove the observer that throws an error
removeObserverThrowingError();
assert.deepEqual(statecoreInstance.statecoreGetAllObservers(), [observer]);

// Test the removeObserver function
observerCalled = false;
observerCalledWithArgs = null;
removeObserver();
assert.deepEqual(statecoreInstance.statecoreGetAllObservers(), []);
// The observer should not have been called
statecoreInstance.statecoreSetState({ test: 'test4' });
assert.equal(observerCalled, false);
assert.deepEqual(observerCalledWithArgs, null);
assert.deepEqual(statecoreInstance.statecoreGetState(), { test: 'test4' });

// Test the discard function
statecoreInstance.statecoreDiscard();
assert.deepEqual(statecoreInstance.statecoreGetState(), null);
assert.deepEqual(statecoreInstance.statecoreGetAllObservers(), null);
assert.throws(() => statecoreInstance.statecoreSetState({ test: 'test5' }), /The statecore instance has been discarded!/);

console.log('✅ All tests passed!');
