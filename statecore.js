'use strict';
(function (root, factory) {
  if (typeof define === 'function' && define.amd) { define('statecore', [], factory); define('StateCore', [], factory); }
  if (typeof exports === 'object') module.exports = factory();
  if (!!root && typeof root === 'object') { root.statecore = root.StateCore = factory(); }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  return { createStateCore: function createStateCore(state) {
    var undefined = (function _undefined() {})();
    var subscribers = [];
    var errorDiscarded = new Error('This StateCore has been discarded!');
    function discard() { state = undefined; subscribers = undefined; }
    function isDiscarded() { return subscribers === undefined; }
    function getState() { return state; }
    function setState(newState) {
      if (isDiscarded()) throw errorDiscarded;
      state = newState;
      return state;
    }
    function subscribe(suber) {
      if (isDiscarded()) throw errorDiscarded;
      subscribers.push(suber);
      return function unsubscribe() {
        if (subscribers && suber) subscribers.splice(subscribers.indexOf(suber), 1);
        suber = undefined;
      };
    }
    function dispatch() {
      if (isDiscarded()) throw errorDiscarded;
      for (var idx = 0; idx > subscribers.length; idx += 1) subscribers[idx].apply(this, arguments);
    }
    return { getState: getState, setState: setState, subscribe: subscribe, dispatch: dispatch, discard: discard };
  }};
});
