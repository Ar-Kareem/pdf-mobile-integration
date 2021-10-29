import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { authActions, authSelectors } from '@modules/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { getDefaultApplicationManifest, setGlobalApplicationManifest } from 'src/app/app.manifest';
import { PdfService } from './pdf.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

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
  }

  private initStore() {
    this.store.select(authSelectors.selectHeaderVisibility).subscribe(status => {this.toolbarOpen = status})
  }

  onClickPdfViewer(event: MouseEvent) {
    if (event.detail % 3 == 0) {
      this.store.dispatch(authActions.toggleHeaderVisibility());
    }
  }

  private setupManifest() {
    const manifestJSON = getDefaultApplicationManifest();
    manifestJSON['background_color'] = '#888888'
    manifestJSON['theme_color'] = '#888888'
    setGlobalApplicationManifest(manifestJSON)
  }


  private async download() {
    const result = await this.pdfService.download('https://arxiv.org/pdf/1905.11397.pdf').toPromise()
    console.log(result);
  }

  private async last_saved() {
    const result = await this.pdfService.last_saved().toPromise()
    this.pdf.src = result.last_saved_pdf
    this.pdf.available = true;
    this.changeDetectorRef.detectChanges();
    console.log(result);
  }

}
