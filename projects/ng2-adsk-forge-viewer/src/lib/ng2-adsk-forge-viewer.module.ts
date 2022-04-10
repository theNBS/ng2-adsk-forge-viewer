import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ViewerComponent } from './component/viewer.component';
import { ThumbnailComponent } from './component/thumbnail.component';

@NgModule({
  declarations: [ViewerComponent, ThumbnailComponent],
  imports: [HttpClientModule],
  exports: [ViewerComponent, ThumbnailComponent],
  providers: [],
})
export class ViewerModule { }
