import { Action, createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';


// ACTIONS

const loadPdfFromUrl = createAction('[PDF Action] loadPdfFromUrl', props<{url: string}>());
const setPdfLoadStatus = createAction('[PDF Action] setPdfLoadStatus', props<{status: string|null}>());

const downloadPdfAttempted = createAction('[PDF Action] downloadPdfAttempted', props<{url: string}>());
const downloadPdfSuccess = createAction('[PDF Action] downloadPdfSuccess', props<{req: string}>());
const downloadPdfFailed = createAction('[PDF Action] downloadPdfFailed');

const setPdfStorageId = createAction('[PDF Action] setPdfStorageId', props<{id: string}>())

export const pdfActions = {
  loadPdfFromUrl,
  setPdfLoadStatus,
  downloadPdfAttempted,
  downloadPdfSuccess,
  downloadPdfFailed,
  setPdfStorageId,
};


// STATE

export type pdfState = {
  action: string|null,
  loadedPdfUrl: string|null,
  pdfLoadStatus: string|null,
  pdfStorageId: string|null,
}
const initialState: pdfState = {
  action: null,
  loadedPdfUrl: null,
  pdfLoadStatus: null,
  pdfStorageId: null,
};


// REDUCER

export const pdfReducer = createReducer(
  initialState,

  on(loadPdfFromUrl, (state, { url }) => ({...state, action: loadPdfFromUrl.type, loadedPdfUrl: url})),
  on(setPdfLoadStatus, (state, { status }) => ({...state, action: setPdfLoadStatus.type, pdfLoadStatus: status})),

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

const selectPdfLoadstatus = createSelector(
  selectpdfState,
  (state) => state.pdfLoadStatus
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
  selectPdfLoadstatus,
  selectPdfStorageId,
}
