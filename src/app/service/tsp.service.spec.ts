import { TestBed, inject } from '@angular/core/testing';

import { TspService } from './tsp.service';

describe('TspService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TspService]
    });
  });

  it('should be created', inject([TspService], (service: TspService) => {
    expect(service).toBeTruthy();
  }));
});
