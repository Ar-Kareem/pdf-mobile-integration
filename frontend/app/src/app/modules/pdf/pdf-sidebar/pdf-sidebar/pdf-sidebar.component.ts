import { Component, OnInit } from '@angular/core';
import { authActions, authSelectors } from '@modules/auth/auth.reducer';
import { pdfActions } from '@modules/pdf/pdf.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pdf-sidebar',
  templateUrl: './pdf-sidebar.component.html',
  styleUrls: ['./pdf-sidebar.component.scss']
})
export class PdfSidebarComponent implements OnInit {
  display: boolean = true;
  pdfUrl: string = '';

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.initStore();
  }

  private initStore() {
    this.store.select(authSelectors.selectAuthState)
    .pipe(filter(state => state.action == authActions.menuButtonPressed.type))
    .subscribe(_ => this.display = !this.display)
  }

  onLoadPdfUrl() {
    this.store.dispatch(pdfActions.loadPdfFromUrl({url: this.pdfUrl}));
  }

}
