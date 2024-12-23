/**
 * @author MrZenW
 * @email MrZenW@gmail.com
 * @website https://github.com/MrZenW
 * @website https://MrZenW.com
 * @license MIT
 * @version 1.3.0
 */

(function moduleify(moduleFactory) {
  'use strict';
  var statecoreLib = null;
  function _getStatecoreLib() {
    statecoreLib = statecoreLib || moduleFactory.apply(this, arguments);
    return statecoreLib;
  }
  if (typeof define === 'function' && define.amd) define('statecore', [], _getStatecoreLib);
  if (typeof module === 'object' && typeof exports === 'object') module.exports = _getStatecoreLib();
  if (typeof window === 'object') window['statecore'] = _getStatecoreLib();
  if (typeof global === 'object') global['statecore'] = _getStatecoreLib();
  if (typeof globalThis === 'object') globalThis['statecore'] = _getStatecoreLib();
  if (typeof self === 'object') self['statecore'] = _getStatecoreLib();
  if (typeof this === 'object') this['statecore'] = _getStatecoreLib();
})(function moduleFactory () {
  'use strict';
  var STATECORE_EVENT_NAME_STATE = '__STATE__';
  return { STATECORE_EVENT_NAME_STATE: STATECORE_EVENT_NAME_STATE, createStatecore: function createStatecore(state) {
    var allObservers = [];
    function statecoreIsDiscarded() { return !allObservers; }
    function statecoreDiscard() { state = null; allObservers = null; }
    function _throw_ErrorIfDiscarded() {
      if (statecoreIsDiscarded()) throw new Error('The statecore instance has been discarded!');
    }
    function statecoreGetState() { return state; }
    function statecoreSetState(newState) {
      _throw_ErrorIfDiscarded();
      var oldState = state;
      state = newState;
      _call_statecoreNotifyAllObservers(this, [STATECORE_EVENT_NAME_STATE, newState, oldState]);
      return state;
    }
    function statecoreGetAllObservers() { return allObservers ? allObservers.slice() : null; }
    function statecoreRemoveObserver(observer) {
      _throw_ErrorIfDiscarded();
      var copyObservers = allObservers.slice();
      var newAllObservers = [];
      while (copyObservers.length > 0) {
        var copyObserver = copyObservers.pop();
        if (copyObserver !== observer) newAllObservers.unshift(copyObserver);
      }
      allObservers = newAllObservers;
    }
    function statecoreAddObserver(observer) {
      _throw_ErrorIfDiscarded();
      if (typeof observer !== 'function') throw new Error('The observer must be a function!');
      var copyObservers = allObservers.slice();
      copyObservers.unshift(observer);
      allObservers = copyObservers;
      return function removeObserver() {
        if (observer) {
          statecoreRemoveObserver(observer);
          observer = null;
        }
      };
    }
    function _call_statecoreNotifyAllObservers(caller, args) {
      var copyObservers = allObservers.slice();
      while (copyObservers.length > 0) {
        try {
          while (copyObservers.length > 0) copyObservers.pop().apply(caller, args);
        } catch (error) {
          console.error('Error in statecore observer:', error);
        }
      }
    }
    function statecoreNotifyAllObservers(eventName) {
      _throw_ErrorIfDiscarded();
      if (eventName === STATECORE_EVENT_NAME_STATE) {
        console.warn('The event name "' + STATECORE_EVENT_NAME_STATE + '" is reserved for internal use!');
      } else {
        _call_statecoreNotifyAllObservers(this, arguments);
      }
    }
    return { statecoreGetState: statecoreGetState, statecoreSetState: statecoreSetState, statecoreAddObserver: statecoreAddObserver, statecoreGetAllObservers: statecoreGetAllObservers, statecoreRemoveObserver: statecoreRemoveObserver, statecoreNotifyAllObservers: statecoreNotifyAllObservers, statecoreDiscard: statecoreDiscard, statecoreIsDiscarded: statecoreIsDiscarded };
  }};
});
