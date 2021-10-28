import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { BaseService } from './base.service';

@Injectable()
export class AuthService extends BaseService {

  protected readonly API = {
    BASE_AUTH_API: this.AUTH_API + '',
    LOGOUT: this.AUTH_API + 'logout'
  }

  constructor(private http: HttpClient) { super() }

  auth() {
    console.log('URL SENT');
    return this.http.post<{resp: boolean}>(this.API.BASE_AUTH_API, {}, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  logout() {
    return this.http.post<any>(this.API.LOGOUT, {}, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
}