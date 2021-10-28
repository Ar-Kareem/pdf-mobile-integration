import { Component, OnInit } from '@angular/core';
import { authActions } from '@modules/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pdf-mobile-integration';
  auth_return: string | undefined;
  user_logged_in: boolean = false;

  constructor(
    private store: Store,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    (window as any)['AppComponent'] = this;
    (window as any)['authActions'] = authActions;
    this.authService.auth().subscribe(x => {
      this.auth_return = x.is_authenticated + ''
      console.log(this.auth_return);
      
      if (!!x?.is_authenticated) {
        this.user_logged_in = true;
      } else {
        this.user_logged_in = false
      }
    })
  }

  async login() {
    const userStatus = (await this.authService.auth().toPromise()).is_authenticated
    if (userStatus) { // already logged in
      this.user_logged_in = false
    } else { // not logged in
      window.open('/api/auth/login');
    }
  }

  async logout() {
    const logout = await this.authService.logout().toPromise()
    window.location.reload() // refresh page
  }
}
