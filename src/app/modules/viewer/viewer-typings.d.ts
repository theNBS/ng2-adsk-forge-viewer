/// <reference types="three" />

declare namespace Autodesk.Viewing {
  interface ViewerOptions {
    env?: String;
    getAccessToken?: (cb: Function) => void;
    useADP?: boolean;
    accessToken?: string;
    webGLHelpLink?: string;
    language?: string;
    [key: string]: any;
  }

  interface Viewer3DConfig {
    startOnInitialize?: boolean;
    [key: string]: any;
  }

  interface ViewingApplicationOptions {
    disableBrowserContextMenu?: boolean;
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
    propFilter?: Array<string>;
    ignoreHidden?: boolean;
    [key: string]: any;
  }

  interface ResizePanelOptions {
    dockingPanels?: Array<UI.DockingPanel>;
    viewer?: Viewer3D;
    dimensions?: {
      width: number;
      height: number;
    };
  }

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

  enum Viewer3DEvents {
    AGGREGATE_SELECTION_CHANGED_EVENT = 'aggregateSelection',
    ANIMATION_READY_EVENT = 'animationReady',
    CAMERA_CHANGE_EVENT = 'cameraChanged',
    CUTPLANES_CHANGE_EVENT = 'cutplanesChanged',
    ESCAPE_EVENT = 'escape',
    EXPLODE_CHANGE_EVENT = 'explodeChanged',
    EXTENSION_LOADED_EVENT = 'extensionLoaded',
    EXTENSION_UNLOADED_EVENT = 'extensionUnloaded',
    FINAL_FRAME_RENDERED_CHANGED_EVENT = 'finalFrameRenderedChanged',
    FIT_TO_VIEW_EVENT = 'fitToView',
    FRAGMENTS_LOADED_EVENT = 'fragmentsLoaded',
    FULLSCREEN_MODE_EVENT = 'fullscreenMode',
    GEOMETRY_LOADED_EVENT = 'geometryLoaded',
    HIDE_EVENT = 'hide',
    HYPERLINK_EVENT = 'hyperlink',
    ISOLATE_EVENT = 'isolate',
    LAYER_VISIBILITY_CHANGED_EVENT = 'layerVisibilityChanged',
    LOAD_MISSING_GEOMETRY = 'loadMissingGeometry',
    MODEL_ROOT_LOADED_EVENT = 'modelRootLoaded',
    MODEL_UNLOADED_EVENT = 'modelUnloaded',
    NAVIGATION_MODE_CHANGED_EVENT = 'navigationModeChanged',
    OBJECT_TREE_CREATED_EVENT = 'objectTreeCreated',
    OBJECT_TREE_UNAVAILABLE_EVENT = 'objectTreeUnavailable',
    PREF_CHANGED_EVENT = 'prefChanged',
    PREF_RESET_EVENT = 'prefReset',
    PROGRESS_UPDATE_EVENT = 'progressUpdate',
    RENDER_OPTION_CHANGED_EVENT = 'renderOptionChanged',
    RENDER_PRESENTED_EVENT = 'renderPresented',
    RESET_EVENT = 'reset',
    RESTORE_DEFAULT_SETTINGS_EVENT = 'restoreDefaultSettings',
    SELECTION_CHANGED_EVENT = 'selectionChanged',
    SHOW_EVENT = 'show',
    TEXTURES_LOADED_EVENT = 'texturesLoaded',
    TOOL_CHANGE_EVENT = 'toolChanged',
    VIEWER_INITIALIZED = 'viewerInitialized',
    VIEWER_RESIZE_EVENT = 'viewerResize',
    VIEWER_STATE_RESTORED_EVENT = 'viewerStateRestored',
    VIEWER_UNINITIALIZED = 'viewerUninitialized',
  }

  class BubbleNode {
    constructor(rawNode: Object, parent?: Object);

    parent: Object;
    id: number;
    data: Object;
    isLeaf: boolean;
    sharedPropertyDbPath: string;
    lodNode: Object;
    children: Array<BubbleNode>;

    findByGuid(guid: string): BubbleNode;
    findParentGeom2Dor3D(): BubbleNode;
    findPropertyDbPath(): string;
    findViewableParent(): BubbleNode;
    getLodNode(): boolean;
    getNamedViews(): Array<string>;
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
    search(propsToMatch: Object): Array<BubbleNode>;
    searchByTag(tagsToMatch: Object): Array<BubbleNode>;
    setTag(tag: string, value: any);
    traverse(cb: Function): boolean;
    urn(searchParent: boolean): string;
  }

  function Initializer(options: ViewerOptions, callback: Function);

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

  class Extension {
    constructor(viewer: Viewer3D, options: Object);

    extendLocalization(locales: Object): boolean;
    getCache(): Object;
    getState(viewerState: Object): any;
    load(): boolean;
    restoreState(viewerState: Object, immediate: boolean): boolean;
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
    getBulkProperties(dbIds: Array<number>, options: PropertyOptions, onSuccessCallback: Function, onErrorCallback: Function);
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
    search(text: string, onSuccessCallback: Function, onErrorCallback: Function, attributeNames?: Array<string>): void;
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
    anyLayerHidden(): boolean;
    applyCamera(camera: THREE.Camera, fit?: boolean): void;
    areAllVisible(): boolean;
    clearSelection(): void;
    clearThemingColors(model?: any): void; // RenderModel?
    clientToWorld(clientX: number, clientY: number, ignoreTransparent?: boolean): Object | null;
    createViewCube(): void;
    displayViewCube(display: boolean): void;
    displayViewCubeUI(display: boolean): void;
    explode(scale: number): void;
    finish(): void;
    fitToView(objectIds?: Array<number>|number, model?: Model): void;
    getActiveNavigationTool(): string;
    getAggregateSelection(callback?: Function): Array<Object>;
    getBimWalkToolPopup(): boolean;
    getCamera(): any;
    getClickConfig(what: string, where: string): Array<string> | null;
    getCutPlanes(): Array<Object>;
    getDefaultNavigationToolName(): Object;
    getDimensions(): Object;
    getExplodeScale(): number;
    getFirstPersonToolPopup(): boolean;
    getFocalLength(): number;
    getFOV(): number;
    getHiddenModels(): Array<any>; // Array<RenderModel>;
    getHiddenNodes(): Array<any>;   // Array of nodes
    getIsolatedNodes(): Array<any>; // Array of nodes
    getLayerStates(): Array<any>;
    getMemoryInfo(): any;
    getNavigationLock(): boolean;
    getNavigationLockSettings(): Object;
    getObjectTree(onSuccessCallback?: Function, onErrorCallback?: Function): void;
    getProperties(dbid: number, onSuccessCallback?: Function, onErrorCallback?: Function): void;
    getScreenShot(w?: number, h?: number, cb?: Function): any; // DOMString
    getScreenShotBuffer(w?: number, h?: number, cb?: Function): any;
    getSelection(): Array<number>;
    getSelectionCount(): number;
    getSelectionVisibility(): SelectionVisibility;
    getState(filter?: Object): Object; // Viewer state
    hide(node: Array<number>|number): void;
    hideLines(hide: boolean): void;
    hideModel(modelId: number): boolean;
    hidePoints(hide: boolean): void;
    initialize(): number | ErrorCodes;
    initSettings(): void;
    isLayerVisible(node: Object): boolean;
    isNodeVisible(nodeId: number, model?: Model): boolean;
    isolate(node: Array<number>|number): void;
    isolateById(dbids: Array<number>|number): void;
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
    search(text: string, onSuccessCallback: Function, onErrorCallback: Function, attributeNames?: Array<string>): void;
    select(dbids: Array<number>|number, selectionType: SelectionMode): void;
    setActiveNavigationTool(toolName?: string): boolean;
    setBackgroundColor(red: number, green: number, blue: number, red2: number, green2: number, blue2: number): void;
    setBimWalkToolPopup(value: boolean): void;
    setCanvasClickBehavior(config: Object): void;
    setClickConfig(what: string, where: string, newAction: string|Array<string>): boolean;
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
    setLayerVisible(nodes: Array<any>, visible: boolean, isolate?: boolean): void;
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
    setThemingColor(dbId: number, color: THREE.Vector4, model?: any): void; // RenderModel
    setUseLeftHandedInput(value: boolean): void;
    setUsePivotAlways(value: boolean): void;
    setViewCube(face: string): void;
    setViewFromArray(params: Array<any>): void;
    setViewFromFile(): void;
    setViewFromViewBox(viewbox: Array<any>, name?: string): void;
    setZoomTowardsPivot(value: boolean): void;
    show(node: Array<number>|number): void;
    showAll(): void;
    showModel(modelId: number): boolean;
    start(url?: string, options?: LoadModelOptions, onSuccessCallback?: Function, onErrorCallback?: Function): number|ErrorCodes;
    toggleSelect(dbid: number, selectionType: SelectionMode): void;
    toggleVisibility(node: number): void;
    trackADPSettingsOptions(): void;
    transferModel(): void;
    uninitialize(): void;
    unregisterContextMenuCallback(id: string): boolean;
    worldToClient(point: THREE.Vector3): THREE.Vector3;

    // Events
    addEventListener(type: Viewer3DEvents, listener?: EventListenerOrEventListenerObject,
                     options?: boolean | AddEventListenerOptions): void;
    dispatchEvent(evt: Event): boolean;
    removeEventListener(type: Viewer3DEvents, listener?: EventListenerOrEventListenerObject,
                        options?: boolean | EventListenerOptions): void;
  }

  class ViewingApplication {
    constructor(containerId: string, options?: ViewingApplicationOptions);

    k3D: '3D';
    bubble: BubbleNode;

    addItemSelectedObserver(observer: ItemSelectedObserver): void;
    finish(): void;
    getCurrentViewer(): Viewer3D;
    getDefaultGeometry(geometryItems: Array<any>): Object;
    getNamedViews(item: Object): Array<any>;
    getSelectedItem(): Object|null;
    getViewer(config: Viewer3DConfig): Viewer3D;
    getViewerContainer(): HTMLElement;
    loadDocument(documentId: any,
                 onDocumentLoad?: (document: Document) => void,
                 onLoadFailed?: (errorCode: string, errorMsg: string, errors: Array<any>) => void,
                 accessControlProperties?: Object): void;
    registerViewer(viewableType: string, viewerClass: any, config?: any): void;
    selectItem(item: Object|BubbleNode,
               onSuccessCallback: (item: Object, viewGeometryItem: Object) => void,
               onErrorCallback: Function): boolean;
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
      target: Function | Array<MenuItem>;
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
      displayCategory(category: Object, parent: HTMLElement, options: DisplayCategoryOptions): Array<HTMLElement>;
      displayProperty(property: Object, parent: HTMLElement, options: DisplayCategoryOptions): Array<HTMLElement>;
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
      setProperties(properties: Array<{displayName: string, displayValue: any}>, options?: Object): void;
      showDefaultProperties(): void;
      showNoProperties(): void;
    }

    class SettingsPanel extends DockingPanel {
      addCheckbox(tabId: string, caption: string, initialState: boolean,
                  onchange: Function, options?: Object): string;
      addControl(tabId: string, control: Object|HTMLElement, options: Object|undefined): string;
      addDropDownMenu(tabId: string, caption: string, items: Array<MenuItem>,
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
      setSelection(nodes: Array<Model>): void;
      shouldInclude(node: Model): boolean;
    }

    class ObjectContextMenu {
      constructor(viewer: Viewer3D);

      buildMenu(event: Event, status: Object): Array<MenuItem>;
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
    interface PreferencesOptions {
      localStorage?: boolean;
      prefix?: string;
    }

    class Preferences {
      constructor(viewer: Viewer3D, options: PreferencesOptions);

      add(name: string, defaultValue: any, tags?: Array<string>|string): boolean;
      addListeners(name: string, onChangedCallback: Function, onResetCallback: Function): void;
      get(): any;
      hasTag(name: string, tag: string): boolean;
      load(defaultValues: Object): void;
      remove(name: string, removeFromWebStorage?: boolean): boolean;
      removeListeners(name: string);
      reset(tag?: string, include?: boolean): void;
      set(name: string, value: any, notify?: boolean): boolean;
      tag(tag: string, names?: Array<string>|string): void;
      untag(tag: string, names?: Array<string>|string): void;
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
