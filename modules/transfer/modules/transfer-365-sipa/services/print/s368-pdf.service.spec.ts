import { TestBed } from '@angular/core/testing';

import { S368PdfService } from './s368-pdf.service';

describe('S368PdfService', () => {
  let service: S368PdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S368PdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
