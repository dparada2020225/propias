/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EachUniTransferManagerService } from './e-ach-uni-transfer-manager.service';

describe('Service: AchUniTransferManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EachUniTransferManagerService]
    });
  });

  it('should ...', inject([EachUniTransferManagerService], (service: EachUniTransferManagerService) => {
    expect(service).toBeTruthy();
  }));
});
