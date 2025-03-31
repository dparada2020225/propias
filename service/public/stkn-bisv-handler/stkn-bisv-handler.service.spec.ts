import { TestBed } from '@angular/core/testing';

import { StknBisvHandlerService } from './stkn-bisv-handler.service';

describe('StknBisvHandlerService', () => {
  let service: StknBisvHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StknBisvHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
