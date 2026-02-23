/**
 * @author MrZenW
 * @email MrZenW@gmail.com
 * @website https://github.com/MrZenW
 * @website https://MrZenW.com
 * @license MIT
 * @version 4.0.0
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
})(function moduleFactory() {
    'use strict';
    var STATECORE_VERSION = '4.0.0';
    var STATECORE_EVENT__STATE_CHANGE = '__STATE_CHANGE__';
    var STATECORE_EVENT__DESTROY = '__DESTROY__';
    var STATECORE_EVENT__OBSERVER_ERROR = '__OBSERVER_ERROR__';
    var BuiltInEvents = {
        [STATECORE_EVENT__STATE_CHANGE]: STATECORE_EVENT__STATE_CHANGE,
        [STATECORE_EVENT__DESTROY]: STATECORE_EVENT__DESTROY,
        [STATECORE_EVENT__OBSERVER_ERROR]: STATECORE_EVENT__OBSERVER_ERROR,
    };
    function createStatecore(state) {
        var allObservers = [];
        function statecoreIsDestroyed() { return !allObservers; }
        function statecoreDestroy() {
            _call_statecoreNotifyAllObservers(this, [STATECORE_EVENT__DESTROY], true);
            state = undefined;
            allObservers = null;
        }
        function _throwError_IfDestroyed() {
            if (statecoreIsDestroyed()) throw new Error('The statecore instance has been destroyed!');
        }
        function statecoreGetState() { return state; }
        function statecoreSetState(newState) {
            _throwError_IfDestroyed();
            var oldState = state;
            state = newState;
            _call_statecoreNotifyAllObservers(this, [STATECORE_EVENT__STATE_CHANGE, newState, oldState], true);
            return state;
        }
        function _findObserverIndex(observer) {
            for (var i = 0; i < allObservers.length; i++) if (allObservers[i][0] === observer) return i;
            return -1;
        }
        function statecoreRemoveObserver(observer) {
            _throwError_IfDestroyed();
            var existingObserverIndex = _findObserverIndex(observer);
            if (existingObserverIndex > -1) {
                var copyObservers = allObservers.slice();
                copyObservers.splice(existingObserverIndex, 1);
                allObservers = copyObservers;
            }
        }
        function statecoreAddObserver(someArgs, observer) {
            _throwError_IfDestroyed();
            // > 1 means at least 1 argument before observer, so slice from 0 to -1 to get those arguments as an array; otherwise, if only 1 argument, then it's the observer and there are no arguments before it, so use an empty array
            var args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 0, -1) : [];
            var observer = arguments.length > 0 ? arguments[arguments.length - 1] : null;
            if (typeof observer !== 'function') throw new Error('The observer must be a function!');
            var observerDef = [observer].concat(args);
            var existingObserverIndex = _findObserverIndex(observer);
            if (existingObserverIndex === -1) {
                var copyObservers = allObservers.slice();
                copyObservers.push(observerDef);
                allObservers = copyObservers;
            }
            return function removeObserver() { statecoreRemoveObserver(observer); };
        }
        function _resolve_observer(allObservers, callerArgs) {
            var matchedObservers = [];
            for (var i = 0; i < allObservers.length; i++) {
                var observerDef = allObservers[i];
                // observerDef[0] is the observer function, so compare with observerDef[j + 1], and callerArgs should have at least observerDef.length - 1 arguments to compare
                if (callerArgs.length < observerDef.length - 1) {
                    continue; // skip if not enough arguments
                }
                for (var j = 0; j < observerDef.length - 1; j++) {
                    // observerDef[0] is the observer function, so compare with observerDef[j + 1]
                    if (callerArgs[j] !== observerDef[j + 1]) {
                        continue; // skip if any of the arguments don't match
                    }
                }
                matchedObservers.push(observerDef[0]);
            }
            return matchedObservers;
        }
        function _call_statecoreNotifyAllObservers(caller, args, emitErrorEventIfObserversThrowError) {
            var matchedObservers = _resolve_observer(allObservers.slice(), args);
            var matchedObserversLength = matchedObservers.length;
            var results = [];
            while (matchedObserversLength > 0) {
                try {
                    while (matchedObserversLength > 0) {
                        results.push({
                            value: matchedObservers[matchedObservers.length - matchedObserversLength--].apply(caller, args)
                        });
                    }
                } catch (error) {
                    results.push({ error: error });
                    console.error('Error in statecore observer:', error);
                    if (emitErrorEventIfObserversThrowError) _call_statecoreNotifyAllObservers(caller, [STATECORE_EVENT__OBSERVER_ERROR, error, args], false);
                }
            }
            return results;
        }
        function statecoreNotifyAllObservers(eventName) {
            _throwError_IfDestroyed();
            if (BuiltInEvents[eventName]) throw new Error('Cannot manually emit built-in event: ' + eventName);
            return _call_statecoreNotifyAllObservers(this, arguments, true);
        }
        return { STATECORE_VERSION: STATECORE_VERSION, statecoreGetState: statecoreGetState, statecoreSetState: statecoreSetState, statecoreAddObserver: statecoreAddObserver, statecoreRemoveObserver: statecoreRemoveObserver, statecoreNotifyAllObservers: statecoreNotifyAllObservers, statecoreDestroy: statecoreDestroy, statecoreIsDestroyed: statecoreIsDestroyed };
    }
    function StatecoreClass(initialState) {
        if (!(this instanceof StatecoreClass)) return new StatecoreClass(initialState);
        var statecore = createStatecore(initialState);
        for (var key in statecore) this[key] = statecore[key];
    }
    var _InstanceStoreKey = Math.random().toString(36).substring(2);
    function _preflightInstance(ctor, instanceName) {
        if (!instanceName) throw new Error('Instance name is required!');
        if (!Object.prototype.hasOwnProperty.call(ctor, _InstanceStoreKey)) Object.defineProperty(ctor, _InstanceStoreKey, { value: {}, enumerable: false, configurable: false, writable: false });
    }
    StatecoreClass.statecoreClassStaticGrabInstance = function statecoreClassStaticGrabInstance(isGrab, instanceName, state) {
        if (typeof isGrab === 'string') { state = instanceName; instanceName = isGrab; isGrab = true; }
        isGrab = !!isGrab;
        _preflightInstance(this, instanceName);
        var instance = this[_InstanceStoreKey][instanceName];
        if (instance && instance.statecoreIsDestroyed()) {
            instance = null;
            delete this[_InstanceStoreKey][instanceName];
        }
        if (!instance) {
            if (!isGrab) return null;
            instance = new this(state);
            this[_InstanceStoreKey][instanceName] = instance;
        }
        return instance;
    };
    return {
        STATECORE_EVENT__STATE_CHANGE: STATECORE_EVENT__STATE_CHANGE,
        STATECORE_EVENT__DESTROY: STATECORE_EVENT__DESTROY,
        STATECORE_EVENT__OBSERVER_ERROR: STATECORE_EVENT__OBSERVER_ERROR,
        STATECORE_VERSION: STATECORE_VERSION,
        createStatecore: createStatecore,
        StatecoreClass: StatecoreClass
    };
});
