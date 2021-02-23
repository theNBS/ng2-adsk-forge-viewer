/// <reference types="forge-viewer" />
export abstract class ViewerEventArgs {
  target?: Autodesk.Viewing.Viewer3D;
  model?: Autodesk.Viewing.ViewerItem;
  type: string;
  [key: string]: any;
}
export class AggregationSelectionChangedEventArgs extends ViewerEventArgs {
  selections: Autodesk.Viewing.ViewerItem[];
  type = Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT;
}
export class AnimationReadyEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.ANIMATION_READY_EVENT;
}
export class CameraChangedEventArgs extends ViewerEventArgs {
  camera: THREE.Camera;
  type = Autodesk.Viewing.CAMERA_CHANGE_EVENT;
}
export class CutplanesChangedEventArgs extends ViewerEventArgs {
  cutplanes: Object[];
  type = Autodesk.Viewing.CUTPLANES_CHANGE_EVENT;
}
export class EscapeEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.ESCAPE_EVENT;
}
export class ExplodeChangedEventArgs extends ViewerEventArgs {
  scale: number;
  type = Autodesk.Viewing.EXPLODE_CHANGE_EVENT;
}
export abstract class ExtensionLoadedUnloadedEventArgs extends ViewerEventArgs {
  extensionId: string;
}
export class ExtensionLoadedEventArgs extends ExtensionLoadedUnloadedEventArgs {
  type = Autodesk.Viewing.EXTENSION_LOADED_EVENT;
}
export class ExtensionUnloadedEventArgs extends ExtensionLoadedUnloadedEventArgs {
  type = Autodesk.Viewing.EXTENSION_UNLOADED_EVENT;
}
export class FinalFrameRenderedChangedEventArgs extends ViewerEventArgs {
  planes: Object[];
  type = Autodesk.Viewing.FINAL_FRAME_RENDERED_CHANGED_EVENT;
}
export class FitToViewEventArgs extends ViewerEventArgs {
  immediate: boolean;
  nodeIdArray: number[];
  type = Autodesk.Viewing.FIT_TO_VIEW_EVENT;
}
export class FragmentsLoadedEventArgs extends ViewerEventArgs {
  getFragIds: () => void;
  data: Object;
  type = Autodesk.Viewing.FRAGMENTS_LOADED_EVENT;
}
export class FullscreenEventArgs extends ViewerEventArgs {
  mode: Autodesk.Viewing.ScreenMode;
  type = Autodesk.Viewing.FULLSCREEN_MODE_EVENT;
}
export class GeometryLoadedEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.GEOMETRY_LOADED_EVENT;
}
export class HideEventArgs extends ViewerEventArgs {
  nodeIdArray: number[];
  type = Autodesk.Viewing.HIDE_EVENT;
}
export class HyperlinkEventArgs extends ViewerEventArgs {
  data: Object; // TODO: Can his be stronger?
  type = Autodesk.Viewing.HYPERLINK_EVENT;
}
export class IsolateEventArgs extends ViewerEventArgs {
  nodeIdArray: number[];
  type = Autodesk.Viewing.ISOLATE_EVENT;
}
export class LayerVisibilityEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.LAYER_VISIBILITY_CHANGED_EVENT;
}
export class LoadMissingGeometryEventArgs extends ViewerEventArgs {
  delay: boolean;
  type = Autodesk.Viewing.LOAD_MISSING_GEOMETRY;
}
export class ModelRootLoadedEventArgs extends ViewerEventArgs {
  svf: Object; // TODO: can this be stronger
  type = Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT;
}
export class ModelUnloadedEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.MODEL_UNLOADED_EVENT;
}
export class NavigationModeChangedEventArgs extends ViewerEventArgs {
  id: string;
  type = Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT;
}
export abstract class ObjectTreeEventArgs extends ViewerEventArgs {
  svf: Object; // TODO: can this be stronger
}
export class ObjectTreeCreatedEventArgs extends ObjectTreeEventArgs {
  type = Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT;
}
export class ObjectTreeUnavailableEventArgs extends ObjectTreeEventArgs {
  type = Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT;
}
export abstract class PrefEventArgs extends ViewerEventArgs {
  name: string;
  value: Object;
}
export class PrefChangedEventArgs extends PrefEventArgs {
  type = Autodesk.Viewing.PREF_CHANGED_EVENT;
}
export class PrefResetEventArgs extends PrefEventArgs {
  type = Autodesk.Viewing.PREF_RESET_EVENT;
}
export class ProgressUpdateEventArgs extends ViewerEventArgs {
  percent: number;
  state: Autodesk.Viewing.ProgressState;
  type = Autodesk.Viewing.PROGRESS_UPDATE_EVENT;
}
export class RenderOptionChangedEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.RENDER_OPTION_CHANGED_EVENT;
}
export class RenderPresentedEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.RENDER_PRESENTED_EVENT;
}
export class ResetEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.RESET_EVENT;
}
export class RestoreDefaultSettingsEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.RESTORE_DEFAULT_SETTINGS_EVENT;
}
export class SelectionChangedEventArgs extends ViewerEventArgs {
  fragIdsArray: number[];
  dbIdArray: number[];
  nodeArray: number[];
  type = Autodesk.Viewing.SELECTION_CHANGED_EVENT;
}
export class ShowEventArgs extends ViewerEventArgs {
  nodeArrayId: number[];
  type = Autodesk.Viewing.SHOW_EVENT;
}
export class TexturesLoadedEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.TEXTURES_LOADED_EVENT;
}
export class ToolChangedEventArgs extends ViewerEventArgs {
  toolName: string;
  tool: Object;
  active: boolean;
  type = Autodesk.Viewing.TOOL_CHANGE_EVENT;
}
export class ViewerInitializedEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.VIEWER_INITIALIZED;
}
export class ViewerResizeEventArgs extends ViewerEventArgs {
  width: number;
  height: number;
  type = Autodesk.Viewing.VIEWER_RESIZE_EVENT;
}
export class ViewerStateRestoredEventArgs extends ViewerEventArgs {
  value: boolean;
  type = Autodesk.Viewing.VIEWER_STATE_RESTORED_EVENT;
}
export class ViewerUnInitializedEventArgs extends ViewerEventArgs {
  type = Autodesk.Viewing.VIEWER_UNINITIALIZED;
}

/**
 * Base extension that all other extensions can inherit from
 */
export abstract class Extension {
  public static extensionName: string = '';

  protected viewer: Autodesk.Viewing.Viewer3D = undefined;
  protected extOptions: Autodesk.Viewing.ExtensionOptions = undefined;

  protected eventArgsTypeMap: { [key: string]: Function } = {};

  public static registerExtension(extensionName: string, extension: Object) {
    Autodesk.Viewing.theExtensionManager.registerExtension(extensionName, extension);
  }

  public static unregisterExtension(extensionName: string) {
    Autodesk.Viewing.theExtensionManager.unregisterExtension(extensionName);
  }

  constructor(viewer: Autodesk.Viewing.Viewer3D,
              options?: Autodesk.Viewing.ExtensionOptions) {
    this.viewer = viewer;
    this.extOptions = options;

    this.registerEventTypes();
  }

  /** Called by Autodesk extension manager when extension is loaded */
  public abstract load(): void;
  /** Called by Autodesk extension manager when extension is unloaded */
  public abstract unload(): void;

  public activate() {
    return true;
  }

  public deactivate() {
    return true;
  }

  /** Register event args types that we will cast to 'proper' objects */
  protected registerEventTypes() {
    // tslint:disable:max-line-length
    this.eventArgsTypeMap[Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT] = AggregationSelectionChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.ANIMATION_READY_EVENT] = AnimationReadyEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.CAMERA_CHANGE_EVENT] = CameraChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.CUTPLANES_CHANGE_EVENT] = CutplanesChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.ESCAPE_EVENT] = EscapeEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.EXPLODE_CHANGE_EVENT] = ExplodeChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.EXTENSION_LOADED_EVENT] = ExtensionLoadedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.EXTENSION_UNLOADED_EVENT] = ExtensionUnloadedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.FINAL_FRAME_RENDERED_CHANGED_EVENT] = FinalFrameRenderedChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.FIT_TO_VIEW_EVENT] = FitToViewEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.FRAGMENTS_LOADED_EVENT] = FragmentsLoadedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.FULLSCREEN_MODE_EVENT] = FullscreenEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.GEOMETRY_LOADED_EVENT] = GeometryLoadedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.HIDE_EVENT] = HideEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.HYPERLINK_EVENT] = HyperlinkEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.ISOLATE_EVENT] = IsolateEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.LAYER_VISIBILITY_CHANGED_EVENT] = LayerVisibilityEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.LOAD_MISSING_GEOMETRY] = LoadMissingGeometryEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT] = ModelRootLoadedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.MODEL_UNLOADED_EVENT] = ModelUnloadedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT] = NavigationModeChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT] = ObjectTreeCreatedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT] = ObjectTreeUnavailableEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.PREF_CHANGED_EVENT] = PrefChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.PREF_RESET_EVENT] = PrefResetEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.PROGRESS_UPDATE_EVENT] = ProgressUpdateEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.RENDER_OPTION_CHANGED_EVENT] = RenderOptionChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.RENDER_PRESENTED_EVENT] = RenderPresentedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.RESET_EVENT] = ResetEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.RESTORE_DEFAULT_SETTINGS_EVENT] = RestoreDefaultSettingsEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.SELECTION_CHANGED_EVENT] = SelectionChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.SHOW_EVENT] = ShowEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.TEXTURES_LOADED_EVENT] = TexturesLoadedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.TOOL_CHANGE_EVENT] = ToolChangedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.VIEWER_INITIALIZED] = ViewerInitializedEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.VIEWER_RESIZE_EVENT] = ViewerResizeEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.VIEWER_STATE_RESTORED_EVENT] = ViewerStateRestoredEventArgs;
    this.eventArgsTypeMap[Autodesk.Viewing.VIEWER_UNINITIALIZED] = ViewerUnInitializedEventArgs;
    // tslint:enable:max-line-length
  }

  /** Cast Viewer event args to class */
  protected castArgs(args: any): any {
    if (Array.isArray(args)) {
      return args.map(this.castArgs);
    }

    if (!args || typeof args !== 'object' || !args.hasOwnProperty('type')) {
      // Can't cast this object
      return args;
    }

    // Create new object of appropriate type
    const clazz = this.eventArgsTypeMap[args.type];
    const typedItem = Object.create(clazz.prototype);

    // Cast any properties
    for (const k of Object.keys(args)) {
      typedItem[k] = this.castArgs(args[k]);
    }

    return typedItem;
  }
}
