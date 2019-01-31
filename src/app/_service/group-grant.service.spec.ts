import { TestBed } from '@angular/core/testing';

import { GroupGrantService } from './group-grant.service';

describe('GroupGrantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupGrantService = TestBed.get(GroupGrantService);
    expect(service).toBeTruthy();
  });
});
