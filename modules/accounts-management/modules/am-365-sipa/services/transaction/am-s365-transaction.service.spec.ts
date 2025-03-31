import { TestBed } from '@angular/core/testing';

import { AmS365TransactionService } from './am-s365-transaction.service';

describe('AmS365TransactionService', () => {
  let service: AmS365TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmS365TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
