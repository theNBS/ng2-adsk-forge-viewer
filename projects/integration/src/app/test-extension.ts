import { Extension } from 'ng2-adsk-forge-viewer';
import { createSimplePanel } from './test-docking-panel';

// tslint:disable-next-line:prefer-const
declare const THREE: any;

export class TestExtension extends Extension {
  // Extension must have a name
  public static extensionName: string = 'TestExtension';

  private subToolbar: Autodesk.Viewing.UI.ToolBar;
  private onToolbarCreatedBinded: any;

  public load() {
    // Called when Forge Viewer loads your extension
    console.log('TestExtension loaded!');

    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (e: Autodesk.Viewing.ViewerEvent) => {
      const dbIdArray = (e as any).dbIdArray;
      if (dbIdArray.length) {
        const dbId = dbIdArray[0];
        this.viewer.setThemingColor(dbId, new THREE.Vector4(0, 1, 1, 1));
      }
    });

    // Initialise a toolbar
    if (this.viewer.toolbar) {
      // Toolbar is already available, create the UI
      this.createUI();
    } else {
      // Toolbar hasn't been created yet, wait until we get notification of its creation
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }

    // Must return true or extension will fail to load
    return true;
  }

  public onToolbarCreated() {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
  }

  public unload() {
    if (this.subToolbar) {
      this.viewer.toolbar.removeControl(this.subToolbar);
      this.subToolbar = null;
    }

    // Called when Forge Viewer unloads your extension
    console.log('TestExtension unloaded.');
    // Must return true or extension will fail to unload
    return true;
  }

  private createUI() {
    // Button 1
    const button1 = new Autodesk.Viewing.UI.Button('my-view-front-button');
    button1.onClick = e => this.setViewCube('front');
    button1.addClass('my-view-front-button');
    button1.setToolTip('View front');

    // Button 2
    const button2 = new Autodesk.Viewing.UI.Button('my-view-back-button');
    button2.onClick = e => this.setViewCube('back');
    button2.addClass('my-view-back-button');
    button2.setToolTip('View Back');

    // Button 3
    const button3 = new Autodesk.Viewing.UI.Button('my-view-panel-button');
    button3.onClick = e => this.displayDockingPanel();
    button3.addClass('my-view-panel-button');
    button3.setToolTip('Docking panel');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-view-toolbar');
    this.subToolbar.addControl(button1);
    this.subToolbar.addControl(button2);
    this.subToolbar.addControl(button3);

    this.viewer.toolbar.addControl(this.subToolbar);
  }

  private setViewCube(orientation: 'front'|'back') {
    const ext = (this.viewer.getExtension('Autodesk.ViewCubeUi') as any);
    ext.setViewCube(orientation);
  }

  private displayDockingPanel() {
    createSimplePanel(
      this.viewer.container as HTMLElement,
      '',
      'Test',
      document.createElement('div'),
      0,
      0,
    );
    // panel.initialize();
    // panel.setVisible(true);
  }
}
