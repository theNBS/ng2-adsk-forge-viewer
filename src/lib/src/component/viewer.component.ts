/// <reference types="three" />
/// <reference path="viewer-typings.d.ts" />

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy,
  Output, SimpleChanges } from '@angular/core';

import { ScriptService } from '../service/script.service';
import { BasicExtension } from '../extensions/basic-extension';

declare const require: any;

export interface DocumentChangedEvent {
  document: Autodesk.Viewing.Document;
  viewingApplication: Autodesk.Viewing.ViewingApplication;
  viewerComponent: ViewerComponent;
}

export interface ItemLoadedEvent {
  item: Autodesk.Viewing.ViewerItem;
  viewingApplication: Autodesk.Viewing.ViewingApplication;
  currentViewer: Autodesk.Viewing.Viewer3D;
  viewerComponent: ViewerComponent;
}

export interface ViewingApplicationInitializedEvent {
  viewingApplication: Autodesk.Viewing.ViewingApplication;
  viewerComponent: ViewerComponent;
}

export interface ViewerOptions {
  initializerOptions: Autodesk.Viewing.InitializerOptions;
  viewerApplicationOptions?: Autodesk.Viewing.ViewingApplicationOptions;
  viewerConfig?: Autodesk.Viewing.ViewerConfig;
  headlessViewer?: boolean;
  showFirstViewable?: boolean;
  versionString?: string;
}


@Component({
  selector: 'adsk-forge-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements OnChanges, OnDestroy {
  readonly containerId = 'ng2-adsk-forge-viewer-container';

  @Input() public viewerOptions: ViewerOptions;

  @Output() public onViewerScriptsLoaded = new EventEmitter<boolean>();
  @Output() public onViewingApplicationInitialized = new EventEmitter<ViewingApplicationInitializedEvent>();
  @Output() public onDocumentChanged = new EventEmitter<DocumentChangedEvent>();
  @Output() public onItemLoaded = new EventEmitter<ItemLoadedEvent>();
  @Output() public onError = new EventEmitter<Autodesk.Viewing.ErrorCodes>();

  // Viewer events
  @Output() public onFitToView = new EventEmitter<Autodesk.Viewing.FitToViewEventArgs>();
  @Output() public onFullscreen = new EventEmitter<Autodesk.Viewing.FullscreenEventArgs>();
  @Output() public onGeometryLoaded = new EventEmitter<Autodesk.Viewing.GeometryLoadedEventArgs>();
  @Output() public onHide = new EventEmitter<Autodesk.Viewing.HideEventArgs>();
  @Output() public onIsolate = new EventEmitter<Autodesk.Viewing.IsolateEventArgs>();
  @Output() public onObjectTreeCreated = new EventEmitter<Autodesk.Viewing.ObjectTreeEventArgs>();
  @Output() public onObjectTreeUnavailable = new EventEmitter<Autodesk.Viewing.ObjectTreeEventArgs>();
  @Output() public onReset = new EventEmitter<Autodesk.Viewing.ViewerEventArgs>();
  @Output() public onSelectionChanged = new EventEmitter<Autodesk.Viewing.SelectionChangedEventArgs>();
  @Output() public onShow = new EventEmitter<Autodesk.Viewing.ShowEventArgs>();


  private viewerInitialized = false;
  private viewerApp: Autodesk.Viewing.ViewingApplication;
  private documentId: string;

  /**
   * Helper to allow callers to specify documentId with or without the required urn: prefix
   */
  private static verifyUrn(documentId: string): string {
    return (documentId.startsWith('urn:')) ? documentId : `urn:${documentId}`;
  }

  constructor(private script: ScriptService) {
    this.loadScripts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.viewerInitialized && changes.viewerOptions && changes.viewerOptions.currentValue) {
      this.initialiseApplication();
    }
  }

  ngOnDestroy() {
    this.unregisterBasicExtension();

    if (this.viewerApp) {
      const viewer = this.viewerApp.getCurrentViewer();
      viewer.tearDown();
      viewer.uninitialize();
    }

    this.viewerApp = null;
    this.viewerInitialized = false;
  }

  /**
   * Helper method to get some default viewer options
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
   */
  public get ViewerApplication() {
    return this.viewerApp;
  }

  /**
   * Get a reference to the current 3D viewer
   */
  public get Viewer3D() {
    return this.viewerApp.getCurrentViewer();
  }

  public get DocumentId() {
    return this.documentId;
  }

  public set DocumentId(value: string) {
    this.documentId = value;
    this.loadDocument(this.documentId);
  }

  public selectItem(item: Autodesk.Viewing.ViewerItem|Autodesk.Viewing.BubbleNode) {
    this.viewerApp.selectItem(item, this.onItemLoadSuccess.bind(this), this.onItemLoadFail.bind(this));
  }

  /**
   * We don't bundle Autodesk's scripts with the component, and we don't really want users to have
   * to add the scripts to their index.html pages. So we'll load them when required.
   */
  private loadScripts() {
    this.script.load(
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/three.min.js?v=4.*.*',
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.min.js?v=4.*.*',
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
    // Check if the viewer has already been initialised - this isn't the nicest, but we've set the env in our
    // options above so we at least know that it was us who did this!
    if (!Autodesk.Viewing.Private.env) {
      Autodesk.Viewing.Initializer(this.viewerOptions.initializerOptions, () => {
        this.initialized();
      });
    } else {
      // We need to give an initialised viewing application a tick to allow the DOM element
      // to be established before we re-draw
      setTimeout(() => {
        this.initialized();
      });
    }
  }

  private initialized() {
    this.viewerApp = new Autodesk.Viewing.ViewingApplication(this.containerId,
                                                             this.viewerOptions.viewerApplicationOptions);

    // Register an extension to help us raise events
    const extName = this.registerBasicExtension();
    const config = this.addBasicExtensionConfig(extName);

    // Register a viewer with the application (passign through any additional config)
    this.viewerApp.registerViewer(
      this.viewerApp.k3D,
      (this.viewerOptions.headlessViewer) ? Autodesk.Viewing.Viewer3D : Autodesk.Viewing.Private.GuiViewer3D,
      config,
    );

    // Viewer is ready - scripts are loaded and we've create a new viewing application
    this.viewerInitialized = true;
    this.onViewingApplicationInitialized.emit({ viewingApplication: this.viewerApp, viewerComponent: this });
  }

  /**
   * Loads a model in to the viewer via it's urn
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
   */
  private onDocumentLoadSuccess(document: Autodesk.Viewing.Document) {
    // Emit an event so the caller can do something
    // TODO: config option to specify which viewable to display (how?)
    this.onDocumentChanged.emit({ document, viewingApplication: this.viewerApp, viewerComponent: this });

    if (this.viewerOptions.showFirstViewable === undefined || this.viewerOptions.showFirstViewable) {
      // This will be the default behaviour -- show the first viewable
      // We could still make use of Document.getSubItemsWithProperties()
      // However, when using a ViewingApplication, we have access to the **bubble** attribute,
      // which references the root node of a graph that wraps each object from the Manifest JSON.
      const viewables = this.viewerApp.bubble.search(Autodesk.Viewing.BubbleNode.MODEL_NODE);

      if (viewables && viewables.length > 0) {
        this.viewerApp.selectItem(viewables[0].data, this.onItemLoadSuccess.bind(this), this.onItemLoadFail.bind(this));
      }
    }
  }

  /**
   * Failed to load document
   */
  private onDocumentLoadFailure(errorCode: Autodesk.Viewing.ErrorCodes) {
    console.error('onDocumentLoadFailure() - errorCode:' + errorCode);
    this.onError.emit(errorCode);
  }

  /**
   * View from the document was successfully loaded
   */
  private onItemLoadSuccess(viewer: Autodesk.Viewing.Viewer3D, item: Autodesk.Viewing.ViewerItem) {
    console.log('onItemLoadSuccess()', viewer, item);
    console.log('Viewers are equal: ' + (viewer === this.viewerApp.getCurrentViewer()));

    this.onItemLoaded.emit({
      item, currentViewer: viewer,
      viewingApplication: this.viewerApp,
      viewerComponent: this,
    });
  }

  /**
   * Failed to load a view from the document
   */
  private onItemLoadFail(errorCode: Autodesk.Viewing.ErrorCodes) {
    console.error('onItemLoadFail() - errorCode:' + errorCode);
    this.onError.emit(errorCode);
  }

  private registerBasicExtension(): string {
    BasicExtension.registerExtension();

    // tslint:disable:max-line-length
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.FIT_TO_VIEW_EVENT, (args: Autodesk.Viewing.FitToViewEventArgs) => this.onFitToView.emit(args));
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.FULLSCREEN_MODE_EVENT, (args: Autodesk.Viewing.FullscreenEventArgs) => this.onFullscreen.emit(args));
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (args: Autodesk.Viewing.GeometryLoadedEventArgs) => this.onGeometryLoaded.emit(args));
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.HIDE_EVENT, (args: Autodesk.Viewing.HideEventArgs) => this.onHide.emit(args));
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.ISOLATE_EVENT, (args: Autodesk.Viewing.IsolateEventArgs) => this.onIsolate.emit(args));
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, (args: Autodesk.Viewing.ObjectTreeEventArgs) => this.onObjectTreeCreated.emit(args));
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT, (args: Autodesk.Viewing.ObjectTreeEventArgs) => this.onObjectTreeCreated.emit(args));
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.RESET_EVENT, (args: Autodesk.Viewing.ViewerEventArgs) => this.onReset.emit(args));
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.SELECTION_CHANGED_EVENT, (args: Autodesk.Viewing.SelectionChangedEventArgs) => this.onSelectionChanged.emit(args));
    BasicExtension.subscribeEvent(this, Autodesk.Viewing.SHOW_EVENT, (args: Autodesk.Viewing.ShowEventArgs) => this.onShow.emit(args));
    // tslint:enable:max-line-length

    return BasicExtension.extensionName;
  }

  private unregisterBasicExtension() {
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.FIT_TO_VIEW_EVENT);
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.FULLSCREEN_MODE_EVENT);
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.GEOMETRY_LOADED_EVENT);
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.HIDE_EVENT);
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.ISOLATE_EVENT);
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT);
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT);
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.RESET_EVENT);
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.SELECTION_CHANGED_EVENT);
    BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.SHOW_EVENT);

    BasicExtension.unregisterExtension();
  }

  private addBasicExtensionConfig(extName: string): Autodesk.Viewing.ViewerConfig {
    const config: Autodesk.Viewing.ViewerConfig = Object.assign(
      {},
      this.viewerOptions.viewerConfig,
      { extensions: [] },
    );

    // We will always load our basic extension with any others specified by the caller
    if (this.viewerOptions.viewerConfig && this.viewerOptions.viewerConfig.extensions) {
      config.extensions = [...this.viewerOptions.viewerConfig.extensions, extName];
    } else {
      config.extensions = [extName];
    }

    return config;
  }
}