import { TestBed, inject } from '@angular/core/testing';

import { SecurityContextAdminService } from './security-context-admin.service';

describe('SecurityContextAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurityContextAdminService]
    });
  });

  it('should be created', inject([SecurityContextAdminService], (service: SecurityContextAdminService) => {
    expect(service).toBeTruthy();
  }));
});
