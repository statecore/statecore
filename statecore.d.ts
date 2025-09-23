declare global {
    interface Window {
        statecore: {
            STATECORE_VERSION: string;
            STATECORE_EVENT__STATE_CHANGE: string;
            STATECORE_EVENT__DESTROY: string;
            STATECORE_EVENT__OBSERVER_ERROR: string;
            createStatecore: typeof createStatecore;
            StatecoreClass: typeof StatecoreClass;
        };
    }
    
    var global: {
        statecore: {
            STATECORE_VERSION: string;
            STATECORE_EVENT__STATE_CHANGE: string;
            STATECORE_EVENT__DESTROY: string;
            STATECORE_EVENT__OBSERVER_ERROR: string;
            createStatecore: typeof createStatecore;
            StatecoreClass: typeof StatecoreClass;
        };
    };
    
    var globalThis: {
        statecore: {
            STATECORE_VERSION: string;
            STATECORE_EVENT__STATE_CHANGE: string;
            STATECORE_EVENT__DESTROY: string;
            STATECORE_EVENT__OBSERVER_ERROR: string;
            createStatecore: typeof createStatecore;
            StatecoreClass: typeof StatecoreClass;
        };
    };
    
    var self: {
        statecore: {
            STATECORE_VERSION: string;
            STATECORE_EVENT__STATE_CHANGE: string;
            STATECORE_EVENT__DESTROY: string;
            STATECORE_EVENT__OBSERVER_ERROR: string;
            createStatecore: typeof createStatecore;
            StatecoreClass: typeof StatecoreClass;
        };
    };
}

export type StatecoreObserver = (...args: any[]) => void;
export type StatecoreObserverRemover = () => void;

export interface Statecore {
    STATECORE_VERSION: string;
    statecoreDestroy(): void;
    statecoreIsDestroyed(): boolean;
    statecoreGetState(): any;
    statecoreSetState(state: any): any;
    statecoreRemoveObserver(observer: StatecoreObserver): void;
    statecoreAddObserver(observer: StatecoreObserver): StatecoreObserverRemover;
    statecoreGetAllObservers(): StatecoreObserver[] | null;
    statecoreNotifyAllObservers(eventName: string, ...args: any[]): void;
}

export const STATECORE_VERSION: string;
export const STATECORE_EVENT__STATE_CHANGE: string;
export const STATECORE_EVENT__DESTROY: string;
export const STATECORE_EVENT__OBSERVER_ERROR: string;

export function createStatecore(initialState?: any): Statecore;

export class StatecoreClass implements Statecore {
    // Static methods
    static statecoreClassStaticGrabInstance(instanceName: string, initialState?: any): StatecoreClass;
    static statecoreClassStaticGrabInstance(isGrab: boolean, instanceName: string, initialState?: any): StatecoreClass | null;
    
    // Constructor
    constructor(initialState?: any);
    
    // StatecoreClass-specific methods
    statecoreClassAddEventObserver(...args: [...any[], StatecoreObserver]): StatecoreObserverRemover;
    statecoreClassNotifyAllEventObservers(eventName: string, ...args: any[]): void;
    
    // Statecore interface implementation
    statecoreDestroy(): void;
    statecoreIsDestroyed(): boolean;
    statecoreGetState(): any;
    statecoreSetState(state: any): any;
    statecoreRemoveObserver(observer: StatecoreObserver): void;
    statecoreAddObserver(observer: StatecoreObserver): StatecoreObserverRemover;
    statecoreGetAllObservers(): StatecoreObserver[] | null;
    statecoreNotifyAllObservers(eventName: string, ...args: any[]): void;
}
