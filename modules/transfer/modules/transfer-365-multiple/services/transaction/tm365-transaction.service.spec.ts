import { TestBed } from '@angular/core/testing';

import { Tm365TransactionService } from './tm365-transaction.service';

describe('Tm365TransactionService', () => {
  let service: Tm365TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tm365TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
