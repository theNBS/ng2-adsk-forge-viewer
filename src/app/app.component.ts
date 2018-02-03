import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';

  public viewerOptions: Autodesk.Viewing.ViewerOptions;
  public documentId: string;

  ngOnInit() {

  }

  viewerReady() {
    this.viewerOptions = {
      env: 'AutodeskProduction',
      getAccessToken: (onGetAccessToken) => {
        const accessToken = '<YOUR_APPLICATION_TOKEN>';
        const expireTimeSeconds = 60 * 30;
        onGetAccessToken(accessToken, expireTimeSeconds);
      },
    };
  }

  loadModel() {
    this.documentId = 'urn:<YOUR_URN_ID>';
  }
}
