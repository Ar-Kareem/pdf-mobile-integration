import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { authActions, authSelectors } from '@modules/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getDefaultApplicationManifest, setGlobalApplicationManifest } from 'src/app/app.manifest';
import { pdfActions, pdfSelectors } from './pdf.reducer';
import { PdfService } from './pdf.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject<boolean>();

  pdf: {
    src: string,
    available: boolean
  } = {
    src: 'https://arxiv.org/pdf/1905.11397.pdf',
    available: true,
  }

  toolbarOpen = true;

  constructor(
    private store: Store,
    private pdfService: PdfService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    (window as any)['PdfComponent'] = this
    this.setupManifest();
    this.initStore();

    const sessionUrl = sessionStorage.getItem('pdfsrc')
    if (sessionUrl) {
      this.pdf.src = sessionUrl
      console.log('RESTORED', sessionUrl);
    }
  }

  private initStore() {
    this.store.select(authSelectors.selectHeaderVisibility)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(status => {
      this.toolbarOpen = status
    })
    
    this.store.select(pdfSelectors.selectLoadedPdfUrl)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(url => {
      if (url !== null) {
        this.pdf.src = url
        sessionStorage.setItem('pdfsrc', url);
      }
    })
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

  pdf_viewer_on_progress(event: any) {
    console.log('pdf_viewer_on_progress', event);
  }

  pdf_viewer_error(event: any) {
    console.log('pdf_viewer_error', event);
  }

  pdf_viewer_after_load_complete(event: any) {
    console.log('pdf_viewer_after_load_complete', event);
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
