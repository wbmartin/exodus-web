import { TestBed } from '@angular/core/testing';

import { FileStorageAWSService } from './file-storage-aws.service';

describe('FileStorageAWSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileStorageAWSService = TestBed.get(FileStorageAWSService);
    expect(service).toBeTruthy();
  });
});
