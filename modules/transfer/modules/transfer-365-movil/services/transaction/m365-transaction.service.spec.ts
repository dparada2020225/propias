import { TestBed } from '@angular/core/testing';

import { M365TransactionService } from './m365-transaction.service';

describe('M365TransactionService', () => {
  let service: M365TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(M365TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
