import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';

import { User } from '@models/UserModel';


// ACTIONS

export const fetchUserAttempted = createAction('[Auth Action] fetchUserAttempted');
export const fetchUserSuccess = createAction('[Auth Action] fetchUserSuccess', props<{user: User}>());
export const fetchUserFailed = createAction('[Auth Action] fetchUserFailed');

export const logOutAttempted = createAction('[Auth Action] logOutAttempted');
export const logOutSuccess = createAction('[Auth Action] logOutSuccess');
export const logOutFailed = createAction('[Auth Action] logOutFailed');

export const toggleHeaderVisibility = createAction('[Auth Action] toggleHeaderVisibility');
export const menuButtonPressed = createAction('[Auth Action] menuButtonPressed');


// STATE

export type authState = {
  action: string|null,
  user: User|null,
  headerVisibility: boolean,
}
const initialState: authState = {
  action: null,
  user: null,
  headerVisibility: true,
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

  on(toggleHeaderVisibility, (state, ) => ({...state, action: toggleHeaderVisibility.type, headerVisibility: !state.headerVisibility})),
  on(menuButtonPressed, (state, ) => ({...state, action: menuButtonPressed.type})),
);


// SELECTORS

export const authFeatureKey = 'authFeatureKey';
const selectAuthState = createFeatureSelector<authState>(authFeatureKey);

const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

const selectHeaderVisibility = createSelector(
  selectAuthState,
  (state) => state.headerVisibility
);

export const authSelectors = {
  selectAuthState,
  selectUser,
  selectHeaderVisibility,
}