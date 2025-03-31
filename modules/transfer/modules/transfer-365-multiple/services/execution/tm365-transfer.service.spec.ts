import { TestBed } from '@angular/core/testing';

import { Tm365TransferService } from './tm365-transfer.service';

describe('Tm365TransferService', () => {
  let service: Tm365TransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tm365TransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
