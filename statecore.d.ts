declare global {
    interface Window {
        createStatecore: typeof createStatecore;
    }
}

declare namespace NodeJS {
    interface Global {
        createStatecore: typeof createStatecore;
    }
}

export type StatecoreObserver = (...args: any[]) => void;
export type StatecoreObserverRemover = () => void;

export interface Statecore {
    statecoreDiscard(): void;
    statecoreIsDiscarded(): boolean;
    statecoreGetState(): any;
    statecoreSetState(state: any): any;
    statecoreRemoveObserver(observer: StatecoreObserver): void;
    statecoreAddObserver(observer: StatecoreObserver): StatecoreObserverRemover;
    statecoreGetAllObservers(): StatecoreObserver[] | null;
    statecoreNotifyAllObservers(...args: any[]): void;
}

export const STATECORE_EVENT__STATE_CHANGE: string;
export const STATECORE_EVENT__DISCARD: string;

export function createStatecore(initialState?: any): Statecore;

export class StatecoreClass implements Statecore {
    // StatecoreClass methods
    constructor(initialState?: any);
    statecoreClassAddEventObserver(...eventArgs: any[], observer: StatecoreObserver): StatecoreObserverRemover;
    statecoreClassNotifyAllEventObservers(...eventArgs: any[]): void;
    // Statecore interface
    statecoreDiscard(): void;
    statecoreIsDiscarded(): boolean;
    statecoreGetState(): any;
    statecoreSetState(state: any): any;
    statecoreRemoveObserver(observer: StatecoreObserver): void;
    statecoreAddObserver(observer: StatecoreObserver): StatecoreObserverRemover;
    statecoreGetAllObservers(): StatecoreObserver[] | null;
    statecoreNotifyAllObservers(...args: any[]): void;
}
