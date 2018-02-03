export class BasicExtension extends Autodesk.Viewing.Extension {
  private viewer: Autodesk.Viewing.Viewer3D;
  private extOptions: Autodesk.Viewing.ExtensionOptions;

  static get extensionName() {
    return 'BasicExtension';
  }

  static registerExtension() {
    Autodesk.Viewing.theExtensionManager.registerExtension(BasicExtension.extensionName, BasicExtension);
  }

  static onSelectionEvent(args: Autodesk.Viewing.SelectionChangedEventArgs) {
    console.log('item selected:', args.fragIdsArray, args.dbIdArray, args.nodeArray, args.model);
  }

  constructor(viewer: Autodesk.Viewing.Viewer3D, options: Autodesk.Viewing.ExtensionOptions) {
    super(viewer, options);

    this.viewer = viewer;
    this.extOptions = options;
  }

  load() {
    console.log(BasicExtension.extensionName, 'loaded!');
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,
                                 BasicExtension.onSelectionEvent.bind(this));
    return true;
  }

  unload() {
    this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,
                                    BasicExtension.onSelectionEvent.bind(this));
    console.log(BasicExtension.extensionName, 'unloaded!');
    return true;
  }
}
