export class NbsExtension extends Autodesk.Viewing.Extension {
  static get extensionName() {
    return 'NbsExtension';
  }

  static registerExtension() {
    Autodesk.Viewing.theExtensionManager.registerExtension(NbsExtension.extensionName, NbsExtension);
  }

  constructor(viewer: Autodesk.Viewing.Viewer3D, options: Autodesk.Viewing.ExtensionOptions) {
    debugger;
    super(viewer, options);
  }

  load() {
    alert('MyAwesomeExtension is loaded!');
    return true;
  }

  unload() {
    alert('MyAwesomeExtension is now unloaded!');
    return true;
  }
}
