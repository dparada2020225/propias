/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TAchUniTransferPdfService } from './t-ach-uni-transfer-pdf.service';

describe('Service: TAchUniTransferPdf', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TAchUniTransferPdfService]
    });
  });

  it('should ...', inject([TAchUniTransferPdfService], (service: TAchUniTransferPdfService) => {
    expect(service).toBeTruthy();
  }));
});
