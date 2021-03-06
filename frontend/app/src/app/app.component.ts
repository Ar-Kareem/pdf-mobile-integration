import { Component, OnInit } from '@angular/core';
import { getDefaultApplicationManifest, setGlobalApplicationManifest } from './app.manifest';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
    this.setupManifest();
    (window as any)['AppComponent'] = this;
  }

  setupManifest() {
    const manifestJSON = getDefaultApplicationManifest();
    // manifestJSON['background_color'] = '#333333'
    // manifestJSON['theme_color'] = '#333333'
    setGlobalApplicationManifest(manifestJSON);
  }
}
