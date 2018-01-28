import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './viewer.component';
import { ScriptService } from './script.service';

@NgModule({
  imports: [
    CommonModule
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
