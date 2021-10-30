import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';

import { User } from '@models/UserModel';


// ACTIONS

const setAppSession = createAction('[App Action] setAppSession', props<{sessionId: string}>());

export const appActions = {
  setAppSession,
};


// STATE

export type appState = {
  action: string|null,
  sessionId: string|null,
}
const initialState: appState = {
  action: null,
  sessionId: null,
};


// REDUCER

export const appReducer = createReducer(
  initialState,

  on(setAppSession, (state, {sessionId}) => ({...state, action: setAppSession.type, sessionId: sessionId})),
);


// SELECTORS

export const appFeatureKey = 'appFeatureKey';
const selectAppState = createFeatureSelector<appState>(appFeatureKey);

const selectSessionId = createSelector(
  selectAppState,
  (state) => state.sessionId
);

export const appSelectors = {
  selectAppState,
  selectSessionId,
}