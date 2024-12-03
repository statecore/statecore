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
  statecoreGetAllObservers(): StatecoreObserver[];
  statecoreNotifyAllObservers(...args: any[]): void;
}

export const statecoreStateEventName: string;
export function createStatecore(initialState?: any): Statecore;
