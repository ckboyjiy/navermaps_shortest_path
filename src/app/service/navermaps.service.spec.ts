import { TestBed, inject } from '@angular/core/testing';

import { NavermapsService } from './navermaps.service';

describe('NavermapsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavermapsService]
    });
  });

  it('should be created', inject([NavermapsService], (service: NavermapsService) => {
    expect(service).toBeTruthy();
  }));
});
