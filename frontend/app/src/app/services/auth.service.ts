import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { BaseService } from './base.service';
import { User } from '@models/UserModel';

@Injectable()
export class AuthService extends BaseService {

  protected readonly API = {
    BASE_AUTH_API: this.AUTH_API + '',
    LOGOUT: this.AUTH_API + 'logout'
  }

  constructor(private http: HttpClient) { super() }

  auth() {
    console.log('URL SENT');
    return this.http.post<User>(this.API.BASE_AUTH_API, {}, this.httpOptions)
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