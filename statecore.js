/**
 * @author MrZenW
 * @email MrZenW@gmail.com
 * @website https://github.com/MrZenW
 * @website https://MrZenW.com
 * @license MIT
 * @version 2.1.0
 */

(function moduleify(moduleFactory) {
  'use strict';
  var statecoreLib = null;
  function _getStatecoreLibCopy() {
    statecoreLib = statecoreLib || moduleFactory.apply(this, arguments);
    var statecoreLibCopy = {};
    for (var key in statecoreLib) statecoreLibCopy[key] = statecoreLib[key];
    return statecoreLibCopy;
  }
  if (typeof define === 'function' && define.amd) define('statecore', [], _getStatecoreLibCopy);
  if (typeof module === 'object' && typeof exports === 'object') module.exports = _getStatecoreLibCopy();
  if (typeof window === 'object') window['statecore'] = _getStatecoreLibCopy();
  if (typeof global === 'object') global['statecore'] = _getStatecoreLibCopy();
  if (typeof globalThis === 'object') globalThis['statecore'] = _getStatecoreLibCopy();
  if (typeof self === 'object') self['statecore'] = _getStatecoreLibCopy();
  if (typeof this === 'object') this['statecore'] = _getStatecoreLibCopy();
})(function moduleFactory () {
  'use strict';
  var STATECORE_EVENT__STATE_CHANGE = '__STATE_CHANGE__';
  function createStatecore(state) {
    var allObservers = [];
    function statecoreIsDiscarded() { return !allObservers; }
    function statecoreDiscard() { state = null; allObservers = null; }
    function _throwError_IfDiscarded() {
      if (statecoreIsDiscarded()) throw new Error('The statecore instance has been discarded!');
    }
    function statecoreGetState() { return state; }
    function statecoreSetState(newState) {
      _throwError_IfDiscarded();
      var oldState = state;
      state = newState;
      _call_statecoreNotifyAllObservers(this, [STATECORE_EVENT__STATE_CHANGE, newState, oldState]);
      return state;
    }
    function statecoreGetAllObservers() { return allObservers ? allObservers.slice() : null; }
    function statecoreRemoveObserver(observer) {
      _throwError_IfDiscarded();
      var existingObserverIndex = allObservers.indexOf(observer);
      if (existingObserverIndex > -1) {
        var copyObservers = allObservers.slice()
        copyObservers.splice(existingObserverIndex, 1);
        allObservers = copyObservers;
      }
    }
    function statecoreAddObserver(observer) {
      _throwError_IfDiscarded();
      if (typeof observer !== 'function') throw new Error('The observer must be a function!');
      if (allObservers.indexOf(observer) === -1) {
        var copyObservers = allObservers.slice();
        copyObservers.push(observer);
        allObservers = copyObservers;
      }
      return function removeObserver() {
        statecoreRemoveObserver(observer);
      };
    }
    function _call_statecoreNotifyAllObservers(caller, args) {
      var copyObservers = allObservers.slice();
      var restObserversCount = copyObservers.length;
      while (restObserversCount > 0) {
        try {
          while (restObserversCount > 0) copyObservers[copyObservers.length - (restObserversCount--)].apply(caller, args);
        } catch (error) {
          console.error('Error in statecore observer:', error);
        }
      }
    }
    function statecoreNotifyAllObservers(eventName) {
      _throwError_IfDiscarded();
      if (eventName === STATECORE_EVENT__STATE_CHANGE) {
        console.warn('The event name "' + STATECORE_EVENT__STATE_CHANGE + '" is reserved for internal use!');
      } else {
        _call_statecoreNotifyAllObservers(this, arguments);
      }
    }
    return { statecoreGetState: statecoreGetState, statecoreSetState: statecoreSetState, statecoreAddObserver: statecoreAddObserver, statecoreGetAllObservers: statecoreGetAllObservers, statecoreRemoveObserver: statecoreRemoveObserver, statecoreNotifyAllObservers: statecoreNotifyAllObservers, statecoreDiscard: statecoreDiscard, statecoreIsDiscarded: statecoreIsDiscarded };
  }
  function StatecoreClass(initialState) {
    if (!(this instanceof StatecoreClass)) return new StatecoreClass(initialState);
    var statecore = createStatecore(initialState);
    for (var key in statecore) this[key] = statecore[key];
  }
  StatecoreClass.prototype.statecoreClassAddEventObserver = function statecoreClassAddEventObserver(eventName, observer) {
    return this.statecoreAddObserver(function (eventNameArg) {
      if (eventNameArg === eventName) observer.apply(this, arguments);
    });
  };
  StatecoreClass.prototype.statecoreClassNotifyAllEventObservers = function statecoreClassNotifyAllEventObservers(eventName) {
    this.statecoreNotifyAllObservers.apply(this, arguments);
  };
  return { STATECORE_EVENT__STATE_CHANGE: STATECORE_EVENT__STATE_CHANGE, createStatecore: createStatecore, StatecoreClass: StatecoreClass };
});
