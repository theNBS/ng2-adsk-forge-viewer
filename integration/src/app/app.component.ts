import { Component } from '@angular/core';
import { ScriptService } from 'ng2-adsk-forge-viewer';

@Component({
  selector: 'integration-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  private scriptService: ScriptService;

  constructor(scriptService: ScriptService) {
    this.scriptService.load();
  }
}
