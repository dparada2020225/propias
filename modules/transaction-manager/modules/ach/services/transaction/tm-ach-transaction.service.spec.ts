import { TestBed } from '@angular/core/testing';

import { TmAchTransactionService } from './tm-ach-transaction.service';

describe('TmAchTransactionService', () => {
  let service: TmAchTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmAchTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
