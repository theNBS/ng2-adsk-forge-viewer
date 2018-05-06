import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ViewerModule } from 'ng2-adsk-forge-viewer';

import { AppComponent }  from './app.component';

@NgModule({
  imports: [BrowserModule, ViewerModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
