import { TestBed, inject } from '@angular/core/testing';

import { AuthRouteGuardService } from './auth-route-guard.service';

describe('AuthRouteGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthRouteGuardService]
    });
  });

  it('should be created', inject([AuthRouteGuardService], (service: AuthRouteGuardService) => {
    expect(service).toBeTruthy();
  }));
});
