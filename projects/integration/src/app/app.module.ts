import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ViewerModule } from 'ng2-adsk-forge-viewer';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
