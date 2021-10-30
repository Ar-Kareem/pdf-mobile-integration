import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getDefaultApplicationManifest, setGlobalApplicationManifest } from './app.manifest';
import { appActions, appSelectors } from './app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.setupManifest();
    (window as any)['AppComponent'] = this;
    this.activatedRoute.queryParams.subscribe(params => {
      if(!!params.session) {
        this.store.dispatch(appActions.setAppSession({sessionId: params.session}))
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
