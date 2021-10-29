import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private pdfService: PdfService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    (window as any)['PdfComponent'] = this
  }

  async download() {
    const result = await this.pdfService.download('https://arxiv.org/pdf/1905.11397.pdf').toPromise()
    console.log(result);
  }

  async last_saved() {
    const result = await this.pdfService.last_saved().toPromise()
    this.pdf.src = result.last_saved_pdf
    this.pdf.available = true;
    this.changeDetectorRef.detectChanges();
    console.log(result);
  }

}
