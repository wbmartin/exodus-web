import { TestBed } from '@angular/core/testing';

import { SkipSaveGuardService} from './skip-save-guard.service';

describe('SkipSaveGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SkipSaveGuardService = TestBed.get(SkipSaveGuardService);
    expect(service).toBeTruthy();
  });
});
