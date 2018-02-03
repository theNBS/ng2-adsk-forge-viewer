import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ScriptService } from './script.service';
import * as nbsExt from './extensions/nbs-extension';

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
  @Input() public viewerOptions: Autodesk.Viewing.ViewerOptions;
  @Input() public viewerApplicationOptions: Autodesk.Viewing.ViewingApplicationOptions;
  @Input() public viewerConfig: Autodesk.Viewing.ViewerConfig;

  @Output() public onViewerReady = new EventEmitter<boolean>();
  @Output() public onViewingApplicationInitialized = new EventEmitter<boolean>();
  @Output() public onDocumentChanged = new EventEmitter<DocumentChangedEvent>();
  @Output() public onItemLoaded = new EventEmitter<ItemLoadedEvent>();
  @Output() public onError = new EventEmitter<Autodesk.Viewing.ErrorCodes>();

  private viewerInitialized = false;
  private viewerApp: Autodesk.Viewing.ViewingApplication;


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
   * @returns {Autodesk.Viewing.ViewerOptions}
   */
  getDefaultViewerOptions(getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => void)
  : Autodesk.Viewing.ViewerOptions {
    return {
      env: 'AutodeskProduction',
      getAccessToken,
    };
  }

  public get Viewer3D() {
    return this.viewerApp.getCurrentViewer();
  }

  private loadScripts() {
    this.script.load(
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/three.min.js',
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.min.js',
    )
      .then((data) => {
        console.log('script loaded ', data);
        this.onViewerReady.emit(true);
      })
      .catch(error => console.log(error));
  }

  private initialiseApplication() {
    Autodesk.Viewing.Initializer(this.viewerOptions, () => {
      this.viewerApp = new Autodesk.Viewing.ViewingApplication(this.containerId, this.viewerApplicationOptions);

      const exts = require('./extensions'); //tslint:disable-line
      exts.NbsExtension.registerExtension();

      // try to initialise an extension -- this is a bit tricky as we've lazy loaded the
      // Autodesk scripts; so we can't do an import or the Autodesk namespace won't be found
      const config: Autodesk.Viewing.ViewerConfig = Object.assign({}, this.viewerConfig, { extensions: [] });
      if (this.viewerConfig && this.viewerConfig.extensions) {
        config.extensions = [...this.viewerConfig.extensions, exts.NbsExtension.extensionName];
      } else {
        config.extensions = [exts.NbsExtension.extensionName];
      }

      debugger;
      this.viewerApp.registerViewer(this.viewerApp.k3D,
                                    Autodesk.Viewing.Private.GuiViewer3D,
                                    config);

      // Viewer is ready - scripts are loaded and we've create a new viewing application
      this.viewerInitialized = true;
      this.onViewingApplicationInitialized.emit(true);
    });
  }

  private registerViewer(viewerConfig: Autodesk.Viewing.ViewerConfig) {
    const exts = require('./extensions'); //tslint:disable-line
    const nbsEx = new exts.NbsExtension(this.viewerApp.getCurrentViewer(), {});
    nbsEx.registerExtension();

    // try to initialise an extension -- this is a bit tricky as we've lazy loaded the
    // Autodesk scripts; so we can't do an import or the Autodesk namespace won't be found
    const config: Autodesk.Viewing.ViewerConfig = Object.assign({}, viewerConfig, { extensions: [] });
    if (viewerConfig && viewerConfig.extensions) {
      config.extensions = [...viewerConfig.extensions, nbsEx.extensionName];
    } else {
      config.extensions = [nbsEx.extensionName];
    }

    this.viewerApp.registerViewer(this.viewerApp.k3D,
                                  Autodesk.Viewing.Private.GuiViewer3D,
                                  viewerConfig);
  }

  private loadDocument(documentId: string) {
    if (!documentId) return;

    // Add urn: to the beginning of document id if needed
    this.viewerApp.loadDocument((documentId.startsWith('urn:')) ? documentId : `urn:${documentId}`,
                                this.onDocumentLoadSuccess.bind(this),
                                this.onDocumentLoadFailure.bind(this));
  }

  private onDocumentLoadSuccess(document: Autodesk.Viewing.Document) {
    // Emit an event so the caller can do something
    // TODO: config option?
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

  private onDocumentLoadFailure(viewerErrorCode: Autodesk.Viewing.ErrorCodes) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
  }

  private onItemLoadSuccess(viewer: Autodesk.Viewing.Viewer3D, item: Autodesk.Viewing.ViewerItem) {
    debugger;

    console.log('onItemLoadSuccess()!');
    console.log(viewer);
    console.log(item);

    // Congratulations! The viewer is now ready to be used.
    console.log('Viewers are equal: ' + (viewer === this.viewerApp.getCurrentViewer()));

    this.onItemLoaded.emit({ item, currentViewer: viewer, viewingApplication: this.viewerApp });
  }

  private onItemLoadFail(errorCode: Autodesk.Viewing.ErrorCodes) {
    console.error('onItemLoadFail() - errorCode:' + errorCode);
  }
}
