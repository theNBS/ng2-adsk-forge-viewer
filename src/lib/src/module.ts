import { NgModule } from '@angular/core';

import { ViewerComponent } from './component/viewer.component';
import { ScriptService } from './service/script.service';

@NgModule({
  declarations: [ViewerComponent],
  exports: [ViewerComponent],
  providers: [ScriptService],
})
export class ViewerModule { }
