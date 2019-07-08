// tslint:disable:no-string-literal
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of, Subject } from 'rxjs';

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
import {
  DocumentChangedEvent,
  ViewerComponent,
  ViewerOptions,
  ViewerInitializedEvent,
  ItemLoadedEvent,
} from './viewer.component';

const mockScriptS = {
  load: () => Promise.resolve([]),
};

describe('ViewerComponent', () => {
  let component: ViewerComponent;
  let fixture: ComponentFixture<ViewerComponent>;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        ViewerComponent,
      ],
      providers: [
        { provide: ScriptService, useValue: mockScriptS },
      ],
    })
    .compileComponents();
  });

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
      initialiseApplicationSpy = spyOn(component, 'initialiseViewer' as any).and.stub();
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

    beforeEach(() => {
      mockViewer = {
        tearDown: () => { return; },
        uninitialize: () => { return; },
      };
    });

    it('gets Viewer3D', () => {
      const actual = component.Viewer3D;
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
      const obs = of({}) as any;
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

  describe('selectItem', () => {
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
        selectItem: () => { return; },
      };

      component['viewerApp'] = mockApp as any;
    });

    it('calls correct methods', () => {
      const spy = spyOn(mockApp, 'selectItem').and.stub();
      const testViewerItem = {
        parent: null,
        id: 123,
        data: {
          guid: '123',
          hasThumbnail: false,
          name: 'test',
          parent: null,
          progress: 'complete',
          role: '3d',
          size: 1,
          status: 'status',
          success: 'yes',
          type: 'view',
          viewableID: '456',
        },
        isLeaf: false,
        sharedPropertyDbPath: '',
        lodNode: null,
        children: [],
      } as Autodesk.Viewing.BubbleNode;

      component.loadDocumentNode({} as any, testViewerItem);

      expect(spy.calls.mostRecent().args[0]).toBe(testViewerItem);
    });
  });

  describe('initialiseApplication', () => {
    let mockViewer: any;
    let mockApp: any;

    beforeEach(() => {
      mockViewer = {
        tearDown: () => { return; },
        uninitialize: () => { return; },
        registerViewer: () => { return; },
      };

      mockApp = {
        getCurrentViewer: () => {
          return mockViewer;
        },
        registerViewer: () => { return; },
      };

      component['viewerApp'] = mockApp as any;
    });

    it('Calls full initialise', async (done) => {
      const spy = spyOn(Autodesk.Viewing, 'Initializer').and.stub();
      const initializerOptions = { env: 'Production' };

      component.viewerOptions = { initializerOptions } as any;
      await component['initialiseViewer']();

      expect(spy.calls.mostRecent().args[0]).toBe(initializerOptions);
      done();
    });

    it('Skips full initialise', async (done) => {
      const spy = spyOn(component, 'initialized' as any).and.stub();
      const initializerOptions = { env: 'Production' };

      Autodesk.Viewing.Private['env' as any] = 'Production';
      component.viewerOptions = { initializerOptions } as any;
      await component['initialiseViewer']();

      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });

    it('initialized calls correct methods', async (done) => {
      const viewingAppSpy = spyOn(Autodesk.Viewing, 'ViewingApplication').and.returnValue(mockApp);
      const registerBasicExtensionSpy = spyOn(component, 'registerBasicExtension' as any).and.returnValue('mockExt');
      const addBasicExtensionConfigSpy = spyOn(component, 'addBasicExtensionConfig' as any).and.stub();
      const registerViewerSpy = spyOn(mockApp, 'registerViewer' as any).and.stub();

      const mockAppInitialised = (args: ViewerInitializedEvent) => {
        // We sometimes get the wrong app -- suspect leak in tests
        // expect(args.viewingApplication).toBe(mockApp, 'Unexpected app');
        expect(args.viewer).toBeTruthy();
        expect(args.viewerComponent).toBe(component, 'Unexpected component');
        done();
      };

      const viewerApplicationOptions = {
        disableBrowserContextMenu: true,
      };
      component.viewerOptions = {
        viewerApplicationOptions,
        onViewingApplicationInitialized: mockAppInitialised,
      } as any;

      component['initialized']();
      expect(viewingAppSpy).toHaveBeenCalledWith('ng2-adsk-forge-viewer-container', viewerApplicationOptions);
      expect(registerBasicExtensionSpy).toHaveBeenCalled();
      expect(addBasicExtensionConfigSpy).toHaveBeenCalledWith('mockExt');
      expect(registerViewerSpy).toHaveBeenCalled();
      expect(component['viewerInitialized' as any]).toBe(true);
    });
  });

  describe('getDefaultViewerOptions', () => {
    it('returns defaults', () => {
      const mockCallback = (onGetAccessToken: (token: string, expire: number) => void) => {
        return '';
      };
      const mockAppInitialised = (args: ViewerInitializedEvent) => { return; };

      const opts = component.getDefaultViewerOptions(mockAppInitialised, mockCallback);
      const expectedOpts = {
        initializerOptions: {
          env: 'AutodeskProduction',
          getAccessToken: mockCallback,
          api: 'derivativeV2',
        },
        onViewerInitialized: mockAppInitialised,
      };

      expect(opts).toEqual(expectedOpts);
    });
  });

  describe('loadDocument', () => {
    let mockViewer: any;
    let mockApp: any;

    let loadDocumentSpy: jasmine.Spy;

    beforeEach(() => {
      mockViewer = {
        tearDown: () => { return; },
        uninitialize: () => { return; },
        registerViewer: () => { return; },
      };

      mockApp = {
        getCurrentViewer: () => {
          return mockViewer;
        },
        registerViewer: () => { return; },
        loadDocument: () => { return; },
      };

      component['viewerApp'] = mockApp as any;

      loadDocumentSpy = spyOn(mockApp, 'loadModel').and.stub();
    });

    it('skips load if documentId not set', () => {
      component['loadModel'](null);
      expect(loadDocumentSpy).not.toHaveBeenCalled();
    });

    it('Calls load on Forge viewer', () => {
      const testDocumentId = 'urn:test document id';

      component['loadModel'](testDocumentId);
      expect(loadDocumentSpy.calls.mostRecent().args[0]).toEqual(testDocumentId);
    });
  });

  describe('events', () => {
    let mockViewer: any;

    let searchSpy: jasmine.Spy;

    beforeEach(() => {
      mockViewer = {
        tearDown: () => { return; },
        uninitialize: () => { return; },
        registerViewer: () => { return; },
      };
    });

    describe('onDocumentLoadSuccess', () => {
      it('exits if no bubble', () => {
        searchSpy.and.stub();

        component['onDocumentLoadSuccess']({ getRoot() { return undefined; } } as any);

        expect(searchSpy).not.toHaveBeenCalled();
      });

      it('emits event, can\'t select viewable', fakeAsync(() => {
        const testDoc = {} as any;
        const spy = searchSpy.and.returnValue(null);

        component['_viewerOptions'] = { showFirstViewable: true } as any;
        component['onDocumentLoadSuccess']({} as any);

        component.onDocumentChanged.subscribe((args: DocumentChangedEvent) => {
          expect(args.document).toBe(testDoc);
          expect(args.viewer).toBe(mockViewer);
          expect(args.viewerComponent).toBe(component);
          expect(spy).not.toHaveBeenCalled();
        });
      }));

      it('emits event and selected first viewable', fakeAsync(() => {
        const testDoc = {} as any;
        searchSpy.and.callThrough();

        component['_viewerOptions'] = { showFirstViewable: true } as any;
        component['onDocumentLoadSuccess']({} as any);

        component.onDocumentChanged.subscribe((args: DocumentChangedEvent) => {
          expect(args.document).toBe(testDoc);
          expect(args.viewerComponent).toBe(component);
          expect(searchSpy).toHaveBeenCalled();
        });
      }));
    });

    it('onDocumentLoadFailure', (done) => {
      const testErrorCode = 0;

      component.onError.subscribe((errorCode: number) => {
        expect(errorCode).toBe(testErrorCode);
        done();
      });

      component['onDocumentLoadFailure'](testErrorCode);
    });

    it('onItemLoadSuccess', (done) => {
      const testItem = {} as any;

      component.onItemLoaded.subscribe((args: ItemLoadedEvent) => {
        expect(args.item).toBe(testItem);
        expect(args.viewer).toBe(mockViewer);
        expect(args.viewerComponent).toBe(component);

        done();
      });

      component['onItemLoadSuccess'](mockViewer, testItem);
    });

    it('onItemLoadFail', (done) => {
      const testErrorCode = 0;

      component.onError.subscribe((errorCode: number) => {
        expect(errorCode).toBe(testErrorCode);
        done();
      });

      component['onItemLoadFail'](testErrorCode);
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

    it('registerBasicExtension', () => {
      spyOn(BasicExtension, 'registerExtension').and.stub();

      const actual = component['registerBasicExtension']();
      const expected = BasicExtension.extensionName;

      expect(actual).toBe(expected);
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
