import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "@modules/auth/auth.service";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

import { authActions } from "./auth.reducer";

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}

  fetchUserAttempted$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.fetchUserAttempted),
    switchMap(() => this.authService.auth()
      .pipe(
        map(user => authActions.fetchUserSuccess({ user })),
        catchError(() => of(authActions.fetchUserFailed())),
      ))
    )
  );

  logOutAttempted$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.logOutAttempted),
    switchMap(() => this.authService.logout()
      .pipe(
        map(() => authActions.logOutSuccess()),
        catchError(() => of(authActions.logOutFailed())),
      ))
    )
  );

}