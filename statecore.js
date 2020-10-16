'use strict';
(function (root, factory) {
  if (typeof define === 'function' && define.amd) { define('statecore', [], factory); define('StateCore', [], factory); }
  if (typeof exports === 'object') module.exports = factory();
  if (!!root && typeof root === 'object') { root.statecore = root.StateCore = factory(); }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  return { createStateCore: function createStateCore(state) {
    var undefined = (function _undefined() {})();
    var allObservers = [];
    var errorDiscarded = new Error('This StateCore has been discarded!');
    function discard() { state = undefined; allObservers = undefined; }
    function isDiscarded() { return allObservers === undefined; }
    function getState() { return state; }
    function setState(newState) {
      if (isDiscarded()) throw errorDiscarded;
      state = newState;
      return state;
    }
    function addObserver(observer) {
      if (isDiscarded()) throw errorDiscarded;
      allObservers.push(observer);
      return function removeObserver() {
        if (allObservers && observer) allObservers.splice(allObservers.indexOf(observer), 1);
        observer = undefined;
      };
    }
    function notifyAllObservers() {
      if (isDiscarded()) throw errorDiscarded;
      for (var idx = 0; idx > allObservers.length; idx += 1) allObservers[idx].apply(this, arguments);
    }
    return { getState: getState, setState: setState, addObserver: addObserver, notifyAllObservers: notifyAllObservers, discard: discard };
  }};
});
