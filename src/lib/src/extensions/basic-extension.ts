interface EventSubscription {
  caller: Object;
  eventName: string;
  callback: (args: any) => void;
}

export class BasicExtension {
  public static extensionName: string = 'BasicExtension';

  // TODO: Refactor to use RxJS -- could be a subject and we could return an observable
  private static supscriptions: { [key: string]: EventSubscription[] } = {};

  private viewer: Autodesk.Viewing.Viewer3D;
  private extOptions: Autodesk.Viewing.ExtensionOptions;

  private readonly events: string[] = [
    Autodesk.Viewing.FIT_TO_VIEW_EVENT,
    Autodesk.Viewing.FULLSCREEN_MODE_EVENT,
    Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
    Autodesk.Viewing.HIDE_EVENT,
    Autodesk.Viewing.ISOLATE_EVENT,
    Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
    Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT,
    Autodesk.Viewing.RESET_EVENT,
    Autodesk.Viewing.SELECTION_CHANGED_EVENT,
    Autodesk.Viewing.SHOW_EVENT,
  ];

  static registerExtension() {
    Autodesk.Viewing.theExtensionManager.registerExtension(this.extensionName, BasicExtension);
  }

  static unregisterExtension() {
    Autodesk.Viewing.theExtensionManager.unregisterExtension(this.extensionName);
  }

  static onViewerEvent(args: Autodesk.Viewing.ViewerEventArgs) {
    // console.log('Event fired', args);
    BasicExtension.publishEvent(args.type, args);
  }

  static subscribeEvent(caller: Object, eventName: string, callback: (args: Autodesk.Viewing.ViewerEventArgs) => void) {
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

  private static publishEvent(eventName: string, args: Autodesk.Viewing.ViewerEventArgs) {
    const subscribers: EventSubscription[] = BasicExtension.supscriptions[eventName];

    if (!subscribers || subscribers.length === 0) return;
    subscribers.forEach(item => item.callback(args));
  }

  constructor(viewer: Autodesk.Viewing.Viewer3D, options: Autodesk.Viewing.ExtensionOptions) {
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
