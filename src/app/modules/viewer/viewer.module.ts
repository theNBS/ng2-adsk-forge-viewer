import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './viewer.component';
import { ScriptService } from './services/script.service';
import { BasicExtension } from './extensions';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ViewerComponent,
  ],
  exports: [
    ViewerComponent,
  ],
  providers: [
    ScriptService,
  ],
})
export class ViewerModule { }
