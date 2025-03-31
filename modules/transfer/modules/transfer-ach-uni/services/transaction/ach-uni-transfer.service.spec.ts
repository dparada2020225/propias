/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AchUniTransferService } from './ach-uni-transfer.service';

describe('Service: AchUniTransfer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AchUniTransferService]
    });
  });

  it('should ...', inject([AchUniTransferService], (service: AchUniTransferService) => {
    expect(service).toBeTruthy();
  }));
});
