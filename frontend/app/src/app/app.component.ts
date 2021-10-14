import { Component, OnInit } from '@angular/core';
import { TrialService } from './services/trial.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pdf-mobile-integration';

  constructor(private trialService: TrialService) { }

  ngOnInit() {
    this.trialService.getConfig().subscribe(x=> console.log(x))
    this.trialService.getConfigApi().subscribe(x=> console.log(x))
  }
}
