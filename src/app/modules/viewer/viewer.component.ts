import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ScriptService } from './services/script.service';

declare const require;

export interface DocumentChangedEvent {
  document: Autodesk.Viewing.Document;
  viewingApplication: Autodesk.Viewing.ViewingApplication;
}

export interface ItemLoadedEvent {
  item: Autodesk.Viewing.ViewerItem;
  viewingApplication: Autodesk.Viewing.ViewingApplication;
  currentViewer: Autodesk.Viewing.Viewer3D;
}

export interface ViewerOptions {
  initializerOptions: Autodesk.Viewing.InitializerOptions;
  viewerApplicationOptions?: Autodesk.Viewing.ViewingApplicationOptions;
  viewerConfig?: Autodesk.Viewing.ViewerConfig;
}

@Component({
  selector: 'adsk-forge-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: [
    './viewer.component.scss',
  ],
})
export class ViewerComponent implements OnInit, OnChanges {
  readonly containerId = 'ng2-adsk-forge-viewer-container';

  @Input() public documentId: string;
  @Input() public viewerOptions: ViewerOptions;

  @Output() public onViewerScriptsLoaded = new EventEmitter<boolean>();
  @Output() public onViewingApplicationInitialized = new EventEmitter<boolean>();
  @Output() public onDocumentChanged = new EventEmitter<DocumentChangedEvent>();
  @Output() public onItemLoaded = new EventEmitter<ItemLoadedEvent>();
  @Output() public onError = new EventEmitter<Autodesk.Viewing.ErrorCodes>();

  private viewerInitialized = false;
  private viewerApp: Autodesk.Viewing.ViewingApplication;

  /**
   * Helper to allow callers to specify documentId with or without the required urn: prefix
   * @param {string} documentId
   * @returns {string}
   */
  private static verifyUrn(documentId: string): string {
    return (documentId.startsWith('urn:')) ? documentId : `urn:${documentId}`;
  }

  constructor(private script: ScriptService) {
    this.loadScripts();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentId && changes.documentId.currentValue) {
      this.loadDocument(changes.documentId.currentValue);
    }

    if (!this.viewerInitialized && changes.viewerOptions && changes.viewerOptions.currentValue) {
      this.initialiseApplication();
    }
  }

  /**
   * Helper method to get some default viewer options
   * @param {(cb: Function) => void} getAccessToken
   * @returns {ViewerOptions}
   */
  getDefaultViewerOptions(getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => void)
  : ViewerOptions {
    return {
      initializerOptions: {
        env: 'AutodeskProduction',
        getAccessToken,
      },
    };
  }

  /**
   * Get a reference to the current viewing application
   * @returns {Autodesk.Viewing.ViewingApplication}
   * @constructor
   */
  public get ViewerApplication() {
    return this.viewerApp;
  }

  /**
   * Get a reference to the current 3D viewer
   * @returns {Autodesk.Viewing.Viewer3D}
   * @constructor
   */
  public get Viewer3D() {
    return this.viewerApp.getCurrentViewer();
  }

  /**
   * We don't bundle Autodesk's scripts with the component, and we don't really want users to have
   * to add the scripts to their index.html pages. So we'll load them when required.
   */
  private loadScripts() {
    this.script.load(
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/three.min.js?v=3.3.*',
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.min.js?v=3.3.*',
    )
      .then((data) => {
        console.log('script loaded ', data);
        this.onViewerScriptsLoaded.emit(true);
      })
      .catch(error => console.log(error));
  }

  /**
   * Initialises a ViewingApplication
   */
  private initialiseApplication() {
    Autodesk.Viewing.Initializer(this.viewerOptions.initializerOptions, () => {
      this.viewerApp = new Autodesk.Viewing.ViewingApplication(this.containerId,
                                                               this.viewerOptions.viewerApplicationOptions);

      // Register a basic extension that will help us report events. This is a bit tricky
      // as we've lazy loaded the Autodesk scripts; if we use `import` instead of
      // `require`, the Autodesk namespace won't be found
      const exts = require('./extensions'); //tslint:disable-line
      exts.BasicExtension.registerExtension();

      const config: Autodesk.Viewing.ViewerConfig = Object.assign(
        {},
        this.viewerOptions.viewerConfig,
        { extensions: [] },
      );

      // We will always load our basic extension with any others specified by the caller
      if (this.viewerOptions.viewerConfig && this.viewerOptions.viewerConfig.extensions) {
        config.extensions = [...this.viewerOptions.viewerConfig.extensions, exts.BasicExtension.extensionName];
      } else {
        config.extensions = [exts.BasicExtension.extensionName];
      }

      // Register a viewer with the application (passign through any additional config)
      this.viewerApp.registerViewer(this.viewerApp.k3D,
                                    Autodesk.Viewing.Private.GuiViewer3D,
                                    config);

      // Viewer is ready - scripts are loaded and we've create a new viewing application
      this.viewerInitialized = true;
      this.onViewingApplicationInitialized.emit(true);
    });
  }

  /**
   * Loads a model in to the viewer via it's urn
   * @param {string} documentId
   */
  private loadDocument(documentId: string) {
    if (!documentId) return;

    // Add urn: to the beginning of document id if needed
    this.viewerApp.loadDocument(ViewerComponent.verifyUrn(documentId),
                                this.onDocumentLoadSuccess.bind(this),
                                this.onDocumentLoadFailure.bind(this));
  }

  /**
   * Document successfully loaded
   * @param {Autodesk.Viewing.Document} document
   */
  private onDocumentLoadSuccess(document: Autodesk.Viewing.Document) {
    // Emit an event so the caller can do something
    // TODO: config option to specify which viewable to display (how?)
    this.onDocumentChanged.emit({ document, viewingApplication: this.viewerApp });

    // This will be the default behaviour -- show the first viewable
    // We could still make use of Document.getSubItemsWithProperties()
    // However, when using a ViewingApplication, we have access to the **bubble** attribute,
    // which references the root node of a graph that wraps each object from the Manifest JSON.
    const viewables = this.viewerApp.bubble.search({ type: 'geometry' });

    if (viewables && viewables.length > 0) {
      this.viewerApp.selectItem(viewables[0].data, this.onItemLoadSuccess.bind(this), this.onItemLoadFail.bind(this));
    }
  }

  /**
   * Failed to load document
   * @param {Autodesk.Viewing.ErrorCodes} errorCode
   */
  private onDocumentLoadFailure(errorCode: Autodesk.Viewing.ErrorCodes) {
    console.error('onDocumentLoadFailure() - errorCode:' + errorCode);
    this.onError.emit(errorCode);
  }

  /**
   * View from the document was successfully loaded
   * @param {Autodesk.Viewing.Viewer3D} viewer
   * @param {Autodesk.Viewing.ViewerItem} item
   */
  private onItemLoadSuccess(viewer: Autodesk.Viewing.Viewer3D, item: Autodesk.Viewing.ViewerItem) {
    console.log('onItemLoadSuccess()', viewer, item);
    console.log('Viewers are equal: ' + (viewer === this.viewerApp.getCurrentViewer()));

    this.onItemLoaded.emit({ item, currentViewer: viewer, viewingApplication: this.viewerApp });
  }

  /**
   * Failed to load a view from the document
   * @param {Autodesk.Viewing.ErrorCodes} errorCode
   */
  private onItemLoadFail(errorCode: Autodesk.Viewing.ErrorCodes) {
    console.error('onItemLoadFail() - errorCode:' + errorCode);
    this.onError.emit(errorCode);
  }
}
