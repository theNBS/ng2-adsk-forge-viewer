/// <reference types="three" />

declare namespace Autodesk.Viewing {
  enum ErrorCodes {
    UNKNOWN_FAILURE,
    NETWORK_FAILURE,
    NETWORK_ACCESS_DENIED,
    NETWORK_FILE_NOT_FOUND,
    NETWORK_SERVER_ERROR,
    NETWORK_UNHANDLED_RESPONSE_CODE,
    BROWSER_WEBGL_NOT_SUPPORTED,
    BAD_DATA_NO_VIEWABLE_CONTENT,
    BROWSER_WEBGL_DISABLED,
    BAD_DATA_MODEL_IS_EMPTY,
    RTC_ERROR,
    UNSUPORTED_FILE_EXTENSION,
    VIEWER_INTERNAL_ERROR,
  }

  enum SelectionMode {
    MIXED,
    REGULAR,
    OVERLAYED,
    LEAF_OBJECT,
    FIRST_OBJECT,
    LAST_OBJECT,
  }

  enum ProgressState {
    ROOT_LOADED,
    LOADING,
    RENDERING,
  }

  interface InitializerOptions {
    env?: 'Development'|'Staging'|'Production'|'AutodeskDevelopment'|'AutodeskStaging'|'AutodeskProduction'|string;
    accessToken?: string;
    getAccessToken?: (onGetAccessToken: (token: string, expire: number) => void) => void;
    useADP?: boolean;
    webGLHelpLink?: string;
    language?: string;
    [key: string]: any;
  }

  interface Viewer3DConfig {
    startOnInitialize?: boolean;
    theme?: 'dark-theme'|'light-theme'|string;
    [key: string]: any;
  }

  interface ViewingApplicationOptions {
    disableBrowserContextMenu?: boolean;
    [key: string]: any;
  }

  interface ViewerConfig {
    disableBrowserContextMenu?: boolean;
    extensions?: string[];
    useConsolidation?: boolean;
    consolidationMemoryLimit?: number;
    sharedPropertyDbPath?: string;
    bubbleNode?: BubbleNode;
    canvasConfig?: any;
    startOnInitialize?: boolean;
    experimental?: any[];
    theme?: 'dark-theme'|'light-theme'|string;
    [key: string]: any;
  }

  interface ItemSelectedObserver {
    onItemSelected(viewer: Viewer3D);
  }

  interface SelectionVisibility {
    hasVisible: boolean;
    hasHidden: boolean;
  }

  interface ThumbnailOptions {
    urn: string;
    width: number;
    height: number;
    guid: string;
    acmsession: (string);
  }

  interface FileLoaderOptions {
    ids?: string;
    sharedPropertyDbPath?: string;
    [key: string]: any;
  }

  interface LoadModelOptions {
    fileLoader?: FileLoader;
    loadOptions?: Object;
    sharedPropertyDbPath?: string;
    ids?: string;
    [key: string]: any;
  }

  interface PropertyOptions {
    propFilter?: string[];
    ignoreHidden?: boolean;
    [key: string]: any;
  }

  interface ResizePanelOptions {
    dockingPanels?: UI.DockingPanel[];
    viewer?: Viewer3D;
    dimensions?: {
      width: number;
      height: number;
    };
  }

  interface ViewerItem {
    children?: ViewerItem[];
    guid: string;
    hasThumbnail: boolean;
    name: string;
    parent: ViewerItem;
    progress: string;
    role: '3d'|'2d'|string;
    size: number;
    status: string;
    success: string;
    type: 'view'|'geometry'|string;
    viewableID: string;
  }

  interface ExtensionOptions {
    defaultModelStructureTitle: string;
    extensions: string[];
    startOnInitialize: boolean;
    viewableName: string;
    [key: string]: any;
  }

  const AGGREGATE_SELECTION_CHANGED_EVENT = 'aggregateSelection';
  const ANIMATION_READY_EVENT = 'animationReady';
  const CAMERA_CHANGE_EVENT = 'cameraChanged';
  const CUTPLANES_CHANGE_EVENT = 'cutplanesChanged';
  const ESCAPE_EVENT = 'escape';
  const EXPLODE_CHANGE_EVENT = 'explodeChanged';
  const EXTENSION_LOADED_EVENT = 'extensionLoaded';
  const EXTENSION_UNLOADED_EVENT = 'extensionUnloaded';
  const FINAL_FRAME_RENDERED_CHANGED_EVENT = 'finalFrameRenderedChanged';
  const FIT_TO_VIEW_EVENT = 'fitToView';
  const FRAGMENTS_LOADED_EVENT = 'fragmentsLoaded';
  const FULLSCREEN_MODE_EVENT = 'fullscreenMode';
  const GEOMETRY_LOADED_EVENT = 'geometryLoaded';
  const HIDE_EVENT = 'hide';
  const HYPERLINK_EVENT = 'hyperlink';
  const ISOLATE_EVENT = 'isolate';
  const LAYER_VISIBILITY_CHANGED_EVENT = 'layerVisibilityChanged';
  const LOAD_MISSING_GEOMETRY = 'loadMissingGeometry';
  const MODEL_ROOT_LOADED_EVENT = 'modelRootLoaded';
  const MODEL_UNLOADED_EVENT = 'modelUnloaded';
  const NAVIGATION_MODE_CHANGED_EVENT = 'navigationModeChanged';
  const OBJECT_TREE_CREATED_EVENT = 'objectTreeCreated';
  const OBJECT_TREE_UNAVAILABLE_EVENT = 'objectTreeUnavailable';
  const PREF_CHANGED_EVENT = 'prefChanged';
  const PREF_RESET_EVENT = 'prefReset';
  const PROGRESS_UPDATE_EVENT = 'progressUpdate';
  const RENDER_OPTION_CHANGED_EVENT = 'renderOptionChanged';
  const RENDER_PRESENTED_EVENT = 'renderPresented';
  const RESET_EVENT = 'reset';
  const RESTORE_DEFAULT_SETTINGS_EVENT = 'restoreDefaultSettings';
  const SELECTION_CHANGED_EVENT = 'selection';
  const SHOW_EVENT = 'show';
  const TEXTURES_LOADED_EVENT = 'texturesLoaded';
  const TOOL_CHANGE_EVENT = 'toolChanged';
  const VIEWER_INITIALIZED = 'viewerInitialized';
  const VIEWER_RESIZE_EVENT = 'viewerResize';
  const VIEWER_STATE_RESTORED_EVENT = 'viewerStateRestored';
  const VIEWER_UNINITIALIZED = 'viewerUninitialized';

  interface ViewerEventArgs {
    target?: Viewer3D;
    type?: string;
    [key: string]: any;
  }
  interface AggregationSelectionChangedEventArgs extends ViewerEventArgs {
    selections: ViewerItem[];
  }
  interface CameraChangedEventArgs extends ViewerEventArgs {
    camera: THREE.Camera;
  }
  interface CutplanesChangedEventArgs extends ViewerEventArgs {
    cutplanes: Object[];
  }
  interface ExplodeChangedEventArgs extends ViewerEventArgs {
    scale: number;
  }
  interface ExtensionLoadedUnloadedEventArgs extends ViewerEventArgs {
    extensionId: string;
  }
  interface FinalFrameRenderedChangedEventArgs extends ViewerEventArgs {
    planes: Object[];
  }
  interface FitToViewEventArgs extends ViewerEventArgs {
    immediate: boolean;
    nodeIdArray: number[];
    model: ViewerItem;
  }
  interface FragmentsLoadedEventArgs extends ViewerEventArgs {
    model: ViewerItem;
    getFragIds: () => void;
    data: Object;
  }
  interface FullscreenEventArgs extends ViewerEventArgs {
    mode: Autodesk.Viewing.ScreenMode;
  }
  interface GeometryLoadedEventArgs extends ViewerEventArgs {
    model: ViewerItem;
  }
  interface HideEventArgs extends ViewerEventArgs {
    nodeIdArray: number[];
    model: ViewerItem;
  }
  interface HyperlinkEventArgs extends ViewerEventArgs {
    data: Object; // TODO: Can his be stronger?
  }
  interface IsolateEventArgs extends ViewerEventArgs {
    nodeIdArray: number[];
    model: ViewerItem;
  }
  interface LoadMissingGeometryEventArgs extends ViewerEventArgs {
    delay: boolean;
  }
  interface ModelRootLoadedEventArgs extends ViewerEventArgs {
    svf: Object; // TODO: can this be stronger
    model: ViewerItem;
  }
  interface ModelUnloadedEventArgs extends ViewerEventArgs {
    model: ViewerItem;
  }
  interface NavigationModeChangedEventArgs extends ViewerEventArgs {
    id: string;
  }
  interface ObjectTreeEventArgs extends ViewerEventArgs {
    svf: Object; // TODO: can this be stronger
    model: ViewerItem;
  }
  interface PrefEventArgs extends ViewerEventArgs {
    name: string;
    value: Object;
  }
  interface ProgressUpdateEventArgs extends ViewerEventArgs {
    percent: number;
    state: Autodesk.Viewing.ProgressState;
  }
  interface SelectionChangedEventArgs extends ViewerEventArgs {
    fragIdsArray: number[];
    dbIdArray: number[];
    nodeArray: number[];
    model: ViewerItem;
  }
  interface ShowEventArgs extends ViewerEventArgs {
    nodeArrayId: number[];
    model: ViewerItem;
  }
  interface TexturesLoadedEventArgs extends ViewerEventArgs {
    model: ViewerItem;
  }
  interface ToolChangedEventArgs extends ViewerEventArgs {
    toolName: string;
    tool: Object;
    active: boolean;
  }
  interface ViewerResizeEventArgs extends ViewerEventArgs {
    width: number;
    height: number;
  }
  interface ViewerStateRestoredEventArgs extends ViewerEventArgs {
    value: boolean;
  }

  interface BubbleNodeSearchProps {
    role?: string;
    type?: string;
    mime?: string;
  }

  class BubbleNode {
    static MODEL_NODE: BubbleNodeSearchProps;
    static GEOMETRY_SVF_NODE: BubbleNodeSearchProps;
    static SHEET_NODE: BubbleNodeSearchProps;
    static GEOMETRY_F2D_NODE: BubbleNodeSearchProps;
    static VIEWABLE_NODE: BubbleNodeSearchProps;

    parent: BubbleNode;
    id: number;
    data: ViewerItem;
    isLeaf: boolean;
    sharedPropertyDbPath: string;
    lodNode: Object;
    children: BubbleNode[];

    constructor(rawNode: Object, parent?: BubbleNode);

    findByGuid(guid: string): BubbleNode;
    findParentGeom2Dor3D(): BubbleNode;
    findPropertyDbPath(): string;
    findViewableParent(): BubbleNode;
    getLodNode(): boolean;
    getNamedViews(): string[];
    getPlacementTransform(): Object;
    getRootNode(): BubbleNode;
    getTag(tag: string): any;
    getViewableRootPath(): string;
    guid(): string;
    is2D(): boolean;
    is2DGeom(): boolean;
    is3D(): boolean;
    is3DGeom(): boolean;
    isGeometry(): boolean;
    isGeomLeaf(): boolean;
    isMetadata(): boolean;
    isViewable(): boolean;
    name(): string;
    search(propsToMatch: BubbleNodeSearchProps): BubbleNode[];
    searchByTag(tagsToMatch: Object): BubbleNode[];
    setTag(tag: string, value: any);
    traverse(cb: Function): boolean;
    urn(searchParent: boolean): string;
  }

  function Initializer(options: InitializerOptions, callback: () => void): void; // tslint:disable-line

  class Document {
    constructor(dataJSON: Object, path: string, acmsession: string);

    getFullPath(urn: string): string;
    getItemById(id: string): Object;
    getMessages(itemId: string, excludeGlobal: boolean): Object;
    getNumViews(item: Object): number;
    getParentId(item: string): string;
    getPath(): string;
    getPropertyDbPath(): string;
    getRoot(): BubbleNode;
    getRootItem(): Object;
    getSubItemsWithProperties(item: Object, properties: Object, recursive: boolean): Object;
    getThumbnailOptions(item: Object, width: number, height: number): ThumbnailOptions;
    getThumbnailPath(item: string, width: number, height: number): string;
    getViewableItems(document: Document): void;
    getViewablePath(item: Object, outLoadOptions: Object): string;
    getViewGeometry(item: Object): Object;
    load(documentId: string, onSuccessCallback: Function, onErrorCallback: Function, accessControlProperties: Object);
    requestThumbnailWithSecurity(data: string, onComplete: (err: Error, response: any) => void);
  }

  class ExtensionManager {
    extensions: { [key: string]: Extension };
    extensionsAsync: { [key: string]: Extension };

    registerExtension(extensionId: string, extension: Object): boolean;
    getExtension(extensionId: string): Extension|null;
    unregisterExtension(extensionId: string): boolean;
    registerExternalExtension(extensionId: string, urlPath: string): boolean;
    getExternalPath(extensionId: string): string|null;
    unregisterExternalExtension(extensionId: string): boolean;
    getRegisteredExtensions(): { id: string, inMemory: boolean, isAsync: boolean}[];
    popuplateOptions(options: any): void;
  }

  const theExtensionManager: ExtensionManager;

  class Extension {
    constructor(viewer: Viewer3D, options: ExtensionOptions);

    load(): boolean;
    unload(): boolean;
  }

  class FileLoader {
    constructor(viewer: Viewer3D);

    is3d(): boolean;
    loadFile(url: string, options: FileLoaderOptions, onSuccess: Function, onError: Function): void;
  }

  class Model {
    fetchTopology(maxSizeMB: number): Promise<Object>;
    geomPolyCount(): number;
    getBoundingBox(): any;
    getBulkProperties(dbIds: number[],
                      options: PropertyOptions,
                      onSuccessCallback: Function,
                      onErrorCallback: Function);
    getData(): any;
    getDefaultCamera(): THREE.Camera;
    getDisplayUnit(): string;
    getDocumentNode(): Object;
    getExternalIdMapping(onSuccessCallback: Function, onErrorCallback: Function);
    getFastLoadList(): any;
    getFragmentMap(): any; // DbidFragmentMap|InstanceTree;
    getInstanceTree(): any; // InstanceTree;
    getLayersRoot(): Object;
    getMetadata(itemName: string, subitemName?: string, defaultValue?: any): any;
    getObjectTree(onSuccessCallback: Function, onErrorCallback: Function): void;
    getProperties(dbId: number, onSuccessCallback: Function, onErrorCallback: Function): void;
    getRoot(): Object;
    getRootId(): number;
    getTopoIndex(fragId: number): number;
    getTopology(index: number): Object;
    getUnitData(unit: string): Object;
    getUnitScale(): number;
    getUnitString(): string;
    getUpVector(): any;
    hasTopology(): boolean;
    instancePolyCount(): number;
    is2d(): boolean;
    is3d(): boolean;
    isAEC(): boolean;
    isLoadDone(): boolean;
    isObjectTreeCreated(): boolean;
    isObjectTreeLoaded(): boolean;
    pageToModel(): void;
    pointInClip(): void;
    search(text: string, onSuccessCallback: Function, onErrorCallback: Function, attributeNames?: string[]): void;
    setData(data: Object): void;
    setUUID(urn: string): void;
  }

  class ScreenMode {
    constructor();
  }

  abstract class ScreenModeDelegate {
    constructor(viewer: Viewer3D);

    doScreenModeChange(oldMode: ScreenMode, newMode: ScreenMode);
    fullscreenEventListener(): void;
    getEscapeMode(): ScreenMode | undefined;
    getMode(): ScreenMode;
    getNextMode(): ScreenMode | undefined;
    isModeSupported(mode: ScreenMode): boolean;
    onScreenModeChanged(oldMode: ScreenMode, newMode: ScreenMode): void;
    setMode(mode: ScreenMode): boolean;
    uninitialize(): void;
  }

  class AppScreenModeDelegate extends ScreenModeDelegate {
    constructor(viewer: Viewer3D);
  }

  class NullScreenModeDelegate extends ScreenModeDelegate {
    constructor(viewer: Viewer3D);
  }

  class Viewer3D implements EventTarget {
    constructor(container: HTMLElement, config: Viewer3DConfig);

    activateLayerState(stateName: string): void;
    activateExtension(extensionID: string, mode: string): boolean;
    anyLayerHidden(): boolean;
    applyCamera(camera: THREE.Camera, fit?: boolean): void;
    areAllVisible(): boolean;
    clearSelection(): void;
    clearThemingColors(model?: any): void; // RenderModel?
    clientToWorld(clientX: number, clientY: number, ignoreTransparent?: boolean): Object | null;
    createViewCube(): void;
    deactivateExtension(extensionID: string): boolean;
    displayViewCube(display: boolean): void;
    displayViewCubeUI(display: boolean): void;
    explode(scale: number): void;
    finish(): void;
    fitToView(objectIds?: number[]|number, model?: Model): void;
    getActiveNavigationTool(): string;
    getAggregateSelection(callback?: Function): Object[];
    getBimWalkToolPopup(): boolean;
    getCamera(): any;
    getClickConfig(what: string, where: string): string[] | null;
    getCutPlanes(): Object[];
    getDefaultNavigationToolName(): Object;
    getDimensions(): Object;
    getExplodeScale(): number;
    getExtensionModes(extensionID: string): string[];
    getFirstPersonToolPopup(): boolean;
    getFocalLength(): number;
    getFOV(): number;
    getHiddenModels(): any[]; // Array<RenderModel>;
    getHiddenNodes(): any[];   // Array of nodes
    getIsolatedNodes(): any[]; // Array of nodes
    getLayerStates(): any[];
    getLoadedExtensions(): any[];
    getMemoryInfo(): any;
    getNavigationLock(): boolean;
    getNavigationLockSettings(): Object;
    getObjectTree(onSuccessCallback?: Function, onErrorCallback?: Function): void;
    getProperties(dbid: number, onSuccessCallback?: Function, onErrorCallback?: Function): void;
    getScreenShot(w?: number, h?: number, cb?: Function): any; // DOMString
    getScreenShotBuffer(w?: number, h?: number, cb?: Function): any;
    getSelection(): number[];
    getSelectionCount(): number;
    getSelectionVisibility(): SelectionVisibility;
    getState(filter?: Object): Object; // Viewer state
    hide(node: number[]|number): void;
    hideLines(hide: boolean): void;
    hideModel(modelId: number): boolean;
    hidePoints(hide: boolean): void;
    initialize(): number | ErrorCodes;
    initSettings(): void;
    isExtensionActive(extensionID: string): boolean;
    isExtensionLoaded(extensionID: string): boolean;
    isLayerVisible(node: Object): boolean;
    isNodeVisible(nodeId: number, model?: Model): boolean;
    isolate(node: number[]|number): void;
    isolateById(dbids: number[]|number): void;
    joinLiveReview(sessionId: string): void;
    leaveLiveReview(): void;
    load(svfURN: string, sharedPropertyDbPath?: string, onSuccessCallback?: Function,
         onErrorCallback?: Function, loadOptions?: Object): void; // loadOptions Object?
    loadModel(url: string, options?: LoadModelOptions, onSuccessCallback?: Function, onErrorCallback?: Function): void;
    localize(): void;
    modelHasTopology(): boolean;
    playAnimation(callback?: Function): void;
    registerContextMenuCallback(id: string, callback: (menu: any, status: any) => void);
    resize(): void;
    restoreState(viewerState: Object, filter?: Object, immediate?: boolean): boolean;
    search(text: string, onSuccessCallback: Function, onErrorCallback: Function, attributeNames?: string[]): void;
    select(dbids: number[]|number, selectionType: SelectionMode): void;
    setActiveNavigationTool(toolName?: string): boolean;
    setBackgroundColor(red: number, green: number, blue: number, red2: number, green2: number, blue2: number): void;
    setBimWalkToolPopup(value: boolean): void;
    setCanvasClickBehavior(config: Object): void;
    setClickConfig(what: string, where: string, newAction: string|string[]): boolean;
    setClickToSetCOI(state: boolean, updatePrefs?: boolean): void;
    setContextMenu(contextMenu: any): void; // ObjectContextMenu)
    setCutPlanes(planes: Object): void;
    setDefaultContextMenu(): boolean;
    setDefaultNavigationTool(toolName: string): void;
    setDisplayEdges(show: boolean): void;
    setEnvMapBackground(value: boolean): void;
    setFirstPersonToolPopup(value: boolean): void;
    setFocalLength(mm: number): void;
    setFOV(degrees: number): void;
    setGhosting(value: boolean): void;
    setGroundReflection(value: boolean): void;
    setGroundReflectionAlpha(alpha: number): void;
    setGroundReflectionColor(color: THREE.Color): void;
    setGroundShadow(value: boolean): void;
    setGroundShadowAlpha(alpha: number): void;
    setGroundShadowColor(color: THREE.Color): void;
    setLayerVisible(nodes: any[], visible: boolean, isolate?: boolean): void;
    setLightPreset(index: number): void;
    setModelUnits(model: Model): void;
    setNavigationLock(value: boolean);
    setNavigationLockSettings(settings: { [key: string]: boolean }): void;
    setOptimizeNavigation(value: boolean): void;
    setOrbitPastWorldPoles(value: boolean): void;
    setProgressiveRendering(value: boolean): void;
    setQualityLevel(useSAO: boolean, useFXAA: boolean): void;
    setRenderCache(value: boolean): void;
    setReverseHorizontalLookDirection(value: boolean): void;
    setReverseVerticalLookDirection(value: boolean): void;
    setReverseZoomDirection(value: boolean): void;
    setSelectionColor(color: THREE.Color, selectionType: SelectionMode): void;
    setSelectionMode(selectionType: SelectionMode): void;
    setSwapBlackAndWhite(value: boolean): void;
    setTheme(name: 'dark-theme'|'light-theme'|string): void;
    setThemingColor(dbId: number, color: THREE.Vector4, model?: any): void; // RenderModel
    setUseLeftHandedInput(value: boolean): void;
    setUsePivotAlways(value: boolean): void;
    setViewCube(face: string): void;
    setViewFromArray(params: any[]): void;
    setViewFromFile(): void;
    setViewFromViewBox(viewbox: any[], name?: string): void;
    setZoomTowardsPivot(value: boolean): void;
    show(node: number[]|number): void;
    showAll(): void;
    showModel(modelId: number): boolean;
    start(url?: string, options?: LoadModelOptions,
          onSuccessCallback?: Function,
          onErrorCallback?: Function): number|ErrorCodes;
    tearDown(): void;
    toggleSelect(dbid: number, selectionType: SelectionMode): void;
    toggleVisibility(node: number): void;
    trackADPSettingsOptions(): void;
    transferModel(): void;
    uninitialize(): void;
    unregisterContextMenuCallback(id: string): boolean;
    worldToClient(point: THREE.Vector3): THREE.Vector3;

    // Events
    addEventListener(type: string, listener?: EventListenerOrEventListenerObject,
                     options?: boolean | AddEventListenerOptions): void;
    dispatchEvent(evt: Event): boolean;
    removeEventListener(type: string, listener?: EventListenerOrEventListenerObject,
                        options?: boolean | EventListenerOptions): void;
  }

  class ViewingApplication {
    k3D: '3D';
    bubble: BubbleNode;
    appContainerId: string;
    container: HTMLElement;
    options: ViewingApplicationOptions;
    myRegisteredViewers: any;
    myDocument: Document;
    myCurrentViewer: Viewer3D;
    urn: string;
    selectedItem: ViewerItem|null;
    extensionCache: Object;


    constructor(containerId: string, options?: ViewingApplicationOptions);

    addItemSelectedObserver(observer: ItemSelectedObserver): void;
    finish(): void;
    getCurrentViewer(): Viewer3D;
    getDefaultGeometry(geometryItems: any[]): Object;
    getNamedViews(item: Object): any[];
    getSelectedItem(): Object|null;
    getViewer(config: Viewer3DConfig): Viewer3D;
    getViewerContainer(): HTMLElement;
    loadDocument(documentId: any,
                 onDocumentLoad?: (document: Document) => void,
                 onLoadFailed?: (errorCode: string, errorMsg: string, errors: any[]) => void,
                 accessControlProperties?: Object): void;
    registerViewer(viewableType: string, viewerClass: any, config?: ViewerConfig): void;
    selectItem(item: ViewerItem|BubbleNode,
               onSuccessCallback: (viewer: Viewer3D, item: ViewerItem) => void,
               onErrorCallback: (errorCode: ErrorCodes, errorMsg: string,
                                 statusCode: string, statusText: string, messages: string) => void): boolean;
    selectItemById(itemId: number,
                   onItemSelectedCallback: (item: Object, viewGeometryItem: Object) => void,
                   onItemFailedToSelectCallback: Function): boolean;
    setCurrentViewer(viewer: Viewer3D): void;
    setDocument(docManifest: Object): boolean;
  }

  namespace UI {
    interface DockingPanelOptions {
      localizeTitle?: boolean;
      [key: string]: any;
    }

    interface ScrollContainerOptions {
      left: boolean;
      heightAdjustment: number;
      marginTop: number;
      [key: string]: any;
    }

    interface ContentSize {
      height: number;
      width: number;
    }

    interface ResizeOptions {
      maxHeight: number;
      [key: string]: any;
    }

    interface AddPropertyOptions {
      localizeCategory: boolean;
      localizeProperty: boolean;
      [key: string]: any;
    }

    interface ControlOptions {
      collapsible?: boolean;
      [key: string]: any;
    }

    interface AddControlOptions {
      index?: Object;
      [key: string]: any;
    }

    interface DisplayCategoryOptions {
      localize?: boolean;
      [key: string]: any;
    }

    interface MenuItem {
      title: string;
      target: Function | MenuItem[];
    }

    enum ControlEvents {
      COLLAPSED_CHANGED = 'Control.VisibilityChanged',
      VISIBILITY_CHANGED = 'Control.CollapsedChanged',
      CONTROL_ADDED = 'ControlGroup.ControlAdded',
      CONTROL_REMOVED = 'ControlGroup.ControlRemoved',
      SIZE_CHANGED = 'ControlGroup.SizeChanged',
    }

    class DockingPanel {
      constructor(parentContainer: HTMLElement, id: string, title: string, options?: DockingPanelOptions);

      addEventListener(target: Object, eventId: string, callback: Function): void;
      addVisibilityListener(callback: Function): void;
      createCloseButton(): HTMLElement;
      createScrollContainer(options: ScrollContainerOptions): void;
      createTitleBar(title: string): HTMLElement;
      getContainerBoundingRect(): ClientRect;
      getContentSize(): ContentSize;
      initialize(): void;
      initializeCloseHandler(closer: HTMLElement): void;
      initializeMoveHandlers(mover: HTMLElement): void;
      isVisible(): boolean;
      onEndMove(event: MouseEvent, endX: number, endY: number): void;
      onMove(event: MouseEvent, currentX: number, currentY: number): void;
      onStartMove(event: MouseEvent, startX: number, startY: number): void;
      onTitleClick(event: Event): void;
      onTitleDoubleClick(event: Event): void;
      removeEventListener(target: Object, eventId: string, callback: Function): boolean;
      resizeToContent(options: ResizeOptions): void;
      setTitle(text: string, options: DockingPanelOptions): void;
      setVisible(show: boolean): void;
      uninitialize(): void;
      visibilityChanged(): void;
    }

    class LayersPanel extends DockingPanel {
      build(): void;
      createNode(node: Object, parent: HTMLElement): void;
      getNodeClass(node: Object): string;
      getNodeLabel(node: Object): string;
      isGroupCollapsed(node: Object): boolean;
      isGroupNode(node: Object): boolean;
      onClick(node: Object, event: Event): void;
      onDoubleClick(node: Object, event: Event): void;
      onIconClick(node: Object, event: Event): void;
      onImageClick(node: Object, event: Event): void;
      onRightClick(node: Object, event: Event): void;
      setGroupCollapsed(node: Object, collapse: boolean): void;
      setLayerVisible(node: Object, collapse: boolean): void;
      shouldInclude(node: Object): boolean;
      update(): void;
    }

    class PropertyPanel extends DockingPanel {
      addProperty(name: string, value: string, category: string, options?: AddPropertyOptions): boolean;
      areDefaultPropertiesShown(): void;
      displayCategory(category: Object, parent: HTMLElement, options: DisplayCategoryOptions): HTMLElement[];
      displayProperty(property: Object, parent: HTMLElement, options: DisplayCategoryOptions): HTMLElement[];
      getCategoryClass(category: Object): string;
      getPropertyClass(property: Object): string;
      hasProperties(): boolean;
      highlight(text: string, options: Object): void;
      isCategoryCollapsed(category: Object): boolean;
      onCategoryClick(category: Object, event: Event): void;
      onCategoryDoubleClick(category: Object, event: Event): void;
      onCategoryIconClick(category: Object, event: Event): void;
      onCategoryRightClick(category: Object, event: Event): void;
      onPropertyClick(property: Object, event: Event): void;
      onPropertyDoubleClick(property: Object, event: Event): void;
      onPropertyIconClick(property: Object, event: Event): void;
      onPropertyRightClick(property: Object, event: Event): void;
      removeAllProperties(): void;
      removeProperty(name: string, value: string, category: string, options?: Object): boolean;
      setCategoryCollapsed(category: Object, collapsed: boolean): void;
      setProperties(properties: {displayName: string, displayValue: any}[], options?: Object): void;
      showDefaultProperties(): void;
      showNoProperties(): void;
    }

    class SettingsPanel extends DockingPanel {
      addCheckbox(tabId: string, caption: string, initialState: boolean,
                  onchange: Function, options?: Object): string;
      addControl(tabId: string, control: Object|HTMLElement, options: Object|undefined): string;
      addDropDownMenu(tabId: string, caption: string, items: MenuItem[],
                      initialItemIndex: number, onchange: Function, options: Object|undefined): string;
      addSlider(tabId: string, caption: string, min: number, max: number, initialValue: number,
                onchange: Function, options: Object|undefined): string;
      addTab(tabId: string, tabTitle: string, options: Object|undefined): boolean;
      getControl(controlId: string): Object;
      hasTab(tabId: string): boolean;
      isTabSelected(tabId: string): boolean;
      removeCheckbox(checkboxId: string|Control): boolean;
      removeControl(controlId: string|Control): boolean;
      removeDropdownMenu(dropdownMenuId: string|Control): boolean;
      removeSlider(sliderId: string|Control): boolean;
      removeTab(tabId: string): boolean;
      selectTab(tabId: string): boolean;
      setVisible(show: boolean, skipTransition?: boolean): void;
    }

    class ModelStructurePanel extends DockingPanel {
      addClass(id: string, className: string): boolean;
      getNodeClass(node: Object): string;
      getNodeLabel(node: Object): string;
      isGroupCollapsed(node: Object): boolean;
      isGroupNode(node: Object): boolean;
      onClick(node: Object, event: Event): void;
      onDoubleClick(node: Object, event: Event): void;
      onHover(node: Object, event: Event): void;
      onIconClick(node: Object, event: Event): void;
      onRightClick(node: Object, event: Event): void;
      removeClass(id: string, className: string): boolean;
      setGroupCollapsed(node: Object, collapsed: boolean): void;
      setModel(instanceTree: Object, modelTitle: string): void; // InstanceTree?
      setSelection(nodes: Model[]): void;
      shouldInclude(node: Model): boolean;
    }

    class ObjectContextMenu {
      constructor(viewer: Viewer3D);

      buildMenu(event: Event, status: Object): MenuItem[];
      hide(): boolean;
      show(event: Event): void;
    }

    class Control implements EventTarget {
      constructor(id?: string, options?: ControlOptions);

      addClass(cssClass: string): void;
      getDimensions(): Object;
      getId(): string;
      getPosition(): Object;
      getToolTip(): string;
      isCollapsed(): boolean;
      isCollapsible(): boolean;
      isVisible(): boolean;
      removeClass(cssClass: string): void;
      setCollapsed(collapsed: boolean): boolean;
      setToolTip(toolTipText: string): boolean;
      setVisible(visible: boolean): boolean;

      // Events
      addEventListener(type: ControlEvents, listener?: EventListenerOrEventListenerObject,
                       options?: boolean | AddEventListenerOptions): void;
      dispatchEvent(evt: Event): boolean;
      removeEventListener(type: ControlEvents, listener?: EventListenerOrEventListenerObject,
                          options?: boolean | EventListenerOptions): void;
    }

    class ControlGroup extends Control {
      addControl(control: Control, options?: AddControlOptions): boolean;
      getControl(controlId: string): Control;
      getControlId(index: number): string;
      getNumberOfControls(): number;
      indexOf(control: string|Control): number;
      removeControl(control: string|Control): boolean;
      setCollapsed(collapsed: boolean): boolean;
    }

    class ToolBar extends ControlGroup {
     // Nothing here
    }
  }

  namespace Private {
    const env: string;

    function formatValueWithUnits(value: number, units: string, type: number, precision: number);
    function convertUnits(fromUnits: string, toUnits: string, calibrationFactor: number,
                          d: number, type: string): number;
    function calculatePrecision(value: string|number): number;

    interface PreferencesOptions {
      localStorage?: boolean;
      prefix?: string;
    }

    class Preferences {
      constructor(viewer: Viewer3D, options: PreferencesOptions);

      add(name: string, defaultValue: any, tags?: string[]|string): boolean;
      addListeners(name: string, onChangedCallback: Function, onResetCallback: Function): void;
      get(): any;
      hasTag(name: string, tag: string): boolean;
      load(defaultValues: Object): void;
      remove(name: string, removeFromWebStorage?: boolean): boolean;
      removeListeners(name: string);
      reset(tag?: string, include?: boolean): void;
      set(name: string, value: any, notify?: boolean): boolean;
      tag(tag: string, names?: string[]|string): void;
      untag(tag: string, names?: string[]|string): void;
    }

    class ViewerState {
      constructor(viewer: Viewer3D);

      areEqual(viewerStateA: Object, viewerStateB: Object, filter?: Object): boolean;
      getSeedUrn(): string;
      getState(filter?: Object): Object;
      restoreState(viewerState: Object, filter?: Object, immediate?: boolean): boolean;
    }

    class GuiViewer3D extends Viewer3D {
      addPanel(panel: UI.PropertyPanel): boolean;
      getToolbar(create: boolean): UI.ToolBar;
      removePanel(panel: UI.PropertyPanel): boolean;
      resizePanels(options?: ResizePanelOptions): void;
      setLayersPanel(layersPanel: UI.LayersPanel): boolean;
      setModelStructurePanel(modelStructurePanel: UI.ModelStructurePanel): boolean;
      setPropertyPanel(propertyPanel: UI.PropertyPanel): boolean;
      setSettingsPanel(settingsPanel: UI.SettingsPanel): boolean;
      updateToolbarButtons(): void;
    }
  }
}