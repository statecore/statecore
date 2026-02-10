import statecore from './statecore.js';

export const {
  STATECORE_VERSION,
  STATECORE_EVENT__STATE_CHANGE,
  STATECORE_EVENT__DESTROY,
  STATECORE_EVENT__OBSERVER_ERROR,
  createStatecore,
  StatecoreClass,
} = statecore;

export default statecore;
