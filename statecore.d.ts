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
  statecoreDiscard(): any;
  statecoreIsDiscarded(): boolean;
  statecoreGetState(): any;
  statecoreSetState(state: any): any;
  statecoreRemoveObserver(observer: StatecoreObserver): any;
  statecoreAddObserver(observer: StatecoreObserver): StatecoreObserverRemover;
  statecoreNotifyAllObservers(...args: any[]): void;
}

export function createStatecore(initialState?: any): Statecore;