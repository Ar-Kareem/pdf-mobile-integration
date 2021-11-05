import { Action, createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';


// ACTIONS

const loadPdfFromUrl = createAction('[PDF Action] loadPdfFromUrl', props<{url: string}>());

const downloadPdfAttempted = createAction('[PDF Action] downloadPdfAttempted', props<{url: string}>());
const downloadPdfSuccess = createAction('[PDF Action] downloadPdfSuccess', props<{req: string}>());
const downloadPdfFailed = createAction('[PDF Action] downloadPdfFailed');

const setPdfStorageId = createAction('[PDF Action] setPdfStorageId', props<{id: string}>())

export const pdfActions = {
  loadPdfFromUrl,
  downloadPdfAttempted,
  downloadPdfSuccess,
  downloadPdfFailed,
  setPdfStorageId,
};


// STATE

export type pdfState = {
  action: string|null,
  loadedPdfUrl: string|null,
  pdfStorageId: string|null,
}
const initialState: pdfState = {
  action: null,
  loadedPdfUrl: null,
  pdfStorageId: null,
};


// REDUCER

export const pdfReducer = createReducer(
  initialState,

  on(loadPdfFromUrl, (state, { url }) => ({...state, action: loadPdfFromUrl.type, loadedPdfUrl: url})),

  on(downloadPdfAttempted, (state) => ({...state, action: downloadPdfAttempted.type})),
  on(downloadPdfSuccess, (state) => ({...state, action: downloadPdfSuccess.type})),
  on(downloadPdfFailed, (state) => ({...state, action: downloadPdfFailed.type})),

  on(setPdfStorageId, (state, { id }) => ({...state, action: setPdfStorageId.type, pdfStorageId: id})),
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

const selectPdfStorageId = createSelector(
  selectpdfState,
  (state) => state.pdfStorageId
);

export const pdfSelectors = {
  selectpdfState,
  selectHeaderVisibility,
  selectLoadedPdfUrl,
  selectPdfStorageId,
}
