import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ViewerComponent } from './component/viewer.component';
import { ThumbnailComponent } from './component/thumbnail.component';
import { ScriptService } from './service/script.service';


@NgModule({
  declarations: [ViewerComponent, ThumbnailComponent],
  imports: [HttpClientModule],
  exports: [ViewerComponent, ThumbnailComponent],
  providers: [ScriptService],
})
export class ViewerModule { }
