import { Action, createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';


// ACTIONS

const loadPdfFromUrl = createAction('[PDF Action] loadPdfFromUrl', props<{url: string}>());

const downloadPdfAttempted = createAction('[PDF Action] downloadPdfAttempted', props<{url: string}>());
const downloadPdfSuccess = createAction('[PDF Action] downloadPdfSuccess', props<{req: string}>());
const downloadPdfFailed = createAction('[PDF Action] downloadPdfFailed');

export const pdfActions = {
  loadPdfFromUrl,
  downloadPdfAttempted,
  downloadPdfSuccess,
  downloadPdfFailed,
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

  on(downloadPdfAttempted, (state) => ({...state, action: downloadPdfAttempted.type})),
  on(downloadPdfSuccess, (state) => ({...state, action: downloadPdfSuccess.type})),
  on(downloadPdfFailed, (state) => ({...state, action: downloadPdfFailed.type})),
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
