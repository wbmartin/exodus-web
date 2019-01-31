import { TestBed, inject } from '@angular/core/testing';

import { UsrMsgHubService } from './usr-msg-hub.service';

describe('UsrMsgHubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsrMsgHubService]
    });
  });

  it('should be created', inject([UsrMsgHubService], (service: UsrMsgHubService) => {
    expect(service).toBeTruthy();
  }));
});
