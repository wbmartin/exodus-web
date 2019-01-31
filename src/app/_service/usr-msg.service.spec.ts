import { TestBed, inject } from '@angular/core/testing';

import { UsrMsgService } from './usr-msg.service';

describe('UsrMsgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsrMsgService]
    });
  });

  it('should be created', inject([UsrMsgService], (service: UsrMsgService) => {
    expect(service).toBeTruthy();
  }));
});
