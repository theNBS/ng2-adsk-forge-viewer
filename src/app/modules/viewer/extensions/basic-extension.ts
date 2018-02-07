interface EventSubscription {
  caller: Object;
  eventName: string;
  callback: (args) => void;
}

export class BasicExtension extends Autodesk.Viewing.Extension {
  private static supscriptions: { [key: string]: EventSubscription[] } = {};

  private viewer: Autodesk.Viewing.Viewer3D;
  private extOptions: Autodesk.Viewing.ExtensionOptions;

  private readonly events: string[] = [
    Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
    Autodesk.Viewing.ANIMATION_READY_EVENT,
    Autodesk.Viewing.CAMERA_CHANGE_EVENT,
    Autodesk.Viewing.CUTPLANES_CHANGE_EVENT,
    Autodesk.Viewing.ESCAPE_EVENT,
    Autodesk.Viewing.EXPLODE_CHANGE_EVENT,
    Autodesk.Viewing.EXTENSION_LOADED_EVENT,
    Autodesk.Viewing.EXTENSION_UNLOADED_EVENT,
    Autodesk.Viewing.FINAL_FRAME_RENDERED_CHANGED_EVENT,
    Autodesk.Viewing.FIT_TO_VIEW_EVENT,
    Autodesk.Viewing.FRAGMENTS_LOADED_EVENT,
    Autodesk.Viewing.FULLSCREEN_MODE_EVENT,
    Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
    Autodesk.Viewing.HIDE_EVENT,
    Autodesk.Viewing.HYPERLINK_EVENT,
    Autodesk.Viewing.ISOLATE_EVENT,
    Autodesk.Viewing.LAYER_VISIBILITY_CHANGED_EVENT,
    Autodesk.Viewing.LOAD_MISSING_GEOMETRY,
    Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT,
    Autodesk.Viewing.MODEL_UNLOADED_EVENT,
    Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT,
    Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
    Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT,
    Autodesk.Viewing.PREF_CHANGED_EVENT,
    Autodesk.Viewing.PREF_RESET_EVENT,
    Autodesk.Viewing.PROGRESS_UPDATE_EVENT,
    Autodesk.Viewing.RENDER_OPTION_CHANGED_EVENT,
    Autodesk.Viewing.RENDER_PRESENTED_EVENT,
    Autodesk.Viewing.RESET_EVENT,
    Autodesk.Viewing.RESTORE_DEFAULT_SETTINGS_EVENT,
    Autodesk.Viewing.SELECTION_CHANGED_EVENT,
    Autodesk.Viewing.SHOW_EVENT,
    Autodesk.Viewing.TEXTURES_LOADED_EVENT,
    Autodesk.Viewing.TOOL_CHANGE_EVENT,
    Autodesk.Viewing.VIEWER_INITIALIZED,
    Autodesk.Viewing.VIEWER_RESIZE_EVENT,
    Autodesk.Viewing.VIEWER_STATE_RESTORED_EVENT,
    Autodesk.Viewing.VIEWER_UNINITIALIZED,
    Autodesk.Viewing.SELECTION_CHANGED_EVENT,
  ];

  static get extensionName() {
    return 'BasicExtension';
  }

  static registerExtension() {
    Autodesk.Viewing.theExtensionManager.registerExtension(BasicExtension.extensionName, BasicExtension);
  }

  static onViewerEvent(args: Autodesk.Viewing.ViewerEventArgs) {
    console.log('Event fired', args);
    BasicExtension.publishEvent(args.type, args);
  }

  static subscribeEvent(caller: Object, eventName: string, callback: (args) => void) {
    const info: EventSubscription = { caller, eventName, callback };

    if (!this.supscriptions[info.eventName]) {
      this.supscriptions[info.eventName] = [];
    }

    const alreadySubscribed = this.supscriptions[info.eventName].find(item => item.caller === info.caller);
    if (!alreadySubscribed) {
      this.supscriptions[info.eventName].push(info);
    }
  }

  static unsubscribeEvent(caller: Object, eventName: string) {
    if (!this.supscriptions[eventName]) return;

    const subscriber = this.supscriptions[eventName].find(item => item.caller === caller);
    if (subscriber) {
      const index = this.supscriptions[eventName].indexOf(subscriber);
      this.supscriptions[eventName].splice(index, 1);
    }
  }

  private static publishEvent(eventName, args) {
    const subscribers: EventSubscription[] = BasicExtension.supscriptions[eventName];
    subscribers.forEach(item => item.callback(args));
  }

  constructor(viewer: Autodesk.Viewing.Viewer3D, options: Autodesk.Viewing.ExtensionOptions) {
    super(viewer, options);

    this.viewer = viewer;
    this.extOptions = options;
  }

  load() {
    this.events.forEach((eventName) => {
      this.viewer.addEventListener(eventName, BasicExtension.onViewerEvent.bind(this));
    });

    console.log(BasicExtension.extensionName, 'loaded!');
    return true;
  }

  unload() {
    this.events.forEach((eventName) => {
      this.viewer.removeEventListener(eventName, BasicExtension.onViewerEvent.bind(this));
    });

    console.log(BasicExtension.extensionName, 'unloaded!');
    return true;
  }
}
