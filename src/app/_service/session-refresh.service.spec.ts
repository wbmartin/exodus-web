import { TestBed, inject } from '@angular/core/testing';

import { SessionRefreshService } from './session-refresh.service';

describe('SessionRefreshService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionRefreshService]
    });
  });

  it('should be created', inject([SessionRefreshService], (service: SessionRefreshService) => {
    expect(service).toBeTruthy();
  }));
});
