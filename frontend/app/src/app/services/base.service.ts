import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';



import { HttpHeaders } from '@angular/common/http';

export abstract class BaseService {

  // base api
  protected readonly BASE_API = '/api/'

  // controller api's
  protected readonly TRIAL_API = this.BASE_API + 'trial/'
  protected readonly AUTH_API = this.BASE_API + 'auth/'


  // child api implements this
  protected readonly abstract API: {[api: string]: string};


  protected readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };


  protected handleError(error: HttpErrorResponse) {
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