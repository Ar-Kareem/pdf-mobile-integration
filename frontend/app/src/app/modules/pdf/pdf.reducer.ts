import { PdfRequestModel } from '@models/PdfRequestModel';
import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';


// ACTIONS

export const downloadPdfAttempted = createAction('[PDF Action] downloadPdfAttempted', props<{url: string}>());
export const downloadPdfSuccess = createAction('[PDF Action] downloadPdfSuccess', props<{req: string}>());
export const downloadPdfFailed = createAction('[PDF Action] downloadPdfFailed');

export const setPdfNameAttempted = createAction('[PDF Action] setPdfNameAttempted', props<{req: string, name: string}>());
export const setPdfNameSuccess = createAction('[PDF Action] setPdfNameSuccess');
export const setPdfNameFailed = createAction('[PDF Action] setPdfNameFailed');

export const setPdfLoadStatus = createAction('[PDF Action] setPdfLoadStatus', props<{status: string|null}>());

export const loadPdfFromUrl = createAction('[PDF Action] loadPdfFromUrl', props<{url: string}>());
export const setActiveReq = createAction('[PDF Action] setActiveReqId', props<{req: PdfRequestModel}>())
export const setAllReqs = createAction('[PDF Action] setActiveReqId', props<{reqs: PdfRequestModel[]}>())
export const setPdfStorageId = createAction('[PDF Action] setPdfStorageId', props<{id: string}>())


// STATE

export type pdfState = {
  action: string|null,
  loadedPdfUrl: string|null,
  pdfLoadStatus: string|null,
  pdfRequest: PdfRequestModel|null,
  allPdfRequests: PdfRequestModel[]|null,
  pdfStorageId: string|null,
}
const initialState: pdfState = {
  action: null,
  loadedPdfUrl: null,
  pdfLoadStatus: null,
  pdfRequest: null,
  allPdfRequests: null,
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

  on(setActiveReq, (state, { req }) => ({...state, action: setActiveReq.type, pdfRequest: req})),
  on(setAllReqs, (state, { reqs }) => ({...state, action: setAllReqs.type, allPdfRequests: reqs})),
  on(setPdfStorageId, (state, { id }) => ({...state, action: setPdfStorageId.type, pdfStorageId: id})),
);


// SELECTORS

export const pdfFeatureKey = 'pdfFeatureKey';
export const selectpdfState = createFeatureSelector<pdfState>(pdfFeatureKey);

export const selectLoadedPdfUrl = createSelector(
  selectpdfState,
  (state) => state.loadedPdfUrl
);

export const selectPdfLoadstatus = createSelector(
  selectpdfState,
  (state) => state.pdfLoadStatus
);

export const selectHeaderVisibility = createSelector(
  selectpdfState,
  (state) => state.loadedPdfUrl
);

export const selectPdfRequest = createSelector(
  selectpdfState,
  (state) => state.pdfRequest
);

export const selectAllPdfRequests = createSelector(
  selectpdfState,
  (state) => state.allPdfRequests
);

export const selectPdfStorageId = createSelector(
  selectpdfState,
  (state) => state.pdfStorageId
);
