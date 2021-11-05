import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { User } from '@models/UserModel';
import { authSelectors, fetchUserAttempted, logOutAttempted, menuButtonPressed } from '@modules/auth/auth.reducer';
import { AuthService } from '@modules/auth/auth.service';
import { appSelectors } from 'src/app/app.reducer';
import { pdfSelectors } from '@modules/pdf/pdf.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = 'pdf-mobile-integration';
  user: User|null = null;
  application_mode: boolean = false;
  headerVisibility = true;
  testcounter: number = 0;
  pdfLoadStatus: string|null = null;

  constructor(
    private store: Store,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.store.select(appSelectors.selectSessionId)
    .subscribe((id) => {
      console.log(id + 'ID');
      if(!!id) {
        let session = JSON.parse(localStorage.getItem('appSession-' + id) || '{}');
        let c = Number(session['counter'] || 0)

        this.testcounter = c++;
        session['counter'] = c;

        localStorage.setItem('appSession-' + id, JSON.stringify(session));
      }
    })

    this.activeRoute.queryParams.subscribe((qp) => {
      this.application_mode = !!qp.application;
    });
    this.initStore();
    (window as any)['HeaderComponent'] = this;
  }

  private initStore() {
    this.store.dispatch(fetchUserAttempted());
    this.store.select(authSelectors.selectUser).subscribe(user => {this.user = user})
    this.store.select(authSelectors.selectHeaderVisibility).subscribe(status => {this.headerVisibility = status})
    this.store.select(pdfSelectors.selectPdfLoadstatus).subscribe(status => this.pdfLoadStatus = status);
  }

  onMenuButtonPressed() {
    this.store.dispatch(menuButtonPressed());
  }

  async login() {
    this.store.dispatch(fetchUserAttempted());
    const userStatus = (await this.authService.auth().toPromise()).is_authenticated;
    if (!userStatus) { // user not logged in
      window.open('/api/auth/login');
    }
  }

  logout() {
    this.store.dispatch(logOutAttempted());
  }

}
