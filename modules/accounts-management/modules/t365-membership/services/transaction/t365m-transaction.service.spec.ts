import { TestBed } from '@angular/core/testing';

import { T365mTransactionService } from './t365m-transaction.service';

describe('T365mTransactionService', () => {
  let service: T365mTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(T365mTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
