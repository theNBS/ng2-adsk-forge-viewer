import { Component, OnInit } from '@angular/core';
import { ScriptService } from './script.service';

@Component({
  selector: 'adsk-forge-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: [
    './viewer.component.scss',
  ],
})
export class ViewerComponent implements OnInit {

  constructor(private script: ScriptService) {
    this.script.load(
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/three.min.js',
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.min.js'
    )
      .then(data => console.log('script loaded ', data))
      .catch(error => console.log(error));
  }

  ngOnInit() {
  }

}
