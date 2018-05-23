import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ImageModule } from './components/image/image.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageListComponent } from './components/image/image-list/image-list.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LxdLogoComponent } from './components/shared/lxd-logo/lxd-logo.component';
import { SocketIoModule } from 'ng-socket-io';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    LxdLogoComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    ImageModule,
    AppRoutingModule,
    SocketIoModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.DEBUG,
      serverLoggingUrl: environment.loggingUrl
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
