import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from '@services/auth.service';
import { authFeatureKey, authReducer } from '@modules/auth/auth.reducer';
import { AuthEffects } from '@modules/auth/auth.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ [authFeatureKey]: authReducer, }),
    EffectsModule.forRoot([AuthEffects, ]),
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
