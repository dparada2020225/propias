import { TestBed } from '@angular/core/testing';

import { T365PrintPdfService } from './t365-print-pdf.service';

describe('T365PrintPdfService', () => {
  let service: T365PrintPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(T365PrintPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
