import { TestBed } from '@angular/core/testing';

import { StknBisvInfoExecService } from './stkn-bisv-info-exec.service';

describe('StknBisvInfoExecService', () => {
  let service: StknBisvInfoExecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StknBisvInfoExecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
