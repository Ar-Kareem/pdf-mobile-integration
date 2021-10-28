import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { authActions, authSelectors } from '@modules/auth/auth.reducer';
import { AuthService } from '@services/auth.service';
import { User } from '@models/UserModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pdf-mobile-integration';
  user: User|null = null;

  constructor(
    private store: Store,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.initStore();
    (window as any)['AppComponent'] = this;
    (window as any)['authActions'] = authActions;
  }

  private initStore() {
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
