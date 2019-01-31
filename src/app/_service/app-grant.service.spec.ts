import { TestBed } from '@angular/core/testing';

import { AppGrantService } from './app-grant.service';

describe('AppGrantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppGrantService = TestBed.get(AppGrantService);
    expect(service).toBeTruthy();
  });
});
