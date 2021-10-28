import { createAction, createReducer, on, props } from '@ngrx/store';

import { User } from '@models/UserModel';

// ACTIONS
const fetchUserAttempted = createAction('[Auth Action] fetchUserAttempted');
const fetchUserSuccess = createAction('[Auth Action] fetchUserSuccess', props<User>());
const fetchUserFailed = createAction('[Auth Action] fetchUserFailed');

// const fetchUserSuccess2 = createAction('[Auth Action] fetchUserSuccess', props<{user1: User, user2: User}>());

export const authActions = {
    fetchUserAttempted: fetchUserAttempted,
    fetchUserSuccess: fetchUserSuccess,
    fetchUserFailed: fetchUserFailed,
}

// STATE
export type authState = {
    action: string|null,
    user: User|null,
}
export const initialState: authState = {
    action: null,
    user: null
};

// REDUCER
export const authReducer = createReducer(
    initialState,
    on(fetchUserSuccess, (state, user) => ({...state, user: user, action: fetchUserSuccess.type})),
    // on(fetchUserSuccess2, (state, {user1, user2}) => ({...state, user: user2, action: fetchUserSuccess2.type})),

    on(fetchUserAttempted, (state, ) => ({...state, action: fetchUserAttempted.type})),
    on(fetchUserFailed, (state, ) => ({...state, action: fetchUserFailed.type})),
);
