// tslint:disable:no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerComponent } from './viewer.component';
import { ScriptService } from '../service/script.service';

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
});
