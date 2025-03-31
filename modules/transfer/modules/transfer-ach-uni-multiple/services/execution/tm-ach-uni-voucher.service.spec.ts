/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TmAchUniVoucherService } from './tm-ach-uni-voucher.service';

describe('Service: TmAchUniVoucher', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TmAchUniVoucherService]
    });
  });

  it('should ...', inject([TmAchUniVoucherService], (service: TmAchUniVoucherService) => {
    expect(service).toBeTruthy();
  }));
});
