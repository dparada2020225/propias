import {TestBed} from '@angular/core/testing';

import {TransactionHistoryService} from './transaction-history.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('TransactionHistoryService', () => {
  let service: TransactionHistoryService;
  let controller: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TransactionHistoryService);
    controller = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    controller.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
