import { Component } from '@angular/core';
import {
  DocumentChangedEvent, ViewerOptions,
  ViewingApplicationInitializedEvent,
} from './modules/viewer/viewer.component';

@Component({
  selector: 'app-viewer-container',
  templateUrl: './viewer-container.component.html',
  styleUrls: ['./viewer-container.component.scss'],
})
export class ViewerContainerComponent {

  public viewerOptions: ViewerOptions;
  public documentId: string;

  setViewerOptions() {
    this.viewerOptions = {
      initializerOptions: {
        env: 'AutodeskProduction',
        getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
          const accessToken = '<TOKEN_GOES_HERE>';
          const expireTimeSeconds = 60 * 30;
          onGetAccessToken(accessToken, expireTimeSeconds);
        },
      },
      // showFirstViewable: false,
      // headlessViewer: true,
    };
  }

  loadDocument(event: ViewingApplicationInitializedEvent) {
    event.viewerComponent.DocumentId = '<DOCUMENT_URN_GOES_HERE>';
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
}
