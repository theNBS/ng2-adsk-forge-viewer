interface EventSubscription {
  caller: Object;
  eventName: string;
  callback: (args) => void;
}

export class BasicExtension extends Autodesk.Viewing.Extension {
  private static supscriptions: { [key: string]: EventSubscription[] } = {};

  private viewer: Autodesk.Viewing.Viewer3D;
  private extOptions: Autodesk.Viewing.ExtensionOptions;

  static get extensionName() {
    return 'BasicExtension';
  }

  static registerExtension() {
    Autodesk.Viewing.theExtensionManager.registerExtension(BasicExtension.extensionName, BasicExtension);
  }

  static onViewerSelectionEvent(args: Autodesk.Viewing.SelectionChangedEventArgs) {
    console.log('item selected:', args.fragIdsArray, args.dbIdArray, args.nodeArray, args.model);
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
    console.log(BasicExtension.extensionName, 'loaded!');
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,
                                 BasicExtension.onViewerSelectionEvent.bind(this));
    return true;
  }

  unload() {
    this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,
                                    BasicExtension.onViewerSelectionEvent.bind(this));
    console.log(BasicExtension.extensionName, 'unloaded!');
    return true;
  }
}
