import { TestBed, inject } from '@angular/core/testing';

import { ScriptService } from './script.service';

describe('ScriptServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScriptService],
    });
  });

  it('should be created', inject([ScriptService], (service: ScriptService) => {
    expect(service).toBeTruthy();
  }));
});
