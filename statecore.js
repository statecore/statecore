/**
 * @author MrZenW
 * @email MrZenW@gmail.com
 * @website https://github.com/MrZenW
 * @website https://MrZenW.com
 * @license MIT
 * @version 1.2.3
 */

(function moduleify(moduleFactory) {
  'use strict';
  var statecoreLib = null;
  function _getStatecoreLib() {
    statecoreLib = statecoreLib || moduleFactory.apply(this, arguments);
    return statecoreLib;
  }
  if (typeof define === 'function' && define.amd) {
    define('statecore', [], _getStatecoreLib);
  } else if (typeof module === 'object' && typeof exports === 'object') {
    // commonjs
    module.exports = _getStatecoreLib();
  }
  if (typeof window === 'object') window['statecore'] = _getStatecoreLib();
  if (typeof global === 'object') global['statecore'] = _getStatecoreLib();
  if (typeof globalThis === 'object') globalThis['statecore'] = _getStatecoreLib();
  if (typeof self === 'object') self['statecore'] = _getStatecoreLib();
  if (typeof this === 'object') this['statecore'] = _getStatecoreLib();
})(function moduleFactory () {
  'use strict';
  var statecoreStateEventName = '__state__';
  return { statecoreStateEventName: statecoreStateEventName, createStatecore: function createStatecore(state) {
    var allObservers = [];
    function statecoreDiscard() { state = null; allObservers = null; }
    function statecoreIsDiscarded() { return !allObservers; }
    function statecoreGetState() { return state; }
    function statecoreSetState(newState) {
      if (statecoreIsDiscarded()) throw new Error('The statecore instance has been discarded!');
      var oldState = state
      state = newState;
      _caller_statecoreNotifyAllObservers(this, [statecoreStateEventName, newState, oldState]);
      return state;
    }
    function statecoreRemoveObserver(observer) {
      if (statecoreIsDiscarded()) return;
      var copyObservers = allObservers;
      var newAllObservers = [];
      var observersLength = copyObservers.length;
      for (var idx = 0; idx < observersLength; idx += 1) {
        if (observer !== copyObservers[idx]) newAllObservers.push(copyObservers[idx]);
      }
      allObservers = newAllObservers;
    }
    function statecoreAddObserver(observer) {
      if (statecoreIsDiscarded()) throw new Error('The statecore instance has been discarded!');
      if (typeof observer !== 'function') throw new Error('The observer must be a function!');
      var copyObservers = allObservers;
      var newAllObservers = [];
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
    function _caller_statecoreNotifyAllObservers(caller, args) {
      if (statecoreIsDiscarded()) throw new Error('The statecore instance has been discarded!');
      var copyObservers = allObservers;
      var observersLength = copyObservers.length;
      for (var copyIdx = 0; copyIdx < observersLength; copyIdx += 1) {
        try {
          copyObservers[copyIdx].apply(caller, args);
        } catch (error) {
          console.error('Error in statecore observer:', copyObservers[copyIdx], error);
        }
      }
    }
    function statecoreNotifyAllObservers(eventName) {
      if (eventName === statecoreStateEventName) {
        console.warn('The event name "' + statecoreStateEventName + '" is reserved for internal use!');
      } else {
        _caller_statecoreNotifyAllObservers(this, arguments);
      }
    }
    return { statecoreGetState: statecoreGetState, statecoreSetState: statecoreSetState, statecoreAddObserver: statecoreAddObserver, statecoreRemoveObserver: statecoreRemoveObserver, statecoreNotifyAllObservers: statecoreNotifyAllObservers, statecoreDiscard: statecoreDiscard, statecoreIsDiscarded: statecoreIsDiscarded };
  }};
});
