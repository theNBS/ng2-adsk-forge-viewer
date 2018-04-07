import { Component } from '@angular/core';
import {
  ViewerOptions,
  ViewingApplicationInitializedEvent,
  DocumentChangedEvent,
  SelectionChangedEventArgs,
} from 'ng2-adsk-forge-viewer';

import { ACCESS_TOKEN, DOCUMENT_URN } from './config';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public viewerOptions3d: ViewerOptions;
  public viewerOptions2d: ViewerOptions;
  public documentId: string;
  public threeD: boolean = true;

  setViewerOptions() {
    this.viewerOptions3d = {
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

    this.viewerOptions2d = Object.assign({}, this.viewerOptions3d, { showFirstViewable: false });
  }

  loadDocument(event: ViewingApplicationInitializedEvent) {
    event.viewerComponent.DocumentId = DOCUMENT_URN;
  }

  documentChanged(event: DocumentChangedEvent) {
    const viewerApp = event.viewingApplication;
    if (!viewerApp.bubble) return;
    const viewables = viewerApp.bubble.search({ type: 'geometry', role: '2d' });

    if (viewables && viewables.length > 0) {
      event.viewerComponent.selectItem(viewables[0].data);
    }
  }

  selectionChanged(event: SelectionChangedEventArgs) {
    console.log(event);
  }
}
