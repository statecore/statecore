/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 */

(function moduleify(moduleFactory) {
  'use strict';
  var statecoreLib = null;
  if (typeof define === 'function' && define.amd) {
    var amdFactory = function () {
      statecoreLib = statecoreLib || moduleFactory.apply(this, arguments);
      return statecoreLib;
    };
    define('statecore', [], amdFactory);
    define('StateCore', [], amdFactory);
  } else if (typeof module === 'object' && typeof exports === 'object') {
    statecoreLib = statecoreLib || moduleFactory();
    module.exports = statecoreLib;
  }
  var root = (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this);
  if (root && typeof root === 'object') {
    statecoreLib = statecoreLib || moduleFactory();
    root['statecore'] = statecoreLib;
    root['StateCore'] = statecoreLib;
  }
})(function moduleFactory () {
  'use strict';
  return { createStatecore: function createStatecore(state) {
    var allObservers = [];
    function statecoreDiscard() { state = null; allObservers = false; }
    function statecoreIsDiscarded() { return !allObservers; }
    function statecoreGetState() { return state; }
    function statecoreSetState(newState) {
      if (statecoreIsDiscarded()) throw new Error('This Statecore has been discarded!');
      state = newState;
      return state;
    }
    function statecoreRemoveObserver(observer) {
      if (statecoreIsDiscarded()) return;
      
      var newAllObservers = [];
      var copyObservers = allObservers;
      var observersLength = copyObservers.length;
      for (var idx = 0; idx < observersLength; idx += 1) {
        if (observer !== copyObservers[idx]) newAllObservers.push(copyObservers[idx]);
      }
      allObservers = newAllObservers;
    }
    function statecoreAddObserver(observer) {
      if (statecoreIsDiscarded()) throw new Error('This Statecore has been discarded!');
      if (typeof observer !== 'function') throw new Error('The observer must be a function!');

      var newAllObservers = [];
      var copyObservers = allObservers;
      var observersLength = copyObservers.length;
      for (var idx = 0; idx < observersLength; idx += 1) {
        newAllObservers.push(copyObservers[idx]);
      }
      newAllObservers.push(observer);
      allObservers = newAllObservers;
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
      var observersLength = copyObservers.length;
      for (var copyIdx = 0; copyIdx < observersLength; copyIdx += 1) copyObservers[copyIdx].apply(this, arguments);
    }
    return { statecoreGetState: statecoreGetState, statecoreSetState: statecoreSetState, statecoreAddObserver: statecoreAddObserver, statecoreRemoveObserver: statecoreRemoveObserver, statecoreNotifyAllObservers: statecoreNotifyAllObservers, statecoreDiscard: statecoreDiscard, statecoreIsDiscarded: statecoreIsDiscarded };
  }};
});
