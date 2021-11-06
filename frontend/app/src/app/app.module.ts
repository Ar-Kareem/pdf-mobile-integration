import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appFeatureKey, appReducer } from './app.reducer';
import { AuthService } from '@modules/auth/auth.service';
import { PdfService } from '@modules/pdf/pdf.service';
import { authFeatureKey, authReducer } from '@modules/auth/auth.reducer';
import { AuthEffects } from '@modules/auth/auth.effects';
import { PdfComponent } from '@modules/pdf/pdf.component';
import { HeaderComponent } from '@modules/header/header.component';
import { PdfSidebarComponent } from './modules/pdf/pdf-sidebar/pdf-sidebar.component';
import { FormsModule } from '@angular/forms';
import { pdfFeatureKey, pdfReducer } from '@modules/pdf/pdf.reducer';
import { HttpErrorInterceptor } from '@services/HttpErrorInterceptor';
import { PdfEffects } from '@modules/pdf/pdf.effects';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PdfPanelMenuComponent } from './modules/pdf/pdf-panel-menu/pdf-panel-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    PdfComponent,
    HeaderComponent,
    PdfSidebarComponent,
    PdfPanelMenuComponent,
  ],
  imports: [
    StoreModule.forRoot({ 
      [appFeatureKey]: appReducer,
      [authFeatureKey]: authReducer,
      [pdfFeatureKey]: pdfReducer,
    }),
    EffectsModule.forRoot([
      AuthEffects,
      PdfEffects,
    ]),
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule, // required to make sidebar work
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    SidebarModule,
    PanelMenuModule,
    PdfViewerModule,
  ],
  providers: [
    AuthService,
    PdfService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor, 
      multi: true 
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
