/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EachUniTransferVoucherService } from './e-ach-uni-transfer-voucher.service';

describe('Service: AchUniTransferVoucher', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EachUniTransferVoucherService]
    });
  });

  it('should ...', inject([EachUniTransferVoucherService], (service: EachUniTransferVoucherService) => {
    expect(service).toBeTruthy();
  }));
});
