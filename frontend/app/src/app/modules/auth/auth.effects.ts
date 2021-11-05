import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "@modules/auth/auth.service";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

import { fetchUserAttempted, fetchUserFailed, fetchUserSuccess, logOutAttempted, logOutFailed, logOutSuccess } from "./auth.reducer";

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}

  fetchUserAttempted$ = createEffect(() => this.actions$.pipe(
    ofType(fetchUserAttempted),
    switchMap(() => this.authService.auth()
      .pipe(
        map(user => fetchUserSuccess({ user })),
        catchError(() => of(fetchUserFailed())),
      ))
    )
  );

  logOutAttempted$ = createEffect(() => this.actions$.pipe(
    ofType(logOutAttempted),
    switchMap(() => this.authService.logout()
      .pipe(
        map(() => logOutSuccess()),
        catchError(() => of(logOutFailed())),
      ))
    )
  );

}