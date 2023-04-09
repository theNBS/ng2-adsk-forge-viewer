/// <reference types="forge-viewer" />
import { takeUntil } from 'rxjs/operators';

declare const Autodesk: any;

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy,
  Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { ScriptService } from '../service/script.service';
import {
  FitToViewEventArgs,
  FullscreenEventArgs,
  GeometryLoadedEventArgs,
  HideEventArgs,
  IsolateEventArgs,
  ObjectTreeCreatedEventArgs,
  ObjectTreeUnavailableEventArgs, ResetEventArgs,
  SelectionChangedEventArgs,
  ShowEventArgs,
  ViewerEventArgs,
} from '../extensions/extension';
import { BasicExtension } from '../extensions/basic-extension';

/** Viewer types - headless, with gui and aggregated view */
export type ViewerType = 'Viewer3D' | 'GuiViewer3D' | 'AggregatedView';
/** Minimum attributes for a Vector in THREE */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface DocumentChangedEvent {
  document: Autodesk.Viewing.Document;
  viewerComponent: ViewerComponent;
  viewer: Autodesk.Viewing.Viewer3D;
}

export interface ItemLoadedEvent {
  item: Autodesk.Viewing.ViewerItem;
  viewer: Autodesk.Viewing.Viewer3D;
  viewerComponent: ViewerComponent;
}

export interface ViewerInitializedEvent {
  viewerComponent: ViewerComponent;
  viewer: Autodesk.Viewing.Viewer3D;
}

export interface ViewerOptions {
  initializerOptions: Autodesk.Viewing.InitializerOptions;
  viewerConfig?: Autodesk.Viewing.ViewerConfig;
  viewerType?: ViewerType;
  showFirstViewable?: boolean;
  enableMemoryManagement?: boolean;
  onViewerScriptsLoaded?: () => void;
  onViewerInitialized: (args: ViewerInitializedEvent) => void;
  version?: string | number;
}

export interface DocumentID {
  urn: string;
  xform?: Vector3;
  offset?: Vector3;
}


@Component({
  selector: 'adsk-forge-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements OnDestroy {
  public containerId: string;

  @Output() public onDocumentChanged = new EventEmitter<DocumentChangedEvent>();
  @Output() public onItemLoaded = new EventEmitter<ItemLoadedEvent>();
  @Output() public onError = new EventEmitter<Autodesk.Viewing.ErrorCodes>();

  // Viewer events
  @Output() public onFitToView = new EventEmitter<FitToViewEventArgs>();
  @Output() public onFullscreen = new EventEmitter<FullscreenEventArgs>();
  @Output() public onGeometryLoaded = new EventEmitter<GeometryLoadedEventArgs>();
  @Output() public onHide = new EventEmitter<HideEventArgs>();
  @Output() public onIsolate = new EventEmitter<IsolateEventArgs>();
  @Output() public onObjectTreeCreated = new EventEmitter<ObjectTreeCreatedEventArgs>();
  @Output() public onObjectTreeUnavailable = new EventEmitter<ObjectTreeUnavailableEventArgs>();
  @Output() public onReset = new EventEmitter<ResetEventArgs>();
  @Output() public onSelectionChanged = new EventEmitter<SelectionChangedEventArgs>();
  @Output() public onShow = new EventEmitter<ShowEventArgs>();

  // Debugging
  @Input() public showDebugMessages = false;

  private _viewerOptions: ViewerOptions | null = null;
  private viewerInitialized = false;
  private viewer!: Autodesk.Viewing.Viewer3D | null;
  private aggregatedView: Autodesk.Viewing.AggregatedView;
  private documentId!: string | DocumentID[];
  private documents: Autodesk.Viewing.Document[];
  private unsubscribe: Subject<void> = new Subject();
  private basicExt!: BasicExtension;

  /**
   * Helper to allow callers to specify documentId with or without the required urn: prefix
   */
  private static verifyUrn(documentId: string): string {
    return (documentId.startsWith('urn:')) ? documentId : `urn:${documentId}`;
  }

  constructor(private script: ScriptService) {
    this.containerId = this.getDivName();
  }

  @Input() public set viewerOptions(options: ViewerOptions) {
    if (!this.viewerInitialized && options) {
      this._viewerOptions = options;
      void this.initialiseViewer();
    }
  }

  public get viewerOptions() {
    return this._viewerOptions as ViewerOptions;
  }

  ngOnDestroy() {
    this.unregisterBasicExtension();

    if (this.viewer) {
      this.viewer.tearDown();
      this.viewer.uninitialize();
    }

    this.viewer = null;
    this.viewerInitialized = false;
    this.documents = [];

    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Helper method to get some default viewer options
   */
  public getDefaultViewerOptions(
    onViewerInitialized: (args: ViewerInitializedEvent) => void,
    getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => void,
  ): ViewerOptions {
    return {
      initializerOptions: {
        env: 'AutodeskProduction',
        getAccessToken,
        api: 'derivativeV2',
      },
      onViewerInitialized,
    };
  }

  /**
   * Get a reference to the current 3D viewer
   */
  public get Viewer3D(): Autodesk.Viewing.Viewer3D {
    return this.viewer as Autodesk.Viewing.Viewer3D;
  }

  /**
   * Get the document urn that has been loaded
   */
  public get DocumentId(): string | DocumentID[] {
    return this.documentId;
  }

  /**
   * Return aggregated view if there is one
   */
  public get AggregatedView(): Autodesk.Viewing.AggregatedView {
    return this.aggregatedView;
  }

  public get Documents(): Autodesk.Viewing.Document[] {
    return this.documents;
  }

  /**
   * Set the document urn, which triggers the viewer to load the document
   */
  public set DocumentId(value: string | DocumentID[]) {
    this.documentId = value;
    if (Array.isArray(value)) {
      this.loadMultipleModels(value);
    } else {
      this.loadModel(this.documentId as string);
    }
  }

  /**
   * Get the container element
   */
  public get Container(): HTMLElement {
    return document.getElementById(this.containerId) as HTMLElement;
  }

  /**
   * Get the id assigned to the viewer
   */
  public get ContainerId() {
    return this.containerId;
  }

  public get basicExtension() {
    return this.basicExt;
  }

  public get extensionEvents(): Observable<ViewerEventArgs> | undefined {
    if (this.basicExt) {
      return this.basicExt.viewerEvents;
    }

    return undefined;
  }

  public loadDocumentNode(document: Autodesk.Viewing.Document,
                          bubbleNode: Autodesk.Viewing.BubbleNode,
                          options?: object): Promise<Autodesk.Viewing.Model> {
    return this.viewer!.loadDocumentNode(document, bubbleNode, options);
  }

  /**
   * We don't bundle Autodesk's scripts with the component, and we don't really want users to have
   * to add the scripts to their index.html pages. So we'll load them when required.
   */
  private loadScripts(): Promise<void> {
    const version = this.viewerOptions.version || '7.*';
    const url = `https://developer.api.autodesk.com/modelderivative/v2/viewers/${version}/viewer3D.min.js`;
    return this.script.load(
      url,
    )
      .then((data) => {
        this.log('script loaded ', data);
      })
      .catch(error => this.error(error));
  }

  /**
   * Initialises the viewer
   */
  private async initialiseViewer() {
    // Load scripts first
    await this.loadScripts();
    if (this.viewerOptions.onViewerScriptsLoaded) this.viewerOptions.onViewerScriptsLoaded();

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
    // Register an extension to help us raise events
    const extName = this.registerBasicExtension();
    const config = this.addBasicExtensionConfig(extName);

    // Support large models
    if (this.viewerOptions.enableMemoryManagement) {
      config['loaderExtensions'] = { svf: 'Autodesk.MemoryLimited' };
    }

    // Handle aggregated viewer
    if (this.viewerOptions.viewerType === 'AggregatedView') {
      const view = new Autodesk.Viewing.AggregatedView();
      void view.init(this.Container, { viewerConfig: config })
        .then(() => {
          this.aggregatedView = view;
          this.viewer = view.viewer;

          // Viewer is ready - scripts are loaded and we've create a new viewing application
          this.viewerInitialized = true;
          this.viewerOptions.onViewerInitialized({ viewerComponent: this, viewer: this.viewer! });
        });
      return;
    }

    // Create a new viewer
    if (this.viewerOptions.viewerType === 'Viewer3D') {
      this.viewer = new Autodesk.Viewing.Viewer3D(this.Container, config);
    } else {
      this.viewer = new Autodesk.Viewing.GuiViewer3D(this.Container, config);
    }

    // set a document url if environment set to Local
    let url: string;
    if (this.viewerOptions.initializerOptions?.env === 'Local') {
      url = this.viewerOptions.initializerOptions?.['document'];
    }
    // Start the viewer
    this.viewer!.start(url!);

    // Viewer is ready - scripts are loaded and we've created a new viewing application
    this.viewerInitialized = true;
    this.viewerOptions.onViewerInitialized({ viewerComponent: this, viewer: this.viewer! });
  }

  /**
   * Load multiple models in to the viewer via urns
   */
  private loadMultipleModels(documentIds: DocumentID[]) {
    this.documents = [];
    const bubbleNodes: Autodesk.Viewing.BubbleNode[] = [];
    let loaded = 0;

    for (const documentId of documentIds) {
      // Add urn: to the beginning of document id if needed
      Autodesk.Viewing.Document.load(
        ViewerComponent.verifyUrn(documentId.urn),
        (document: Autodesk.Viewing.Document) => {
          this.documents.push(document);

          // Set the nodes from the doc
          const nodes = document.getRoot().search({ type: 'geometry' });

          if (this.aggregatedView) {
            // Load the first bubble node. This assumes that a bubbleNode was successfully found
            bubbleNodes.push(nodes[0]);

            // Have we finished loading documents?
            loaded += 1;
            if (loaded === documentIds.length) {
              void this.aggregatedView.setNodes(bubbleNodes, undefined)
                .then((docs) => {
                  // Emit an event so the caller can do something
                  this.onDocumentChanged.emit({ document, viewerComponent: this, viewer: this.viewer! });
                });
            }
          } else {
            const options: any = {
              keepCurrentModels: true,
            };

            if (documentId.xform) {
              options.placementTransform = (new THREE.Matrix4()).setPosition(
                new THREE.Vector3(documentId.xform.x, documentId.xform.y, documentId.xform.z),
              );
            }

            if (documentId.offset) {
              options.globalOffset = new THREE.Vector3(documentId.offset.x, documentId.offset.y, documentId.offset.z);
            }

            void this.viewer!.loadDocumentNode(
              document,
              nodes[0],
              options,
            )
            .then((docs) => {
              // Emit an event so the caller can do something
              this.onDocumentChanged.emit({ document, viewerComponent: this, viewer: this.viewer! });
            });
          }
        },
        this.onDocumentLoadFailure.bind(this),
      );
    }
  }

  /**
   * Loads a model in to the viewer via it's urn
   */
  private loadModel(documentId: string) {
    if (!documentId) {
      return;
    }

    // Add urn: to the beginning of document id if needed
    Autodesk.Viewing.Document.load(
      ViewerComponent.verifyUrn(documentId),
      this.onDocumentLoadSuccess.bind(this),
      this.onDocumentLoadFailure.bind(this),
    );
  }

  /**
   * Document successfully loaded
   */
  private onDocumentLoadSuccess(document: Autodesk.Viewing.Document) {
    if (!document.getRoot()) return;
    this.documents = [document];

    // Emit an event so the caller can do something
    // TODO: config option to specify which viewable to display (how?)
    this.onDocumentChanged.emit({ document, viewerComponent: this, viewer: this.viewer! });

    if (this.viewerOptions.showFirstViewable === undefined || this.viewerOptions.showFirstViewable) {
      let model: Autodesk.Viewing.BubbleNode = (document.getRoot() as any).getDefaultGeometry();
      if (!model) {
        const allModels = document.getRoot().search({ type: 'geometry' });
        model = allModels[0];
      }

      void this.viewer?.loadDocumentNode(document, model, undefined);
    }
  }

  /**
   * Failed to load document
   */
  private onDocumentLoadFailure(errorCode: Autodesk.Viewing.ErrorCodes) {
    this.error('onDocumentLoadFailure() - errorCode:' + errorCode);
    this.onError.emit(errorCode);
  }

  /**
   * Register our BasicExtension with the Forge Viewer
   */
  private registerBasicExtension(): string {
    BasicExtension.registerExtension(BasicExtension.extensionName, this.extensionLoaded.bind(this));
    return BasicExtension.extensionName;
  }

  /**
   * Subscript to BasicExtension events when the extension has been
   * succesfully loaded by the viewer.
   */
  private extensionLoaded(ext: BasicExtension) {
    this.basicExt = ext;
    ext.viewerEvents?.pipe(takeUntil(this.unsubscribe))
      .subscribe((item: ViewerEventArgs) => {
        this.log(item);

        if (item instanceof FitToViewEventArgs) {
          this.onFitToView.emit(item);
        } else if (item instanceof FullscreenEventArgs) {
          this.onFullscreen.emit(item);
        } else if (item instanceof GeometryLoadedEventArgs) {
          this.onGeometryLoaded.emit(item);
        } else if (item instanceof HideEventArgs) {
          this.onHide.emit(item);
        } else if (item instanceof IsolateEventArgs) {
          this.onIsolate.emit(item);
        } else if (item instanceof ObjectTreeCreatedEventArgs) {
          this.onObjectTreeCreated.emit(item);
        } else if (item instanceof ObjectTreeUnavailableEventArgs) {
          this.onObjectTreeUnavailable.emit(item);
        } else if (item instanceof ResetEventArgs) {
          this.onReset.emit(item);
        } else if (item instanceof SelectionChangedEventArgs) {
          this.onSelectionChanged.emit(item);
        } else if (item instanceof ShowEventArgs) {
          this.onShow.emit(item);
        }
      });
  }

  private unregisterBasicExtension() {
    BasicExtension.unregisterExtension(BasicExtension.extensionName);
    this.basicExt = null as any;
  }

  /**
   * Add list of extensions to the viewer config that has been provided
   * The allows the user to register their own extensions.
   */
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

  private log(message?: any, ...optionalParams: any[]) {
    if (!this.showDebugMessages) return;
    console.log(message, optionalParams);
  }

  private error(message?: any, ...optionalParams: any[]) {
    if (!this.showDebugMessages) return;
    console.error(message, optionalParams);
  }

  private getDivName() {
    const S4 = () => {
      // tslint:disable-next-line:no-bitwise
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    const guid = (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    return `viewer_${guid}`;
  }
}
