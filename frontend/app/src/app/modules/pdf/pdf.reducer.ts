import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';


// ACTIONS

const loadPdfFromUrl = createAction('[PDF Action] loadPdfFromUrl', props<{url: string}>());

export const pdfActions = {
  loadPdfFromUrl,
};


// STATE

export type pdfState = {
  action: string|null,
  loadedPdfUrl: string|null,
}
const initialState: pdfState = {
  action: null,
  loadedPdfUrl: null,
};


// REDUCER

export const pdfReducer = createReducer(
  initialState,

  on(loadPdfFromUrl, (state, { url }) => ({...state, action: loadPdfFromUrl.type, loadedPdfUrl: url})),
);


// SELECTORS

export const pdfFeatureKey = 'pdfFeatureKey';
const selectpdfState = createFeatureSelector<pdfState>(pdfFeatureKey);

const selectLoadedPdfUrl = createSelector(
  selectpdfState,
  (state) => state.loadedPdfUrl
);

const selectHeaderVisibility = createSelector(
  selectpdfState,
  (state) => state.loadedPdfUrl
);

export const pdfSelectors = {
  selectpdfState,
  selectHeaderVisibility,
  selectLoadedPdfUrl,
}
