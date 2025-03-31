/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TAchUniTransferVoucherService } from './t-ach-uni-transfer-voucher.service';

describe('Service: TAchUniTransferVoucher', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TAchUniTransferVoucherService]
    });
  });

  it('should ...', inject([TAchUniTransferVoucherService], (service: TAchUniTransferVoucherService) => {
    expect(service).toBeTruthy();
  }));
});
