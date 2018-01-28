import { TestBed, inject } from '@angular/core/testing';

import { ScriptServiceService } from './script.service';

describe('ScriptServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScriptServiceService]
    });
  });

  it('should be created', inject([ScriptServiceService], (service: ScriptServiceService) => {
    expect(service).toBeTruthy();
  }));
});
