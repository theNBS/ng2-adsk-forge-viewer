import { Component, OnInit } from '@angular/core';
import {
  ViewerOptions,
  ViewingApplicationInitializedEvent,
  DocumentChangedEvent,
  SelectionChangedEventArgs,
  ThumbnailOptions,
  Extension,
} from 'ng2-adsk-forge-viewer';

import { TestExtension } from './test-extension';
import { ACCESS_TOKEN, DOCUMENT_URN } from './config';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public viewerOptions3d: ViewerOptions;
  public viewerOptions2d: ViewerOptions;
  public thumbnailOptions: ThumbnailOptions;
  public documentId: string;
  public view: number = 1;

  public ngOnInit() {
    this.thumbnailOptions = {
      getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
        const expireTimeSeconds = 60 * 30;
        onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
      },
      documentId: DOCUMENT_URN,
      width: 400,
      height: 400,
      // defaultImageSrc: '',
    };

    this.viewerOptions3d = {
      initializerOptions: {
        env: 'AutodeskProduction',
        getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
          const expireTimeSeconds = 60 * 30;
          onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
        },
      },
      viewerConfig: {
        extensions: [TestExtension.extensionName],
      },
      onViewerScriptsLoaded: this.scriptsLoaded,
      onViewingApplicationInitialized: this.loadDocument,
      // showFirstViewable: false,
      // headlessViewer: true,
    };

    this.viewerOptions2d = Object.assign({}, this.viewerOptions3d, { showFirstViewable: false });
  }

  public scriptsLoaded() {
    Extension.registerExtension(TestExtension.extensionName, TestExtension);
  }

  public loadDocument(args: ViewingApplicationInitializedEvent) {
    args.viewerComponent.DocumentId = DOCUMENT_URN;
  }

  public documentChanged(event: DocumentChangedEvent) {
    const viewerApp = event.viewingApplication;
    if (!viewerApp.bubble) return;
    const viewables = viewerApp.bubble.search({ type: 'geometry', role: '2d' });

    if (viewables && viewables.length > 0) {
      event.viewerComponent.selectItem(viewables[0].data);
    }
  }

  public selectionChanged(event: SelectionChangedEventArgs) {
    console.log(event);
  }
}
