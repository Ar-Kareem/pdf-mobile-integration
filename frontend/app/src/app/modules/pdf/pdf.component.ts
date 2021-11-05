import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authActions, authSelectors } from '@modules/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getDefaultApplicationManifest, setGlobalApplicationManifest } from 'src/app/app.manifest';
import { environment } from 'src/environments/environment';
import { pdfActions, pdfSelectors } from './pdf.reducer';
import { PdfService } from './pdf.service';
import { PdfStorageUtils } from './session/pdf-storage-utils';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject<boolean>();
  sessId: string|null = null;

  pdf: {
    available: boolean,
    src: string,
    loaded: boolean,
  } = {
    available: true,
    src: 'https://arxiv.org/pdf/1905.11397.pdf',
    loaded: false,
  }

  toolbarOpen = true;

  constructor(
    private store: Store,
    private pdfService: PdfService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (!environment.production) {
      (window as any)['PdfStorageUtils'] = PdfStorageUtils;
      (window as any)['PdfComponent'] = this
    }
    this.setupManifest();
    this.initStore();

    setTimeout(() => {
      this.sessId = PdfStorageUtils.getSessionIdAndSync(this.router, this.route);
      this.store.dispatch(pdfActions.setPdfStorageId({id: this.sessId}));

      const sess = PdfStorageUtils.getSessionFromStorage(this.sessId);
      if (!!sess.url) {
        this.store.dispatch(pdfActions.loadPdfFromUrl({url: sess.url}));
      }
    }, 0);
  }

  private initStore() {
    this.store.select(authSelectors.selectHeaderVisibility)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(status => {
      this.toolbarOpen = status;
    });
    
    this.store.select(pdfSelectors.selectLoadedPdfUrl)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(url => {
      if (url !== null) {
        this.setPdfUrl(url);
        if (!!this.sessId) {
          const session = PdfStorageUtils.getSessionFromStorage(this.sessId);
          session.url = url;
          PdfStorageUtils.setSessionToStorage(session);
        }
      }
    });
  }

  onClickPdfViewer(event: MouseEvent) {
    if (event.detail == 2) {
      this.store.dispatch(authActions.toggleHeaderVisibility());
    }
    if (event.detail == 3) {
      this.toggleFullScreen();
    }
  }

  /**
   * Toggle fullscreen
   * From https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
   */
  private toggleFullScreen() {
    var doc = window.document as any;
    var docEl = doc.documentElement as any;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }

  private setupManifest() {
    const manifestJSON = getDefaultApplicationManifest();
    manifestJSON['background_color'] = '#888888'
    manifestJSON['theme_color'] = '#888888'
    setGlobalApplicationManifest(manifestJSON)
  }

  setPdfUrl(url: string) {
    // need to set to empty string to make sure pdf component notices the change of url in case the url is the same as before
    this.pdf.src = '';
    this.changeDetectorRef.detectChanges();
    this.pdf.src = url;
    this.changeDetectorRef.detectChanges();

    this.store.dispatch(pdfActions.setPdfLoadStatus({status: 'Loading...'}))
    this.pdf.loaded = false;
  }

  pdf_viewer_on_progress(event: any) {
    if (!!event.loaded && !!event.total) {
      const status = Math.floor(100 * event.loaded/event.total) + '%'
      this.store.dispatch(pdfActions.setPdfLoadStatus({status: status}))
    }
    this.pdf.loaded = false;
    console.log('pdf_viewer_on_progress', event);
  }

  pdf_viewer_error(event: any) {
    console.log('pdf_viewer_error', event);
    this.store.dispatch(pdfActions.setPdfLoadStatus({status: 'PDF Load Error!'}))
    this.pdf.loaded = false;
  }

  pdf_viewer_after_load_complete(event: any) {
    console.log('pdf_viewer_after_load_complete', event);
    this.store.dispatch(pdfActions.setPdfLoadStatus({status: null}))
    this.pdf.loaded = true;
  }

  // private async download(url='https://arxiv.org/pdf/1905.11397.pdf') {
  //   const result = await this.pdfService.download(url).toPromise()
  //   console.log(result);
  // }

  // private async last_saved() {
  //   const result = await this.pdfService.last_saved().toPromise()
  //   this.pdf.src = result.last_saved_pdf
  //   this.pdf.available = true;
  //   this.changeDetectorRef.detectChanges();
  //   console.log(result);
  // }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
