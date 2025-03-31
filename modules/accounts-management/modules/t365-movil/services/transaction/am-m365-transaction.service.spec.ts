import { TestBed } from '@angular/core/testing';

import { AmM365TransactionService } from './am-m365-transaction.service';

describe('AmM365TransactionService', () => {
  let service: AmM365TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmM365TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
