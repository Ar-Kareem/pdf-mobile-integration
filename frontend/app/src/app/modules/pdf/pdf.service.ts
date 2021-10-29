import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { BaseService } from '@services/base.service';

@Injectable()
export class PdfService extends BaseService {

  private controllerAPI = this.BASE_API + 'auth/';

  protected readonly API = {
    DOWNLOAD: this.PDF_API + 'download',
    LAST_SAVED: this.PDF_API + 'last_saved',
  }

  constructor(private http: HttpClient) { super() }

  download(url: string) {
    return this.http.post<any>(this.API.DOWNLOAD, {url}, this.httpOptions)
  }

  last_saved() {
    return this.http.post<any>(this.API.LAST_SAVED, {}, this.httpOptions)
  }

}