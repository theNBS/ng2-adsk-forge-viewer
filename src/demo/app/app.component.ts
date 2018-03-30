import { Component } from '@angular/core';
import { ViewerOptions, ViewingApplicationInitializedEvent, DocumentChangedEvent } from 'ng2-adsk-forge-viewer';

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJuVFh0TGhXdUg5YzVtNmpValVEZTF6SmxGcGpSaE96YyIsImV4cCI6MTUyMjQzNzg5MCwic2NvcGUiOlsiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiZGF0YTp3cml0ZSIsImRhdGE6cmVhZCIsImJ1Y2tldDpkZWxldGUiXSwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2p3dGV4cDYwIiwianRpIjoiOFJFb05qZ2JlNXNkTDJWcFA1a0hBeVhhSEQxNGJWTmFHSHdKN0lMYkI4NEM3a2Y4ZWJCMkJCWnF2Sk1JU1NIQSJ9.2C1fbGA6ydid4AO4g1j8UoZVzQKemhP-bnjhbPYYHms';
const DOCUMENT_URN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dG9vbGtpdC9BMTY4MThBMDMxNTYyM0M5MEY2QUVGQkNENjdDRDRFQi5ydnQ';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public viewerOptions: ViewerOptions;
  public documentId: string;

  setViewerOptions() {
    this.viewerOptions = {
      initializerOptions: {
        env: 'AutodeskProduction',
        getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
          const expireTimeSeconds = 60 * 30;
          onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
        },
      },
      // showFirstViewable: false,
      // headlessViewer: true,
    };
  }

  loadDocument(event: ViewingApplicationInitializedEvent) {
    event.viewerComponent.DocumentId = DOCUMENT_URN;
  }

  documentChanged(event: DocumentChangedEvent) {
    // const viewerApp = event.viewingApplication;
    // const viewables = viewerApp.bubble.search({ type: 'geometry' });
    //
    // if (viewables && viewables.length > 0) {
    //   event.viewerComponent.selectItem(viewables[0].data);
    //   // viewerApp.selectItem(viewables[0].data, undefined, undefined);
    // }
  }

  selectionChanged(event: Autodesk.Viewing.SelectionChangedEventArgs) {
    console.log(event);
  }
}
