import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { FilterPipe } from './filter.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import localeEsAr from '@angular/common/locales/es-AR';

import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsAr, 'es-Ar')






@NgModule({
  declarations: [AppComponent, SpinnerComponent],
  imports: [BrowserModule , IonicModule.forRoot(), AppRoutingModule, HttpClientModule, BrowserAnimationsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy } , 
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-Ar'
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
