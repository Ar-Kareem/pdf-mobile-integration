import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { User } from '@models/UserModel';
import { authActions, authSelectors } from '@modules/auth/auth.reducer';
import { AuthService } from '@modules/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = 'pdf-mobile-integration';
  user: User|null = null;
  application_mode: boolean = false;

  constructor(
    private store: Store,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((qp) => {
      this.application_mode = !!qp.application;
    });
    this.initStore();
    (window as any)['HeaderComponent'] = this;
    (window as any)['authActions'] = authActions;
  }

  private initStore() {
    this.store.dispatch(authActions.fetchUserAttempted());
    this.store.select(authSelectors.selectUser).subscribe(user => {this.user = user})
  }

  async login() {
    this.store.dispatch(authActions.fetchUserAttempted());
    const userStatus = (await this.authService.auth().toPromise()).is_authenticated;
    if (!userStatus) { // user not logged in
      window.open('/api/auth/login');
    }
  }

  logout() {
    this.store.dispatch(authActions.logOutAttempted());
  }

}
