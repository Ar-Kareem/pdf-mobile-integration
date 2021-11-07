import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { selectHeaderVisibility, selectUser, toggleHeaderVisibility } from '@modules/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getDefaultApplicationManifest, setGlobalApplicationManifest } from 'src/app/app.manifest';
import { environment } from 'src/environments/environment';
import { loadPdfFromUrl, selectAllPdfRequests, selectLoadedPdfUrl, selectPdfRequest, setActiveReq, setPdfLoadStatus, setPdfStorageId } from './pdf.reducer';
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
    this.store.select(selectHeaderVisibility)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(status => {
      this.toolbarOpen = status;
    });

    // Update browser session whenever loaded pdf url changes
    this.store.select(selectLoadedPdfUrl)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(url => {
      if (url !== null) {
        this.setPdfUrl(url);
        if (!!this.sessId) {
          const session = PdfStorageUtils.getSessionFromStorage(this.sessId);
          if (session.url !== url) { // pdf to load is different than pdf in session
            session.url = url;
            session.page = '0';
            PdfStorageUtils.setSessionToStorage(session);
          }
        }
      }
    });

    // Update browser session whenever loaded pdf request id changes
    this.store.select(selectPdfRequest)
    .subscribe(req => {
      if (!!req && !!this.sessId) {
        const session = PdfStorageUtils.getSessionFromStorage(this.sessId);
        if (session.requestId !== req.request_id) {
          session.requestId = req.request_id;
          PdfStorageUtils.setSessionToStorage(session);
        }
      }
    })

    // whenever signed in user changes and pdf is not loaded, will reload pdf
    this.store.select(selectUser)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(user => {
      if (!!user && !!this.pdf.available && !this.pdf.loaded) {
        this.setPdfUrl(this.pdf.src);
      }
    })

    // only perform this once (when list of pdf reqs load for the first time)
    // will look for the request id stored in the session, if found will load
    const sub = this.store.select(selectAllPdfRequests).subscribe(reqs => {
      if (!!reqs) {
        sub.unsubscribe();
        this.sessId = PdfStorageUtils.getSessionIdAndSync(this.router, this.route);
        const sess = PdfStorageUtils.getSessionFromStorage(this.sessId);
        const reqObj = reqs.find(v => v.request_id === sess.requestId);
        if (!!reqObj && !!sess.requestId) {
          this.store.dispatch((setActiveReq({req: reqObj})));
        }
      }
    })

  }

  /**
   * Unfortunately to detect double/triple click i cant simply look at the .detail value of the mouse event
   * because while every good browser will properly set the .detail value (2 for double, 3 for triple)
   * stupid safari (which means all apple devices) only set the .detail value to 1. So a manual implementation must be made
   * which means that safari is also awful for accessibility purposes. Modern web browsers give the user the option to extend the window for double/triple clicks
   * for accessibility purposes such that slower double/triple clicks will automatically work in all websites for those users that want it.
   * However since safari is so terrible, it forces us to use a custom implementation to count the clicks in a timeframe (as the implementation below)
   * which forces us to specify a fixed timeout (250 in this case) which cannot be adjusted by the users accessibility settings. 
   */
  tripleClickTimer: ReturnType<typeof setTimeout> = setTimeout(() => {}, 0);
  tripleClickCounter: number = 0;
  onClickPdfViewer() {
    clearTimeout(this.tripleClickTimer);
    this.tripleClickCounter++;
    if(this.tripleClickCounter==2) this.store.dispatch(toggleHeaderVisibility());
    if(this.tripleClickCounter==3) this.toggleFullScreen();
    this.tripleClickTimer = setTimeout(() => {this.tripleClickCounter = 0}, 250);
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
  }

  pdf_viewer_error(event: any) {
    console.log('pdf_viewer_error', event);
    this.store.dispatch(setPdfLoadStatus({status: 'PDF Load Error!'}))
    this.pdf.loaded = false;
  }

  pdf_viewer_after_load_complete(event: any) {
    this.store.dispatch(setPdfLoadStatus({status: null}))
    this.pdf.loaded = true;
    if (this.sessId) {
      const session = PdfStorageUtils.getSessionFromStorage(this.sessId);
      setTimeout(() => {
        if (this.pdf.src == session.url && parseInt(session.page) > 0) {
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
