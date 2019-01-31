import { TestBed, inject } from '@angular/core/testing';

import { Log4ngService } from './log4ng.service';

describe('Log4ngService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Log4ngService]
    });
  });

  it('should be created', inject([Log4ngService], (service: Log4ngService) => {
    expect(service).toBeTruthy();
  }));
});
