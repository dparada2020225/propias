import { TestBed } from '@angular/core/testing';

import { T365TransactionService } from './t365-transaction.service';

describe('T365TransactionService', () => {
  let service: T365TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(T365TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
