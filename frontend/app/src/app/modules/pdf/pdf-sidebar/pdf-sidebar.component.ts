import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PdfService } from '@modules/pdf/pdf.service';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { PanelMenu, PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

import { menuButtonPressed, selectAuthState } from '@modules/auth/auth.reducer';
import { downloadPdfAttempted, downloadPdfSuccess, loadPdfFromUrl, selectPdfRequestId, setActiveReqId } from '@modules/pdf/pdf.reducer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pdf-sidebar',
  templateUrl: './pdf-sidebar.component.html',
  styleUrls: ['./pdf-sidebar.component.scss']
})
export class PdfSidebarComponent implements OnInit, AfterViewInit {

  @ViewChild('panelMenu') panelMenu: PanelMenu|undefined;

  display: boolean = true; // ngModel
  pdfUrlLoad: string = ''; // ngModel
  pdfUrlDownload: string = ''; // ngModel
  pdfName: string = ''; // ngModel

  selectedPdfReqId: string|null = null;

  items = [
    {
        label: 'File',
        icon: 'pi pi-pw pi-file',
        items: [{
                label: 'New', 
                icon: 'pi pi-fw pi-plus',
                items: [
                    {label: 'User', icon: 'pi pi-fw pi-user-plus'},
                    {label: 'Filter', icon: 'pi pi-fw pi-filter'}
                ]
            },
            {label: 'Open', icon: 'pi pi-fw pi-external-link'},
            {separator: true},
            {label: 'Quit', icon: 'pi pi-fw pi-times'}
        ]
    },
    {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
            {label: 'Delete', icon: 'pi pi-fw pi-trash'},
            {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
        ]
    },
    {
        label: 'Help',
        icon: 'pi pi-fw pi-question',
        items: [
            {
                label: 'Contents',
                icon: 'pi pi-pi pi-bars'
            },
            {
                label: 'Search', 
                icon: 'pi pi-pi pi-search', 
                items: [
                    {
                        label: 'Text', 
                        items: [
                            {
                                label: 'Workspace'
                            }
                        ]
                    },
                    {
                        label: 'User',
                        icon: 'pi pi-fw pi-file',
                    }
            ]}
        ]
    },
    {
        label: 'Actions',
        icon: 'pi pi-fw pi-cog',
        items: [
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {label: 'Save', icon: 'pi pi-fw pi-save'},
                    {label: 'Update', icon: 'pi pi-fw pi-save'},
                ]
            },
            {
                label: 'Other',
                icon: 'pi pi-fw pi-tags',
                items: [
                    {label: 'Delete', icon: 'pi pi-fw pi-minus'}
                ]
            }
        ]
    }
  ];

  constructor(
    private store: Store,
    private actions$: Actions,
    private pdfService: PdfService,
  ) {
    if (!environment.production) {
      (window as any)['PdfSidebarComponent'] = this;
    }
  }

  ngOnInit(): void {
    this.initStore();
    this.getProgress();
  }

  ngAfterViewInit(): void {
    if (this.panelMenu) {
      this.panelMenu.multiple = false;
    }
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
      if (!!req) {
        this.selectedPdfReqId = req;
      }
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
