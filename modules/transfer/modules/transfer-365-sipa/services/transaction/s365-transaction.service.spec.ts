import { TestBed } from '@angular/core/testing';

import { S365TransactionService } from './s365-transaction.service';

describe('S365TransactionService', () => {
  let service: S365TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S365TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
