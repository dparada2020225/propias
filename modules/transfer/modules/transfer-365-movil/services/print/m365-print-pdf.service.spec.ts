import { TestBed } from '@angular/core/testing';

import { M365PrintPdfService } from './m365-print-pdf.service';

describe('M365PrintPdfService', () => {
  let service: M365PrintPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(M365PrintPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
