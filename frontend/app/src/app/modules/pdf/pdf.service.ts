import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { BaseService } from '@services/base.service';

@Injectable()
export class PdfService extends BaseService {

  protected readonly API = {
    request: this.PDF_API + 'request',
    get_all_request: this.PDF_API + 'get_all_request',
    download: this.PDF_API + 'download',
    progress: this.PDF_API + 'progress',
    retreive: this.PDF_API + 'retreive',
    set_req_name: this.PDF_API + 'set_req_name',
  }

  constructor(private http: HttpClient) {
    super();
    (window as any)['PdfService'] = this;
  }

  create_request() {
    return this.http.post<any>(this.API.request, {}, this.httpOptions)
  }

  get_all_request() {
    return this.http.post<any>(this.API.get_all_request, {}, this.httpOptions)
  }

  download(req: string, url: string) {
    return this.http.post<any>(this.API.download, {url, req}, this.httpOptions)
  }

  progress(req: string[]) {
    return this.http.post<any>(this.API.progress, {req}, this.httpOptions)
  }

  retreive(req: string) {
    return this.http.get<any>(this.API.retreive + '/' + req, this.httpOptions)
  }

  set_request_name(req: string, name: string) {
    return this.http.post<any>(this.API.set_req_name, {req, name}, this.httpOptions)
  }

}