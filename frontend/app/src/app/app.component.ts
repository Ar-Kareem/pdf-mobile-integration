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
      console.log(x)
      if (!!x) {
        this.auth_return = x.resp
      }
      if (!!x?.resp) {
        this.user_logged_in = true;
      } else {
        this.user_logged_in = false
      }
    })
  }
}
