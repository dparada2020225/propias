import { TestBed } from '@angular/core/testing';

import { Tm365FileValidationsService } from './tm365-file-validations.service';

describe('Tm365FileValidationsService', () => {
  let service: Tm365FileValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tm365FileValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
