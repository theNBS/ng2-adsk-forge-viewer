// tslint:disable:no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';

import { BasicExtension } from '../extensions/basic-extension';
import {
  FitToViewEventArgs,
  FullscreenEventArgs,
  GeometryLoadedEventArgs,
  HideEventArgs,
  IsolateEventArgs,
  ObjectTreeCreatedEventArgs,
  ObjectTreeUnavailableEventArgs,
  ResetEventArgs,
  SelectionChangedEventArgs,
  ShowEventArgs,
  ViewerEventArgs,
} from '../extensions/extension';
import { ScriptService } from '../service/script.service';
import { ViewerComponent, ViewerOptions } from './viewer.component';

const mockScriptS = {
  load: () => Promise.resolve([]),
};

describe('ViewerComponent', () => {
  let component: ViewerComponent;
  let fixture: ComponentFixture<ViewerComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        ViewerComponent,
      ],
      providers: [
        { provide: ScriptService, useValue: mockScriptS },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('viewerOptions', () => {
    let initialiseApplicationSpy: jasmine.Spy;

    beforeEach(() => {
      initialiseApplicationSpy = spyOn(component, 'initialiseApplication' as any).and.stub();
    });

    it('not initialised', () => {
      const testOptions = { headlessViewer: true } as any;

      component.viewerOptions = testOptions;
      expect(component.viewerOptions).toEqual(testOptions);
      expect(initialiseApplicationSpy).toHaveBeenCalled();
    });

    it('not initialised but no options', () => {
      const testOptions = null as any;

      component.viewerOptions = testOptions;
      expect(initialiseApplicationSpy).not.toHaveBeenCalled();
    });

    it('is initialised', () => {
      const testOptions = { headlessViewer: true } as any;

      component['viewerInitialized'] = true;
      component.viewerOptions = testOptions;
      expect(initialiseApplicationSpy).not.toHaveBeenCalled();
    });
  });

  describe('getters/setters', () => {
    let mockViewer: any;
    let mockApp: any;

    beforeEach(() => {
      mockViewer = {
        tearDown: () => { return; },
        uninitialize: () => { return; },
      };

      mockApp = {
        getCurrentViewer: () => {
          return mockViewer;
        },
      };

      component['viewerApp'] = mockApp as any;
    });

    it('gets ViewerApplication', () => {
      const actual = component.ViewerApplication;
      expect(actual).toBe(mockApp);
    });

    it('gets Viewer3D', () => {
      const spy = spyOn(component['viewerApp'], 'getCurrentViewer').and.callThrough();
      const actual = component.Viewer3D;

      expect(spy).toHaveBeenCalled();
      expect(actual).toBe(mockViewer);
    });

    it('gets DocumentId', () => {
      const mockDocId = '123';
      spyOn(component, 'loadDocument' as any).and.stub();
      component.DocumentId = mockDocId;

      const actual = component.DocumentId;
      expect(actual).toBe(mockDocId);
    });

    it('gets basicExtension', () => {
      const ext = new BasicExtension({} as any);
      component['basicExt'] = ext;

      const actual = component.basicExtension;
      expect(actual).toBe(ext);
    });

    it('gets extensionEvents', () => {
      const ext = new BasicExtension({} as any);
      const obs = Observable.of({}) as any;
      ext['viewerEvents'] = obs;
      component['basicExt'] = ext;

      const actual = component.extensionEvents;
      expect(actual).toBe(obs);
    });

    it('sets documentId', () => {
      const mockDocId = '456';
      const spy = spyOn(component, 'loadDocument' as any).and.stub();
      component.DocumentId = mockDocId;

      const actual = component.DocumentId;
      expect(actual).toBe(mockDocId);
      expect(spy).toHaveBeenCalledWith(mockDocId);
    });
  });

  describe('getDefaultViewerOptions', () => {
    it('returns defaults', () => {
      const mockCallback = (onGetAccessToken: (token: string, expire: number) => void) => {
        return '';
      };

      const actual = component.getDefaultViewerOptions(mockCallback);
      const expected = {
        initializerOptions: {
          env: 'AutodeskProduction',
          getAccessToken: mockCallback,
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('document urn', () => {
    it('should append urn prefix', () => {
      const testData = '12345678';

      const expected = `urn:${testData}`;
      const actual = ViewerComponent['verifyUrn'](testData);

      expect(expected).toBe(actual);
    });

    it('should not append urn prefix', () => {
      const testData = 'urn:87654321';

      const expected = testData;
      const actual = ViewerComponent['verifyUrn'](testData);

      expect(expected).toBe(actual);
    });
  });

  describe('extensionLoaded', () => {
    let mockExt: any;
    let mockSubject: Subject<ViewerEventArgs>;

    beforeEach(() => {
      mockSubject = new Subject<ViewerEventArgs>();
      mockExt = {
        viewerEvents: mockSubject.asObservable(),
      };
    });

    it('emits FitToViewEventArgs event', (done) => {
      component.onFitToView.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof FitToViewEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.FIT_TO_VIEW_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new FitToViewEventArgs());
    });

    it('emits FullscreenEventArgs event', (done) => {
      component.onFullscreen.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof FullscreenEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.FULLSCREEN_MODE_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new FullscreenEventArgs());
    });

    it('emits GeometryLoadedEventArgs event', (done) => {
      component.onGeometryLoaded.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof GeometryLoadedEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.GEOMETRY_LOADED_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new GeometryLoadedEventArgs());
    });

    it('emits HideEventArgs event', (done) => {
      component.onHide.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof HideEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.HIDE_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new HideEventArgs());
    });

    it('emits IsolateEventArgs event', (done) => {
      component.onIsolate.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof IsolateEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.ISOLATE_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new IsolateEventArgs());
    });

    it('emits ObjectTreeCreatedEventArgs event', (done) => {
      component.onObjectTreeCreated.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof ObjectTreeCreatedEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new ObjectTreeCreatedEventArgs());
    });

    it('emits ObjectTreeUnavailableEventArgs event', (done) => {
      component.onObjectTreeUnavailable.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof ObjectTreeUnavailableEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new ObjectTreeUnavailableEventArgs());
    });

    it('emits ResetEventArgs event', (done) => {
      component.onReset.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof ResetEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.RESET_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new ResetEventArgs());
    });

    it('emits SelectionChangedEventArgs event', (done) => {
      component.onSelectionChanged.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof SelectionChangedEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.SELECTION_CHANGED_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new SelectionChangedEventArgs());
    });

    it('emits ShowEventArgs event', (done) => {
      component.onShow.subscribe((args: ViewerEventArgs) => {
        expect(args instanceof ShowEventArgs).toBeTruthy();
        expect(args.type).toBe(Autodesk.Viewing.SHOW_EVENT);
        done();
      });

      component['extensionLoaded'](mockExt);
      mockSubject.next(new ShowEventArgs());
    });
  });

  describe('addBasicExtensionConfig', () => {
    it('loads extension', () => {
      const viewerConfig = { } as ViewerOptions;
      component['_viewerOptions'] = viewerConfig;

      const actual = component['addBasicExtensionConfig']('MyExtension');

      expect(actual).toEqual({ extensions: ['MyExtension'] });
    });

    it('loads additional extensions', () => {
      const viewerOptions = {
        headlessViewer: true,
        viewerConfig: {
          extensions: ['AnotherExtension'],
          useConsolidation: true,
        },
      } as ViewerOptions;
      component['_viewerOptions'] = viewerOptions;

      const actual = component['addBasicExtensionConfig']('MyExtension');
      expect(actual).toEqual({ extensions: ['AnotherExtension', 'MyExtension'], useConsolidation: true });
    });
  });
});
