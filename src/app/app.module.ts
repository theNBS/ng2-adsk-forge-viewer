import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ViewerModule } from './modules/viewer/viewer.module';
import { ViewerContainerComponent } from './viewer-container.component';
import { HelpComponent } from './help.component';


const appRoutes: Routes = [
  { path: 'viewer', component: ViewerContainerComponent },
  { path: 'help', component: HelpComponent },
  { path: '', redirectTo: '/viewer', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    ViewerContainerComponent,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
    ViewerModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }, // <-- debugging purposes only
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
