// tslint:disable:no-string-literal
import {
  AggregationSelectionChangedEventArgs,
  AnimationReadyEventArgs,
  CameraChangedEventArgs,
  CutplanesChangedEventArgs,
  EscapeEventArgs,
  ExplodeChangedEventArgs,
  ExtensionLoadedEventArgs,
  ExtensionUnloadedEventArgs,
  FinalFrameRenderedChangedEventArgs,
  FitToViewEventArgs,
  FragmentsLoadedEventArgs,
  FullscreenEventArgs,
  GeometryLoadedEventArgs,
  HideEventArgs,
  HyperlinkEventArgs,
  IsolateEventArgs,
  LayerVisibilityEventArgs,
  LoadMissingGeometryEventArgs,
  ModelRootLoadedEventArgs,
  ModelUnloadedEventArgs,
  NavigationModeChangedEventArgs,
  ObjectTreeCreatedEventArgs,
  ObjectTreeUnavailableEventArgs,
  PrefChangedEventArgs,
  PrefResetEventArgs,
  ProgressUpdateEventArgs,
  RenderOptionChangedEventArgs,
  RenderPresentedEventArgs,
  ResetEventArgs,
  RestoreDefaultSettingsEventArgs,
  SelectionChangedEventArgs,
  ShowEventArgs,
  TexturesLoadedEventArgs,
  ToolChangedEventArgs,
  ViewerInitializedEventArgs,
  ViewerResizeEventArgs,
  ViewerStateRestoredEventArgs,
  ViewerUnInitializedEventArgs,
  Extension,
} from './extension';

class MockExtension extends Extension {
  constructor() {
    super({} as any);
  }

  public load() { return; }
  public unload() { return; }
  public registerEventTypes() { super.registerEventTypes(); }
}

describe('event args', () => {
  it('AggregationSelectionChangedEventArgs has correct type', () => {
    const actual = new AggregationSelectionChangedEventArgs();
    const expected = Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('AnimationReadyEventArgs has correct type', () => {
    const actual = new AnimationReadyEventArgs();
    const expected = Autodesk.Viewing.ANIMATION_READY_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('CameraChangedEventArgs has correct type', () => {
    const actual = new CameraChangedEventArgs();
    const expected = Autodesk.Viewing.CAMERA_CHANGE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('CutplanesChangedEventArgs has correct type', () => {
    const actual = new CutplanesChangedEventArgs();
    const expected = Autodesk.Viewing.CUTPLANES_CHANGE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('EscapeEventArgs has correct type', () => {
    const actual = new EscapeEventArgs();
    const expected = Autodesk.Viewing.ESCAPE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ExplodeChangedEventArgs has correct type', () => {
    const actual = new ExplodeChangedEventArgs();
    const expected = Autodesk.Viewing.EXPLODE_CHANGE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ExtensionLoadedEventArgs has correct type', () => {
    const actual = new ExtensionLoadedEventArgs();
    const expected = Autodesk.Viewing.EXTENSION_LOADED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ExtensionUnloadedEventArgs has correct type', () => {
    const actual = new ExtensionUnloadedEventArgs();
    const expected = Autodesk.Viewing.EXTENSION_UNLOADED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('FinalFrameRenderedChangedEventArgs has correct type', () => {
    const actual = new FinalFrameRenderedChangedEventArgs();
    const expected = Autodesk.Viewing.FINAL_FRAME_RENDERED_CHANGED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('FitToViewEventArgs has correct type', () => {
    const actual = new FitToViewEventArgs();
    const expected = Autodesk.Viewing.FIT_TO_VIEW_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('FragmentsLoadedEventArgs has correct type', () => {
    const actual = new FragmentsLoadedEventArgs();
    const expected = Autodesk.Viewing.FRAGMENTS_LOADED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('FullscreenEventArgs has correct type', () => {
    const actual = new FullscreenEventArgs();
    const expected = Autodesk.Viewing.FULLSCREEN_MODE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('GeometryLoadedEventArgs has correct type', () => {
    const actual = new GeometryLoadedEventArgs();
    const expected = Autodesk.Viewing.GEOMETRY_LOADED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('HideEventArgs has correct type', () => {
    const actual = new HideEventArgs();
    const expected = Autodesk.Viewing.HIDE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('HyperlinkEventArgs has correct type', () => {
    const actual = new HyperlinkEventArgs();
    const expected = Autodesk.Viewing.HYPERLINK_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('IsolateEventArgs has correct type', () => {
    const actual = new IsolateEventArgs();
    const expected = Autodesk.Viewing.ISOLATE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('LayerVisibilityEventArgs has correct type', () => {
    const actual = new LayerVisibilityEventArgs();
    const expected = Autodesk.Viewing.LAYER_VISIBILITY_CHANGED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('LoadMissingGeometryEventArgs has correct type', () => {
    const actual = new LoadMissingGeometryEventArgs();
    const expected = Autodesk.Viewing.LOAD_MISSING_GEOMETRY;

    expect(actual.type).toBe(expected);
  });

  it('ModelRootLoadedEventArgs has correct type', () => {
    const actual = new ModelRootLoadedEventArgs();
    const expected = Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ModelUnloadedEventArgs has correct type', () => {
    const actual = new ModelUnloadedEventArgs();
    const expected = Autodesk.Viewing.MODEL_UNLOADED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('NavigationModeChangedEventArgs has correct type', () => {
    const actual = new NavigationModeChangedEventArgs();
    const expected = Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ObjectTreeCreatedEventArgs has correct type', () => {
    const actual = new ObjectTreeCreatedEventArgs();
    const expected = Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ObjectTreeUnavailableEventArgs has correct type', () => {
    const actual = new ObjectTreeUnavailableEventArgs();
    const expected = Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('PrefChangedEventArgs has correct type', () => {
    const actual = new PrefChangedEventArgs();
    const expected = Autodesk.Viewing.PREF_CHANGED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('PrefResetEventArgs has correct type', () => {
    const actual = new PrefResetEventArgs();
    const expected = Autodesk.Viewing.PREF_RESET_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ProgressUpdateEventArgs has correct type', () => {
    const actual = new ProgressUpdateEventArgs();
    const expected = Autodesk.Viewing.PROGRESS_UPDATE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('RenderOptionChangedEventArgs has correct type', () => {
    const actual = new RenderOptionChangedEventArgs();
    const expected = Autodesk.Viewing.RENDER_OPTION_CHANGED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('RenderPresentedEventArgs has correct type', () => {
    const actual = new RenderPresentedEventArgs();
    const expected = Autodesk.Viewing.RENDER_PRESENTED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ResetEventArgs has correct type', () => {
    const actual = new ResetEventArgs();
    const expected = Autodesk.Viewing.RESET_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('RestoreDefaultSettingsEventArgs has correct type', () => {
    const actual = new RestoreDefaultSettingsEventArgs();
    const expected = Autodesk.Viewing.RESTORE_DEFAULT_SETTINGS_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('SelectionChangedEventArgs has correct type', () => {
    const actual = new SelectionChangedEventArgs();
    const expected = Autodesk.Viewing.SELECTION_CHANGED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ShowEventArgs has correct type', () => {
    const actual = new ShowEventArgs();
    const expected = Autodesk.Viewing.SHOW_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('TexturesLoadedEventArgs has correct type', () => {
    const actual = new TexturesLoadedEventArgs();
    const expected = Autodesk.Viewing.TEXTURES_LOADED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ToolChangedEventArgs has correct type', () => {
    const actual = new ToolChangedEventArgs();
    const expected = Autodesk.Viewing.TOOL_CHANGE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ViewerInitializedEventArgs has correct type', () => {
    const actual = new ViewerInitializedEventArgs();
    const expected = Autodesk.Viewing.VIEWER_INITIALIZED;

    expect(actual.type).toBe(expected);
  });

  it('ViewerResizeEventArgs has correct type', () => {
    const actual = new ViewerResizeEventArgs();
    const expected = Autodesk.Viewing.VIEWER_RESIZE_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ViewerStateRestoredEventArgs has correct type', () => {
    const actual = new ViewerStateRestoredEventArgs();
    const expected = Autodesk.Viewing.VIEWER_STATE_RESTORED_EVENT;

    expect(actual.type).toBe(expected);
  });

  it('ViewerUnInitializedEventArgs has correct type', () => {
    const actual = new ViewerUnInitializedEventArgs();
    const expected = Autodesk.Viewing.VIEWER_UNINITIALIZED;

    expect(actual.type).toBe(expected);
  });
});

describe('Extension', () => {
  const mockExtensionName = 'testExtension';

  beforeEach(() => {
    Extension['extensionName'] = mockExtensionName;
  });

  afterEach(() => {
    Extension['extensionName'] = '';
  });

  it('Registers extension', () => {
    const spy = spyOn(Autodesk.Viewing.theExtensionManager, 'registerExtension').and.stub();
    const mockExtension: Object = { extensionName: mockExtensionName };

    Extension.registerExtension(mockExtensionName, mockExtension);

    expect(spy).toHaveBeenCalledWith(mockExtensionName, mockExtension);
  });

  it('Unregisters extension', () => {
    const spy = spyOn(Autodesk.Viewing.theExtensionManager, 'unregisterExtension').and.stub();

    Extension.unregisterExtension(mockExtensionName);

    expect(spy).toHaveBeenCalledWith(mockExtensionName);
  });

  it('Constructor registers event types', () => {
    spyOn(MockExtension.prototype, 'registerEventTypes').and.callThrough();

    const actual = new MockExtension();
    const keys = Object.keys(actual['eventArgsTypeMap']);

    expect(keys.length).toBe(37);
    expect(keys[0]).toBe(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT);
    expect(keys[36]).toBe(Autodesk.Viewing.VIEWER_UNINITIALIZED);
  });

  describe('castArgs', () => {
    it('casts object', () => {
      const testData = {
        dbIdArray: [1, 2, 3],
        fragIdsArray: [4, 5, 6],
        nodeArray: [7, 8, 9],
        type: Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      };

      const mock = new MockExtension();
      const actual = mock['castArgs'](testData);

      expect(actual instanceof SelectionChangedEventArgs).toBeTruthy();
      expect(actual.dbIdArray).toEqual(testData.dbIdArray);
      expect(actual.fragIdsArray).toEqual(testData.fragIdsArray);
      expect(actual.nodeArray).toEqual(testData.nodeArray);
    });

  });
});
