import { TestBed } from '@angular/core/testing';

import { BteFileValidationsService } from './bte-file-validations.service';

xdescribe('BteFileValidationsService', () => {
  let service: BteFileValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BteFileValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
