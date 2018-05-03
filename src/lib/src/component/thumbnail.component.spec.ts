import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { instance, mock, when } from 'ts-mockito';

import { ThumbnailComponent } from './thumbnail.component';

describe('ThumbnailComponent', () => {
  let component: ThumbnailComponent;
  let fixture: ComponentFixture<ThumbnailComponent>;

  let mockSanitizer: any;
  
  beforeEach(async(() => {
    mockSanitizer = mock(DomSanitizer);

    return TestBed.configureTestingModule({
      declarations: [
        ThumbnailComponent,
      ],
      providers: [
        { provide: HttpClient, useValue: instance(mock(HttpClient)) },
        { provide: DomSanitizer, useValue: instance(mockSanitizer) },
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
  
  it('getThumbnail', () => {
    fail();
  });

  it('setAccessToken', () => {
    fail();
  });

  it('toBase64 url safe', () => {
    fail();
  });

  it('setImageSrc', () => {
    fail();
  });
});
