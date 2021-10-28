import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';

import { User } from '@models/UserModel';


// ACTIONS

const fetchUserAttempted = createAction('[Auth Action] fetchUserAttempted');
const fetchUserSuccess = createAction('[Auth Action] fetchUserSuccess', props<{user: User}>());
const fetchUserFailed = createAction('[Auth Action] fetchUserFailed');

const logOutAttempted = createAction('[Auth Action] logOutAttempted');
const logOutSuccess = createAction('[Auth Action] logOutSuccess');
const logOutFailed = createAction('[Auth Action] logOutFailed');

export const authActions = {
  fetchUserAttempted,
  fetchUserSuccess,
  fetchUserFailed,
  logOutAttempted,
  logOutSuccess,
  logOutFailed,
};


// STATE

export type authState = {
  action: string|null,
  user: User|null,
}
const initialState: authState = {
  action: null,
  user: null
};


// REDUCER

export const authReducer = createReducer(
  initialState,

  on(fetchUserAttempted, (state, ) => ({...state, action: fetchUserAttempted.type})),
  on(fetchUserSuccess, (state, { user }) => ({...state, action: fetchUserSuccess.type, user: user})),
  on(fetchUserFailed, (state, ) => ({...state, action: fetchUserFailed.type, user: null})),

  on(logOutAttempted, (state, ) => ({...state, action: logOutAttempted.type})),
  on(logOutSuccess, (state, ) => ({...state, action: logOutSuccess.type, user: null})),
  on(logOutFailed, (state, ) => ({...state, action: logOutFailed.type, user: null})),
);


// SELECTORS

export const authFeatureKey = 'authFeatureKey';
const selectAuthState = createFeatureSelector<authState>(authFeatureKey);

const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const authSelectors = {
  selectAuthState,
  selectUser,
}