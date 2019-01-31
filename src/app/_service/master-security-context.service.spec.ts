import { TestBed } from '@angular/core/testing';

import { MasterSecurityContextService } from './master-security-context.service';

describe('MasterSecurityContextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MasterSecurityContextService = TestBed.get(MasterSecurityContextService);
    expect(service).toBeTruthy();
  });
});
