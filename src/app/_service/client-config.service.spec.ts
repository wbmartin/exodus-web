import { TestBed } from '@angular/core/testing';

import { ClientConfigService } from './client-config.service';

describe('ClientConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientConfigService = TestBed.get(ClientConfigService);
    expect(service).toBeTruthy();
  });
});
