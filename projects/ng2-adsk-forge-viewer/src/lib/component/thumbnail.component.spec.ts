// tslint:disable:no-string-literal
import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { ThumbnailComponent, ThumbnailOptions } from './thumbnail.component';

describe('ThumbnailComponent', () => {
  let component: ThumbnailComponent;
  let fixture: ComponentFixture<ThumbnailComponent>;

  let mockOptions: ThumbnailOptions;
  let mockHttpClient: HttpClient;

  beforeEach(async(() => {
    mockHttpClient = mock(HttpClient);

    mockOptions = {
      getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
        return;
      },
      documentId: 'docId',
      width: 100,
      height: 100,
    };

    return TestBed.configureTestingModule({
      declarations: [
        ThumbnailComponent,
      ],
      providers: [
        { provide: HttpClient, useValue: instance(mockHttpClient) },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    let setImageSrcSpy: jasmine.Spy;
    let getThumbnailSpy: jasmine.Spy;

    beforeEach(() => {
      setImageSrcSpy = spyOn(component, 'setImageSrc' as any).and.stub();
      getThumbnailSpy = spyOn(component, 'getThumbnail' as any).and.stub();
    });

    it('Initialises when options are set', () => {
      component.thumbnailOptions = mockOptions;

      // directly call ngOnChanges
      component.ngOnChanges();

      expect(setImageSrcSpy).toHaveBeenCalled();
      expect(getThumbnailSpy).toHaveBeenCalled();
    });

    it('Skips initialisation when no options', () => {
      // directly call ngOnChanges
      component.ngOnChanges();

      expect(setImageSrcSpy).not.toHaveBeenCalled();
      expect(getThumbnailSpy).not.toHaveBeenCalled();
    });
  });

  describe('getThumbnail', () => {
    it('no data', () => {
      const testDocumentId = 'doc123';

      when(mockHttpClient.get(anything(), anything())).thenReturn(of(null));
      const spy = spyOn(component, 'setImageSrc' as any).and.stub();

      component['token'] = '1234';
      component['thumbnailOptions'] = mockOptions;
      fixture.detectChanges();

      component['getThumbnail'](testDocumentId);

      // tslint:disable-next-line:max-line-length
      const expectedUrl = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${testDocumentId}/thumbnail?width=100&height=100`;
      const headers = {
        Authorization: `Bearer ${component['token']}`,
        'Content-Type': 'image/png',
      };

      verify(mockHttpClient.get(expectedUrl, deepEqual({ headers, responseType: 'arraybuffer' }))).called();
      expect(spy).toHaveBeenCalledWith();
    });

    it('data', () => {
      const testDocumentId = 'doc123';

      when(mockHttpClient.get(anything(), anything())).thenReturn(of(new ArrayBuffer(8)));
      const spy = spyOn(component, 'setImageSrc' as any).and.stub();

      component['token'] = '1234';
      component['thumbnailOptions'] = mockOptions;
      fixture.detectChanges();

      component['getThumbnail'](testDocumentId);

      // tslint:disable-next-line:max-line-length
      const expectedUrl = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${testDocumentId}/thumbnail?width=100&height=100`;
      const headers = {
        Authorization: `Bearer ${component['token']}`,
        'Content-Type': 'image/png',
      };

      verify(mockHttpClient.get(expectedUrl, deepEqual({ headers, responseType: 'arraybuffer' }))).called();
      expect(spy).toHaveBeenCalledWith('data:image/png;base64,AAAAAAAAAAA=');
    });
  });

  it('setAccessToken', () => {
    const testAccessToken = 'token-1234';
    const testExpiryTime = 12345;

    component['setAccessToken'](testAccessToken, testExpiryTime);

    expect(component['token']).toBe(testAccessToken);
    expect(component['expire']).toBe(testExpiryTime);
  });

  it('toBase64 url safe', () => {
    const testData = new ArrayBuffer(8);

    const actual = component['toBase64'](testData);
    const expected = 'AAAAAAAAAAA=';

    expect(actual).toBe(expected);
  });

  describe('setImageSrc', () => {
    let bypassSecurityTrustUrlSpy: jasmine.Spy;

    beforeEach(() => {
      bypassSecurityTrustUrlSpy = spyOn(component['sanitizer'], 'bypassSecurityTrustUrl').and.callThrough();
    });

    it('blank src', () => {
      component['thumbnailOptions'] = { defaultImageSrc: 'default' } as any;
      component['setImageSrc']('');

      expect(bypassSecurityTrustUrlSpy).toHaveBeenCalledWith('default');
    });

    it('src', () => {
      component['setImageSrc']('data:image/png;base64,AAAAAAAAAAA=');

      expect(bypassSecurityTrustUrlSpy).toHaveBeenCalledWith('data:image/png;base64,AAAAAAAAAAA=');
    });
  });
});
