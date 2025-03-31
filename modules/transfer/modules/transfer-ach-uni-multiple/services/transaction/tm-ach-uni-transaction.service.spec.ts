/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TmAchUniTransactionService } from './tm-ach-uni-transaction.service';

describe('Service: TmAchUniTransaction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TmAchUniTransactionService]
    });
  });

  it('should ...', inject([TmAchUniTransactionService], (service: TmAchUniTransactionService) => {
    expect(service).toBeTruthy();
  }));
});
