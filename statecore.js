(function modelify(rootProvider, name, deps, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) return name ? define(name, deps, factory) : define(deps, factory);
  if (typeof exports === 'object') return module.exports = factory.apply(this, deps.map(dep => require(dep)));
  const root = (typeof rootProvider === 'function' ? rootProvider() : rootProvider);
  if (!root || typeof root !== 'object') throw new Error('Invalid root object!');
  const model = factory.apply(this, deps.map(dep => root[dep]));
  if (name) return root[name] = model;
})(function rootProvider() {
  return (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this);
}, 'statecore', [], function def () {
  'use strict';
  return { createStatecore: function createStatecore(state) {
    var undefined = (function _undefined() {})();
    var allObservers = [];
    function statecoreDiscard() { state = undefined; allObservers = undefined; }
    function statecoreIsDiscarded() { return allObservers === undefined; }
    function statecoreGetState() { return state; }
    function statecoreSetState(newState) {
      if (statecoreIsDiscarded()) throw new Error('This Statecore has been discarded!');
      state = newState;
      return state;
    }
    function statecoreAddObserver(observer) {
      if (statecoreIsDiscarded()) throw new Error('This Statecore has been discarded!');
      allObservers.push(observer);
      return function removeObserver() {
        if (allObservers && observer) allObservers.splice(allObservers.indexOf(observer), 1);
        observer = undefined;
      };
    }
    function statecoreNotifyAllObservers() {
      if (statecoreIsDiscarded()) throw new Error('This Statecore has been discarded!');
      for (var idx = 0; idx < allObservers.length; idx += 1) allObservers[idx].apply(this, arguments);
    }
    return { statecoreGetState: statecoreGetState, statecoreSetState: statecoreSetState, statecoreAddObserver: statecoreAddObserver, statecoreNotifyAllObservers: statecoreNotifyAllObservers, statecoreDiscard: statecoreDiscard, statecoreIsDiscarded: statecoreIsDiscarded };
  }};
});
