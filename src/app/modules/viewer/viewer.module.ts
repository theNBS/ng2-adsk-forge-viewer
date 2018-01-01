import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './viewer.component';

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
})
export class ViewerModule { }
