import { TestBed, inject } from '@angular/core/testing';

import { OverlayFactoryService } from './overlay-factory.service';

describe('OverlayFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverlayFactoryService]
    });
  });

  it('should be created', inject([OverlayFactoryService], (service: OverlayFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
