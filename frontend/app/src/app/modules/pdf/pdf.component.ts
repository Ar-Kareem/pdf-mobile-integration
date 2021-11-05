import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authSelectors, toggleHeaderVisibility } from '@modules/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getDefaultApplicationManifest, setGlobalApplicationManifest } from 'src/app/app.manifest';
import { environment } from 'src/environments/environment';
import { loadPdfFromUrl, pdfSelectors, setPdfLoadStatus, setPdfStorageId } from './pdf.reducer';
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
    page: number,
    loaded: boolean,
  } = {
    available: false,
    src: '',
    page: 0,
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
    this.setPdfUrl(null);
    this.setupManifest();
    this.initStore();

    setTimeout(() => {
      this.sessId = PdfStorageUtils.getSessionIdAndSync(this.router, this.route);
      this.store.dispatch(setPdfStorageId({id: this.sessId}));

      const sess = PdfStorageUtils.getSessionFromStorage(this.sessId);
      if (!!sess.url) {
        this.store.dispatch(loadPdfFromUrl({url: sess.url}));
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

    this.store.select(authSelectors.selectUser)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(user => {
      if (!!user && !!this.pdf.available && !this.pdf.loaded) { // signed in user changed and pdf did not load
        this.setPdfUrl(this.pdf.src); // reload pdf
      }
    })
  }

  onClickPdfViewer(event: MouseEvent) {
    if (event.detail == 2) {
      this.store.dispatch(toggleHeaderVisibility());
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

  setPdfUrl(url: string|null) {
    if (!!url) {
      // need to set to empty string to make sure pdf component notices the change of url in case the url is the same as before
      this.pdf.src = '';
      this.changeDetectorRef.detectChanges();
      this.pdf.src = url;
      this.changeDetectorRef.detectChanges();

      this.pdf.available = true;
      this.store.dispatch(setPdfLoadStatus({status: 'Loading...'}))

    } else {
      this.pdf.available = false;
      this.pdf.src = '';
      this.store.dispatch(setPdfLoadStatus({status: 'No PDF'}))
    }
    this.pdf.loaded = false;
  }

  pdf_viewer_on_page_change(num: number){
    console.log(num);
    if (!!this.sessId) {
      const session = PdfStorageUtils.getSessionFromStorage(this.sessId);
      session.page = num + '';
      PdfStorageUtils.setSessionToStorage(session);
    }
  }


  pdf_viewer_on_progress(event: any) {
    if (!!event.loaded && !!event.total) {
      const status = Math.floor(100 * event.loaded/event.total) + '%'
      this.store.dispatch(setPdfLoadStatus({status: status}))
    }
    this.pdf.loaded = false;
    console.log('pdf_viewer_on_progress', event);
  }

  pdf_viewer_error(event: any) {
    console.log('pdf_viewer_error', event);
    this.store.dispatch(setPdfLoadStatus({status: 'PDF Load Error!'}))
    this.pdf.loaded = false;
  }

  pdf_viewer_after_load_complete(event: any) {
    console.log('pdf_viewer_after_load_complete', event);
    this.store.dispatch(setPdfLoadStatus({status: null}))
    this.pdf.loaded = true;
    if (this.sessId) {
      const session = PdfStorageUtils.getSessionFromStorage(this.sessId);
      console.log(session);
      setTimeout(() => {
        if (this.pdf.src == session.url && parseInt(session.page) > 0) {
          console.log(session.page);
          this.pdf.page = parseInt(session.page)
        }
      }, 100);
    }
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
