import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PdfService } from '@modules/pdf/pdf.service';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { menuButtonPressed, selectAuthState } from '@modules/auth/auth.reducer';
import { downloadPdfAttempted, downloadPdfSuccess, loadPdfFromUrl, selectPdfRequestId, setActiveReqId } from '@modules/pdf/pdf.reducer';
import { environment } from 'src/environments/environment';
import { panelMenuCommands } from '../pdf-panel-menu/pdf-panel-menu.const';
import { PdfRequestModel } from '@models/PdfRequestModel';

@Component({
  selector: 'app-pdf-sidebar',
  templateUrl: './pdf-sidebar.component.html',
  styleUrls: ['./pdf-sidebar.component.scss']
})
export class PdfSidebarComponent implements OnInit {

  display: boolean = true; // ngModel
  pdfUrlLoad: string = ''; // ngModel
  pdfUrlDownload: string = ''; // ngModel
  pdfName: string = ''; // ngModel

  // panel menu I/O
  panelMenuCommand: string|null = panelMenuCommands.allDownloadedPdf;
  editMenuVisible: boolean = false;

  selectedPdfReqId: string|null = null;
  selectedPdfReq: PdfRequestModel|null = null;
  panelMenuCommands = panelMenuCommands;

  constructor(
    private store: Store,
    private actions$: Actions,
    private pdfService: PdfService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    if (!environment.production) {
      (window as any)['PdfSidebarComponent'] = this;
    }
  }

  ngOnInit(): void {
    this.initStore();
    this.getProgress();
  }

  private initStore() {
    this.actions$.pipe(
      ofType(menuButtonPressed.type),
    ).subscribe(_ => this.display = !this.display)

    // If download success, then keep loading requests to progressivly update percentage loaded
    this.actions$.pipe(
      ofType(downloadPdfSuccess.type),
    ).subscribe(_ => this.keepLoading = true)

    this.store.select(selectPdfRequestId)
    .subscribe(req => {
      this.selectedPdfReqId = req;
      const reqObj = this.allPdfs.find(v => v.request_id === req)
      this.selectedPdfReq = !!reqObj ? reqObj : null;
      if (this.editMenuVisible !== !!req) {
        this.editMenuVisible = !!req;
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  
  allPdfs: PdfRequestModel[] = [];
  validPdfs: PdfRequestModel[] = [];
  keepLoading: boolean = true;
  private async getProgress() {
    if (this.keepLoading) {
      const result = await this.pdfService.get_all_request().toPromise();
      if (result && result.result) {
        const valid = (result.result as PdfRequestModel[])
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
    this.store.dispatch(loadPdfFromUrl({url: this.pdfUrlLoad}));
  }

  onClickDownloadPdfUrl() {
    this.store.dispatch(downloadPdfAttempted({url: this.pdfUrlDownload}));
  }

  onClickSetPdfName() {

  }

  onClickLoadedPdf(pdf: any) {
    this.store.dispatch(setActiveReqId({id: pdf.request_id}))
    this.store.dispatch(loadPdfFromUrl({url: '/api/pdf/retreive/' + pdf.request_id}));
  }

}
