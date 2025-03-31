import { TestBed } from '@angular/core/testing';

import { SpplBuilddataTransactionService } from './sppl-builddata-transaction.service';

describe('SpplBuilddataTransactionService', () => {
  let service: SpplBuilddataTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpplBuilddataTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
