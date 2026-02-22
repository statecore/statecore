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
assert.deepEqual(observerCalledWithArgs, [statecoreLib.STATECORE_EVENT__STATE_CHANGE, { test: 'test2' }, { test: 'test' }]);

// Test the observer throwing an error
observerCalled = false;
observerCalledWithArgs = null;
const observerError = new Error('Test error');
const observerThrowingError = function() {
    throw observerError;
}
const removeObserverThrowingError = statecoreInstance.statecoreAddObserver(observerThrowingError);
assert.deepEqual(statecoreInstance.statecoreGetAllObservers(), [observer, observerThrowingError]);
statecoreInstance.statecoreSetState({ test: 'test3' });
assert.deepEqual(statecoreInstance.statecoreGetState(), { test: 'test3' });
// The 1st observer should have been called
assert.ok(observerCalled);

// The observer throwing an error should not prevent other observers from being called
assert.deepEqual(
    observerCalledWithArgs,
    [statecoreLib.STATECORE_EVENT__OBSERVER_ERROR, observerError, [statecoreLib.STATECORE_EVENT__STATE_CHANGE, { test: 'test3' }, { test: 'test2' }]]
);

// Test remove the observer that throws an error
removeObserverThrowingError();
statecoreInstance.statecoreSetState({ test: 'test4' });
assert.deepEqual(observerCalledWithArgs, [statecoreLib.STATECORE_EVENT__STATE_CHANGE, { test: 'test4' }, { test: 'test3' }]);
assert.deepEqual(statecoreInstance.statecoreGetAllObservers(), [observer]);

// Test the removeObserver function
observerCalled = false;
observerCalledWithArgs = null;
removeObserver();
assert.deepEqual(statecoreInstance.statecoreGetAllObservers(), []);
// The observer should not have been called
statecoreInstance.statecoreSetState({ test: 'test5' });
assert.equal(observerCalled, false);
assert.deepEqual(observerCalledWithArgs, null);
assert.deepEqual(statecoreInstance.statecoreGetState(), { test: 'test5' });

// Test the destroy function
let destroyEventCalled = false;
statecoreInstance.statecoreAddObserver((eventName) => {
    if (eventName === statecoreLib.STATECORE_EVENT__DESTROY) {
        destroyEventCalled = true;
    }
});
statecoreInstance.statecoreDestroy();
assert.ok(destroyEventCalled);
assert.ok(statecoreInstance.statecoreIsDestroyed());
assert.deepEqual(statecoreInstance.statecoreGetState(), null);
assert.deepEqual(statecoreInstance.statecoreGetAllObservers(), null);
assert.throws(() => statecoreInstance.statecoreSetState({ test: 'test5' }), /The statecore instance has been destroyed!/);

// Test GrabInstance() static method
const StatecoreClass = statecoreLib.StatecoreClass;
const instanceA1 = StatecoreClass.statecoreClassStaticGrabInstance('instanceA', { value: 1 });
assert.deepEqual(instanceA1.statecoreGetState(), { value: 1 });
const instanceA2 = StatecoreClass.statecoreClassStaticGrabInstance(false, 'instanceA');
assert.strictEqual(instanceA1, instanceA2); // should be the same instance
const instanceB1 = StatecoreClass.statecoreClassStaticGrabInstance('instanceB', { value: 2 });
assert.notStrictEqual(instanceA1, instanceB1); // should be different instances
assert.deepEqual(instanceB1.statecoreGetState(), { value: 2 });
// Destroy instanceA and grab again
instanceA1.statecoreDestroy();
assert.ok(instanceA1.statecoreIsDestroyed());
const instanceA3 = StatecoreClass.statecoreClassStaticGrabInstance('instanceA', { value: 3 });
assert.notStrictEqual(instanceA1, instanceA3); // should be a new instance
assert.deepEqual(instanceA3.statecoreGetState(), { value: 3 });
const instanceA4 = StatecoreClass.statecoreClassStaticGrabInstance(false, 'instanceA');
assert.strictEqual(instanceA3, instanceA4); // should be the same instance
const instanceC1 = StatecoreClass.statecoreClassStaticGrabInstance(false, 'instanceC');
assert.strictEqual(instanceC1, null); // should be null since it doesn't exist and opt is null

// test for subclass
class SubStatecore extends StatecoreClass {
    constructor(initialState) {
        super(initialState);
    }
}
const subInstance1 = SubStatecore.statecoreClassStaticGrabInstance('subInstance', { subValue: 1 });
assert.deepEqual(subInstance1.statecoreGetState(), { subValue: 1 });
let subObserverCalled = false;
subInstance1.statecoreAddObserver(() => {
    subObserverCalled = true;
});
subInstance1.statecoreSetState({ subValue: 2 });
assert.ok(subObserverCalled);
assert.deepEqual(subInstance1.statecoreGetState(), { subValue: 2 });

// test the instance from the super class vs subclass
const superInstance = StatecoreClass.statecoreClassStaticGrabInstance('subInstance', { subValue: 2 });
assert.deepEqual(superInstance.statecoreGetState(), subInstance1.statecoreGetState()); // should be the same value
assert.notStrictEqual(superInstance, subInstance1); // but should be different instances

// changing the state of one should not affect the other
superInstance.statecoreSetState({ subValue: 3 });
assert.deepEqual(superInstance.statecoreGetState(), { subValue: 3 });
assert.deepEqual(subInstance1.statecoreGetState(), { subValue: 2 }); // should not be affected

// Test return value of statecoreNotifyAllObservers
const retValInstance = statecoreLib.createStatecore();

// No observers → empty array
assert.deepEqual(retValInstance.statecoreNotifyAllObservers('CUSTOM_EVENT'), []);

// Single observer returning a value
retValInstance.statecoreAddObserver(function(eventName) {
    if (eventName === 'CUSTOM_EVENT') return 42;
});
assert.deepEqual(retValInstance.statecoreNotifyAllObservers('CUSTOM_EVENT'), [{ value: 42 }]);

// Observer returning undefined is still captured
retValInstance.statecoreAddObserver(function() { /* returns nothing */ });
const twoResults = retValInstance.statecoreNotifyAllObservers('CUSTOM_EVENT');
assert.equal(twoResults.length, 2);
assert.deepEqual(twoResults[0], { value: 42 });
assert.deepEqual(twoResults[1], { value: undefined });

// Throwing observer produces { error } entry and does not prevent subsequent observers from running
const retValInstance2 = statecoreLib.createStatecore();
const boom = new Error('observer boom');
retValInstance2.statecoreAddObserver(function() { return 'first'; });
retValInstance2.statecoreAddObserver(function() { throw boom; });
retValInstance2.statecoreAddObserver(function() { return 'third'; });
const mixedResults = retValInstance2.statecoreNotifyAllObservers('CUSTOM_EVENT');
assert.equal(mixedResults.length, 3);
assert.deepEqual(mixedResults[0], { value: 'first' });
assert.deepEqual(mixedResults[1], { error: boom });
assert.deepEqual(mixedResults[2], { value: 'third' });

// ALL TESTS PASSED
console.log('✅ All tests passed!');
