/**
 * @author MrZenW
 * @email MrZenW@gmail.com
 * @website https://github.com/MrZenW
 * @website https://MrZenW.com
 * @license MIT
 * @version 3.1.0
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
    var STATECORE_VERSION = '3.1.0';
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
            state = null;
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
        function statecoreGetAllObservers() { return allObservers ? allObservers.slice() : null; }
        function statecoreRemoveObserver(observer) {
            _throwError_IfDestroyed();
            var existingObserverIndex = allObservers.indexOf(observer);
            if (existingObserverIndex > -1) {
                var copyObservers = allObservers.slice()
                copyObservers.splice(existingObserverIndex, 1);
                allObservers = copyObservers;
            }
        }
        function statecoreAddObserver(observer) {
            _throwError_IfDestroyed();
            if (typeof observer !== 'function') throw new Error('The observer must be a function!');
            if (allObservers.indexOf(observer) === -1) {
                var copyObservers = allObservers.slice();
                copyObservers.push(observer);
                allObservers = copyObservers;
            }
            return function removeObserver() { statecoreRemoveObserver(observer); };
        }
        function _call_statecoreNotifyAllObservers(caller, args, emitErrorEventIfObserversThrowError) {
            var copyObservers = allObservers.slice();
            var restObserversCount = copyObservers.length;
            var results = [];
            while (restObserversCount > 0) {
                try {
                    while (restObserversCount > 0) {
                        results.push({
                            value: copyObservers[copyObservers.length - (restObserversCount--)].apply(caller, args)
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
        return { STATECORE_VERSION: STATECORE_VERSION, statecoreGetState: statecoreGetState, statecoreSetState: statecoreSetState, statecoreAddObserver: statecoreAddObserver, statecoreGetAllObservers: statecoreGetAllObservers, statecoreRemoveObserver: statecoreRemoveObserver, statecoreNotifyAllObservers: statecoreNotifyAllObservers, statecoreDestroy: statecoreDestroy, statecoreIsDestroyed: statecoreIsDestroyed };
    }
    function StatecoreClass(initialState) {
        if (!(this instanceof StatecoreClass)) return new StatecoreClass(initialState);
        var statecore = createStatecore(initialState);
        for (var key in statecore) this[key] = statecore[key];
    }
    StatecoreClass.prototype.statecoreClassAddEventObserver = function statecoreClassAddEventObserver(/* eventName, observer */) {
        var wantArgs = Array.prototype.slice.call(arguments, 0);
        var observer = wantArgs.pop();
        if (typeof observer !== 'function') throw new Error('The last argument must be a function!');
        return this.statecoreAddObserver(function (/* ...givenArgs */) {
            if (arguments.length < wantArgs.length) return; // return if not enough arguments
            for (var i = 0; i < wantArgs.length; i++) if (arguments[i] !== wantArgs[i]) return; // return if any of the arguments don't match
            observer.apply(this, arguments);
        });
    };
    StatecoreClass.prototype.statecoreClassNotifyAllEventObservers = function statecoreClassNotifyAllEventObservers(eventName) {
        return this.statecoreNotifyAllObservers.apply(this, arguments);
    };
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
