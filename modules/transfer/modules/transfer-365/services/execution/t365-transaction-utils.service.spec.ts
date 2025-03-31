import { TestBed } from '@angular/core/testing';

import { T365TransactionUtilsService } from './t365-transaction-utils.service';

describe('T365TransactionUtilsService', () => {
  let service: T365TransactionUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(T365TransactionUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
