import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';



import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token'
  })
};



const BASE_API = '/api/'

const TRIAL_API = BASE_API + ''
const GET_CONFIG_API = TRIAL_API + 'TESTT'
const GET_CONFIG_API_API = TRIAL_API + ''



@Injectable()
export class TrialService {
  constructor(private http: HttpClient) { }

  getConfig() {
    console.log('URL SENT');
    return this.http.get<any>(GET_CONFIG_API, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  getConfigApi() {
    console.log('URL SENT');
    return this.http.get<any>(GET_CONFIG_API_API, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}