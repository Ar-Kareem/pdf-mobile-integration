import { Component, OnInit } from '@angular/core';
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
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.auth().subscribe(x => {
      this.auth_return = x.resp + ''
      if (!!x?.resp) {
        this.user_logged_in = true;
      } else {
        this.user_logged_in = false
      }
    })
  }

  async login() {
    const userStatus = (await this.authService.auth().toPromise()).resp
    if (userStatus) { // already logged in
      this.user_logged_in = userStatus
    } else { // not logged in
      window.open('/api/auth/login');
    }
  }

  async logout() {
    const logout = await this.authService.logout().toPromise()
    window.location.reload() // refresh page
  }
}
