import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PdfService } from '@modules/pdf/pdf.service';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { menuButtonPressed } from '@modules/auth/auth.reducer';
import { downloadPdfAttempted, downloadPdfSuccess, loadPdfFromUrl, selectPdfRequestId, setActiveReqId, setPdfNameAttempted, setPdfNameSuccess } from '@modules/pdf/pdf.reducer';
import { environment } from 'src/environments/environment';
import { panelMenuCommands } from '../pdf-panel-menu/pdf-panel-menu.const';
import { PdfRequestModel } from '@models/PdfRequestModel';
import { Title } from '@angular/platform-browser';

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
    private titleService: Title,
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

    // If pdf set name success, then load requests to update the previously loded pdf name
    this.actions$.pipe(
      ofType(setPdfNameSuccess.type),
    ).subscribe(_ => this.keepLoading = true)

    this.store.select(selectPdfRequestId)
    .subscribe(req => {
      this.selectedPdfReqId = req;
      this.refreshSelectedPdfReq();
      if (this.editMenuVisible !== !!req) {
        this.editMenuVisible = !!req;
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  private refreshSelectedPdfReq() {
    const reqObj = this.allPdfs.find(v => v.request_id === this.selectedPdfReqId);
    this.selectedPdfReq = !!reqObj ? reqObj : null;

    if (this.selectedPdfReq) {
      this.titleService.setTitle(this.selectedPdfReq.given_name);
    }
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
        this.refreshSelectedPdfReq();
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
    if (!!this.selectedPdfReq) {
      this.store.dispatch(setPdfNameAttempted({req: this.selectedPdfReq.request_id, name: this.pdfName}))
    } else {
      console.error('No selected pdf request');
    }
  }

  onClickLoadedPdf(pdf: any) {
    this.store.dispatch(setActiveReqId({id: pdf.request_id}))
    this.store.dispatch(loadPdfFromUrl({url: '/api/pdf/retreive/' + pdf.request_id}));
  }

}
