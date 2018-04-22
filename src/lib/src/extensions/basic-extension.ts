import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/Observable/fromEvent';
import { merge } from 'rxjs/Observable/merge';
import 'rxjs/add/operator/map';

import { Extension, ViewerEventArgs } from './extension';

export class BasicExtension extends Extension {
  public static extensionName: string = 'BasicExtension';
  public static debugMessages: boolean = false;

  private static callback: (ext: BasicExtension) => void = null;

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

  public static registerExtension(callback: (ext: BasicExtension) => void) {
    BasicExtension.callback = callback;
    super.registerExtension(BasicExtension);
  }

  public load() {
    this.events.forEach((eventName) => {
      const obs = fromEvent(this.viewer, eventName).map(args => this.castArgs(args));
      this.eventStreams.push(obs);
    });

    this.viewerEvents = merge(...this.eventStreams);

    if (BasicExtension.debugMessages) console.log(BasicExtension.extensionName, 'loaded!');
    if (BasicExtension.callback) BasicExtension.callback(this);
    return true;
  }

  public unload() {
    this.eventStreams = [];

    if (BasicExtension.debugMessages) console.log(BasicExtension.extensionName, 'unloaded!');
    return true;
  }
}
