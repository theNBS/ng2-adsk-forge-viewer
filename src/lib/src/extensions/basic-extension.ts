import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/Observable/fromEvent';
import { merge } from 'rxjs/Observable/merge';
import 'rxjs/add/operator/map';

import { Extension, ViewerEventArgs } from './extension';

export class BasicExtension extends Extension {
  public static extensionName: string = 'BasicExtension';

  public viewerEvents: Observable<ViewerEventArgs>;
  protected eventStreams: Observable<ViewerEventArgs>[] = [];

  protected readonly events: string[] = [
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

  public static registerExtension(callback: (ext: Extension) => void) {
    super.registerExtension(BasicExtension, callback);
  }

  public static unregisterExtension() {
    super.unregisterExtension();
  }

  public load() {
    this.events.forEach((eventName) => {
      const obs = fromEvent(this.viewer, eventName).map(args => this.castArgs(args));
      this.eventStreams.push(obs);
    });

    this.viewerEvents = merge(...this.eventStreams);

    console.log(BasicExtension.extensionName, 'loaded!');
    Extension.extLoadedCallback(this);
    return true;
  }

  public unload() {
    this.eventStreams = [];

    console.log(BasicExtension.extensionName, 'unloaded!');
    return true;
  }
}
