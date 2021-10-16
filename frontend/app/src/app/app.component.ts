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

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.auth().subscribe(x => {
      console.log(x)
      if (!!x) {
        this.auth_return = x.resp
      }
    })
  }
}
