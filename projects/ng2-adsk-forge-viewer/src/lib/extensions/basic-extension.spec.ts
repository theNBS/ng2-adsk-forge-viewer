// tslint:disable:no-string-literal
import { BasicExtension } from './basic-extension';
import { Extension } from './extension';

describe('BasicExtension', () => {
  let mockExtension: BasicExtension;

  beforeEach(() => {
    mockExtension = new BasicExtension({} as any);
  });

  it('is initialized', () => {
    expect(mockExtension['eventStreams']).toEqual([]);
    expect(mockExtension['events']).toEqual([
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
    ]);
  });

  describe('registerExtension', () => {
    it('calls base class method', () => {
      const spy = spyOn(Extension, 'registerExtension').and.stub();
      const mockCallback = (ext: BasicExtension) => { return; };

      BasicExtension['registerExtension']('', mockCallback);

      expect(spy).toHaveBeenCalled();
      expect(BasicExtension['callback']).toBe(mockCallback);
    });
  });

  describe('load/unload', () => {
    it('loads', (done) => {
      const mockCallback = (ext: BasicExtension) => {
        // Only pass when the callback is called
        done();
      };
      jasmine.createSpy('callbackSpy', mockCallback);

      BasicExtension['callback'] = mockCallback;
      const actual = mockExtension.load();

      expect(mockExtension['eventStreams'].length).toEqual(10);
      expect(mockExtension['viewerEvents']).toBeDefined();
      expect(actual).toBe(true);
    });

    it('unloads', () => {
      const actual = mockExtension.unload();

      expect(mockExtension['eventStreams']).toEqual([]);
      expect(actual).toBe(true);
    });
  });
});
