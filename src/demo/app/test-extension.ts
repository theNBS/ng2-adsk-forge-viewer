import { Extension } from 'ng2-adsk-forge-viewer';

// Create a new custom extension
export class TestExtension extends Extension {
  // Extension must have a name
  public static extensionName: string = 'TestExtension';

  public load() {
    console.log('TestExtension is loaded!');
    return true;
  }

  public unload() {
    console.log('TestExtension is now unloaded!');
    return true;
  }
}
