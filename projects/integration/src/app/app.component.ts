import { Component, OnInit } from '@angular/core';

import {
  ViewerOptions,
  ViewerInitializedEvent,
  DocumentChangedEvent,
  SelectionChangedEventArgs,
  ThumbnailOptions,
  Extension,
} from 'ng2-adsk-forge-viewer';

import { TestExtension } from './test-extension';
import { ACCESS_TOKEN, DOCUMENT_URN, MULTIPLE_MODEL_URNS } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public viewerOptionsMultipleModels: ViewerOptions;
  public viewerOptionsAggregateView: ViewerOptions;
  public viewerOptions3d: ViewerOptions;
  public viewerOptions2d: ViewerOptions;
  public thumbnailOptions: ThumbnailOptions;
  public documentId!: string;
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
        api: 'derivativeV2',
      },
      viewerConfig: {
        extensions: [TestExtension.extensionName],
        theme: 'bim-theme',
      },
      onViewerScriptsLoaded: this.scriptsLoaded,
      onViewerInitialized: this.loadDocument,
      // showFirstViewable: false,
      // viewerType: 'Viewer3D' -- for headless viewer
    };

    this.viewerOptionsMultipleModels = {
      ...this.viewerOptions3d,
      onViewerScriptsLoaded: this.scriptsLoaded,
      onViewerInitialized: this.loadMultipleDocument,
      // showFirstViewable: false,
    };

    this.viewerOptionsAggregateView = {
      ...this.viewerOptionsMultipleModels,
      viewerType: 'AggregatedView',
    };

    this.viewerOptions2d = Object.assign({}, this.viewerOptions3d, { showFirstViewable: false });
  }

  public scriptsLoaded() {
    Extension.registerExtension(TestExtension.extensionName, TestExtension);
  }

  public loadDocument(args: ViewerInitializedEvent) {
    args.viewerComponent.DocumentId = DOCUMENT_URN;
  }
  public loadMultipleDocument(args: ViewerInitializedEvent) {
    args.viewerComponent.DocumentId = MULTIPLE_MODEL_URNS;
  }

  public documentChanged(event: DocumentChangedEvent) {
    const { document } = event;

    if (!document.getRoot()) return;

    const viewables = document.getRoot().search({ type: 'geometry', role: '2d' });
    if (viewables && viewables.length > 0) {
      void event.viewerComponent.loadDocumentNode(document, viewables[0]);
    }
  }

  public selectionChanged(event: SelectionChangedEventArgs) {
    console.log(event);
  }
}
