import { Component } from '@angular/core';

import {
  ViewerOptions,
  ViewerInitializedEvent,
  DocumentChangedEvent,
  SelectionChangedEventArgs,
  ThumbnailOptions,
  Extension,
} from 'ng2-adsk-forge-viewer';

import { TestExtension } from './test-extension';
import { ACCESS_TOKEN, DOCUMENT_URN } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
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
        theme: 'bim-theme',
      },
      onViewerScriptsLoaded: this.scriptsLoaded,
      onViewerInitialized: this.loadDocument,
      // showFirstViewable: false,
      // headlessViewer: true,
    };

    this.viewerOptions2d = Object.assign({}, this.viewerOptions3d, { showFirstViewable: false });
  }

  public scriptsLoaded() {
    Extension.registerExtension(TestExtension.extensionName, TestExtension);
  }

  public loadDocument(args: ViewerInitializedEvent) {
    args.viewerComponent.DocumentId = DOCUMENT_URN;
  }

  public documentChanged(event: DocumentChangedEvent) {
    const { document } = event;

    if (!document.getRoot()) return;

    const viewables = document.getRoot().search({ type: 'geometry', role: '2d' });
    if (viewables && viewables.length > 0) {
      event.viewerComponent.loadDocumentNode(document, viewables[0]);
    }
  }

  public selectionChanged(event: SelectionChangedEventArgs) {
    console.log(event);
  }
}
