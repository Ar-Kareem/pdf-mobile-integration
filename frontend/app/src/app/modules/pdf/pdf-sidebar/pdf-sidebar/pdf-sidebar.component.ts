import { Component, OnInit } from '@angular/core';
import { authActions, authSelectors } from '@modules/auth/auth.reducer';
import { pdfActions } from '@modules/pdf/pdf.reducer';
import { PdfService } from '@modules/pdf/pdf.service';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pdf-sidebar',
  templateUrl: './pdf-sidebar.component.html',
  styleUrls: ['./pdf-sidebar.component.scss']
})
export class PdfSidebarComponent implements OnInit {
  display: boolean = true;
  pdfUrlLoad: string = '';
  pdfUrlDownload: string = '';

  constructor(
    private store: Store,
    private actions$: Actions,
    private pdfService: PdfService,
  ) { }

  ngOnInit(): void {
    this.initStore();
    this.getProgress();
  }

  private initStore() {
    this.store.select(authSelectors.selectAuthState)
    .pipe(filter(state => state.action == authActions.menuButtonPressed.type))
    .subscribe(_ => this.display = !this.display)

    this.actions$.pipe(
      ofType(pdfActions.downloadPdfSuccess.type),
    ).subscribe(({req}) => {
      console.log('DOWNLOAD:', req)
      this.keepLoading = true;
    })
  }

  
  allPdfs: any[] = [];
  validPdfs: any[] = [];
  keepLoading: boolean = true;
  private async getProgress() {
    if (this.keepLoading) {
      const result = await this.pdfService.get_all_request().toPromise();
      if (result && result.result) {
        const valid = (result.result as any[])
          .sort((a, b) => a.len - b.len)
        valid.forEach(pdf => {
          pdf.percent = Math.floor(pdf.done/pdf.len * 100)
        })
        this.allPdfs = valid;
        this.validPdfs = valid.filter(pdf => pdf.len);
      }
      console.log(result.result);
    }

    this.keepLoading = this.allPdfs.some(pdf => pdf.percent !== 100)
    setTimeout(() => this.getProgress(), 1000);
  }

  onClickLoadPdfUrl() {
    this.store.dispatch(pdfActions.loadPdfFromUrl({url: this.pdfUrlLoad}));
  }

  onClickDownloadPdfUrl() {
    this.store.dispatch(pdfActions.downloadPdfAttempted({url: this.pdfUrlDownload}));
  }

  onClickLoadedPdf(pdf: any) {
    this.store.dispatch(pdfActions.loadPdfFromUrl({url: '/api/pdf/retreive/' + pdf.request_id}));
  }

}
