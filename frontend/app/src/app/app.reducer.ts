import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';


// ACTIONS



// STATE

export type appState = {
}
const initialState: appState = {
};


// REDUCER

export const appReducer = createReducer(
  initialState,

);


// SELECTORS

export const appFeatureKey = 'appFeatureKey';
export const selectAppState = createFeatureSelector<appState>(appFeatureKey);

