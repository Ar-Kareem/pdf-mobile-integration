import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDefaultApplicationManifest, setGlobalApplicationManifest } from './app.manifest';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setupManifest();
    (window as any)['AppComponent'] = this;
    this.activatedRoute.queryParams.subscribe(params => {
      if (!!params.c) {
        const manifestJSON = getDefaultApplicationManifest();
        manifestJSON['background_color'] = '#' + params.c
        manifestJSON['theme_color'] = '#' + params.c
        setGlobalApplicationManifest(manifestJSON);
      }
    });
  }

  setupManifest() {
    const manifestJSON = getDefaultApplicationManifest();
    // manifestJSON['background_color'] = '#333333'
    // manifestJSON['theme_color'] = '#333333'
    setGlobalApplicationManifest(manifestJSON);
  }
}
