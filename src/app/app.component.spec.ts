import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MockComponent } from 'ng2-mock-component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent({ selector: 'adsk-forge-viewer',
          inputs: ['viewerOptions', 'documentId'],
          outputs: ['onViewerScriptsLoaded', 'onViewingApplicationInitialized'] }),
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
