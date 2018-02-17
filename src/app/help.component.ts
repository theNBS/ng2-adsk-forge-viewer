import { Component } from '@angular/core';
import {
  DocumentChangedEvent, ViewerOptions,
  ViewingApplicationInitializedEvent,
} from './modules/viewer/viewer.component';
import { ACCESS_TOKEN, DOCUMENT_URN } from './viewer-container.component';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
})
export class HelpComponent {
  public showThreeD: boolean = true;
  public viewerOptions: ViewerOptions;
  public disableButtons: boolean = true;

  threeD() {
    this.disableButtons = true;
    this.showThreeD = true;
  }

  twoD() {
    this.disableButtons = true;
    this.showThreeD = false;
  }

  setViewerOptions() {
    this.viewerOptions = {
      initializerOptions: {
        env: 'AutodeskProduction',
        getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
          const expireTimeSeconds = 60 * 30;
          onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
        },
      },
      viewerConfig: {
        theme: 'light-theme',
      },
      showFirstViewable: false,
      // headlessViewer: true,
    };
  }

  loadDocument(event: ViewingApplicationInitializedEvent) {
    event.viewerComponent.DocumentId = DOCUMENT_URN;
  }

  documentChanged(event: DocumentChangedEvent) {
    const viewerApp = event.viewingApplication;
    if (!viewerApp.bubble) return;

    if (this.showThreeD) {
      const viewables = viewerApp.bubble.search(Autodesk.Viewing.BubbleNode.MODEL_NODE);

      if (viewables && viewables.length > 0) {
        event.viewerComponent.selectItem(viewables[0].data);
        // viewerApp.selectItem(viewables[0].data, undefined, undefined);
      }
    } else {
      const viewables = viewerApp.bubble.search(Autodesk.Viewing.BubbleNode.MODEL_NODE);

      if (viewables && viewables.length > 0) {
        event.viewerComponent.selectItem(viewables[0].data);
        // viewerApp.selectItem(viewables[0].data, undefined, undefined);
      }
    }
  }

  viewerFinished() {
    this.disableButtons = false;
  }
}
