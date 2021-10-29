import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from '@modules/auth/auth.service';
import { PdfService } from '@modules/pdf/pdf.service';
import { authFeatureKey, authReducer } from '@modules/auth/auth.reducer';
import { AuthEffects } from '@modules/auth/auth.effects';
import { PdfComponent } from '@modules/pdf/pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    PdfComponent
  ],
  imports: [
    StoreModule.forRoot({ 
      [authFeatureKey]: authReducer, 
    }),
    EffectsModule.forRoot([
      AuthEffects, 
    ]),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    PdfViewerModule,
  ],
  providers: [
    AuthService,
    PdfService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
