(function moduleify(moduleFactory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define('statecore', [], moduleFactory);
    define('StateCore', [], moduleFactory);
  } else if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = moduleFactory();
  }
  var root = (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this);
  if (root && typeof root === 'object') {
    root['statecore'] = moduleFactory();
    root['StateCore'] = root['statecore'];
  }
})(function moduleFactory () {
  'use strict';
  return { createStatecore: function createStatecore(state) {
    var allObservers = [];
    function statecoreDiscard() { state = null; allObservers.splice(0); allObservers = null; }
    function statecoreIsDiscarded() { return allObservers === null; }
    function statecoreGetState() { return state; }
    function statecoreSetState(newState) {
      if (statecoreIsDiscarded()) throw new Error('This Statecore has been discarded!');
      state = newState;
      return state;
    }
    function statecoreRemoveObserver(observer) {
      if (statecoreIsDiscarded()) return;
      var copyObservers = allObservers;
      allObservers = [];
      for (var idx = 0; idx < copyObservers.length; idx += 1) {
        if (observer !== copyObservers[idx]) allObservers.push(copyObservers[idx]);
      }
    }
    function statecoreAddObserver(observer) {
      if (statecoreIsDiscarded()) throw new Error('This Statecore has been discarded!');
      if (typeof observer !== 'function') throw new Error('The observer must be a function!');
      allObservers.push(observer);
      return function removeObserver() {
        if (observer) {
          statecoreRemoveObserver(observer);
          observer = null;
        }
      };
    }
    function statecoreNotifyAllObservers() {
      if (statecoreIsDiscarded()) throw new Error('This Statecore has been discarded!');
      var copyObservers = allObservers;
      for (var copyIdx = 0; copyIdx < copyObservers.length; copyIdx += 1) copyObservers[copyIdx].apply(this, arguments);
    }
    return { statecoreGetState: statecoreGetState, statecoreSetState: statecoreSetState, statecoreAddObserver: statecoreAddObserver, statecoreRemoveObserver: statecoreRemoveObserver, statecoreNotifyAllObservers: statecoreNotifyAllObservers, statecoreDiscard: statecoreDiscard, statecoreIsDiscarded: statecoreIsDiscarded };
  }};
});
