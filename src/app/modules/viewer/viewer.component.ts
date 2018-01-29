import {AfterViewInit, Component, OnInit} from '@angular/core';
import { ScriptService } from './script.service';

@Component({
  selector: 'adsk-forge-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: [
    './viewer.component.scss',
  ],
})
export class ViewerComponent implements OnInit {
  private viewerApp: Autodesk.Viewing.ViewingApplication;

  constructor(private script: ScriptService) {

  }

  ngOnInit() {
    this.loadScripts();
  }

  private loadScripts() {
    this.script.load(
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/three.min.js',
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.min.js'
    )
      .then((data) => {
        console.log('script loaded ', data);
        this.initialiseViewer();
      })
      .catch(error => console.log(error));
  }

  private initialiseViewer() {
    const options: Autodesk.Viewing.ViewerOptions = {
      env: 'AutodeskProduction',
      getAccessToken: (onGetAccessToken) => {
        //
        // TODO: Replace static access token string below with call to fetch new token from your backend
        // Both values are provided by Forge's Authentication (OAuth) API.
        //
        // Example Forge's Authentication (OAuth) API return value:
        // {
        //    "access_token": "<YOUR_APPLICATION_TOKEN>",
        //    "token_type": "Bearer",
        //    "expires_in": 86400
        // }
        //
        const accessToken = '<YOUR_APPLICATION_TOKEN>';
        const expireTimeSeconds = 60 * 30;
        onGetAccessToken(accessToken, expireTimeSeconds);
      },
    };

    const documentId = 'urn:<YOUR_URN_ID>';
    Autodesk.Viewing.Initializer(options, () => {
      this.viewerApp = new Autodesk.Viewing.ViewingApplication('MyViewerDiv');
      this.viewerApp.registerViewer(this.viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D);
      this.viewerApp.loadDocument(documentId, this.onDocumentLoadSuccess, this.onDocumentLoadFailure);
    });
  }

  private onDocumentLoadSuccess(doc) {
      // We could still make use of Document.getSubItemsWithProperties()
      // However, when using a ViewingApplication, we have access to the **bubble** attribute,
      // which references the root node of a graph that wraps each object from the Manifest JSON.
      const viewables = this.viewerApp.bubble.search({ type: 'geometry' });
      if (viewables.length === 0) {
          console.error('Document contains no viewables.');
          return;
      }

      // Choose any of the avialble viewables
      this.viewerApp.selectItem(viewables[0].data, this.onItemLoadSuccess, this.onItemLoadFail);
  }

  private onDocumentLoadFailure(viewerErrorCode) {
      console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
  }

  private onItemLoadSuccess(viewer, item) {
      console.log('onItemLoadSuccess()!');
      console.log(viewer);
      console.log(item);

      // Congratulations! The viewer is now ready to be used.
      console.log('Viewers are equal: ' + (viewer === this.viewerApp.getCurrentViewer()));
  }

  private onItemLoadFail(errorCode) {
      console.error('onItemLoadFail() - errorCode:' + errorCode);
  }
}
