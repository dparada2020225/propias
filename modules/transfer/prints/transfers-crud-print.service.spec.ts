/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TransfersCrudPrintService } from './transfers-crud-print.service';

describe('Service: TransfersCrudPrint', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransfersCrudPrintService]
    });
  });

  it('should ...', inject([TransfersCrudPrintService], (service: TransfersCrudPrintService) => {
    expect(service).toBeTruthy();
  }));
});
