import { TestBed } from '@angular/core/testing';

import { StknBisvNotAllowedModalService } from './stkn-bisv-not-allowed-modal.service';

describe('StknBisvNotAllowedModalService', () => {
  let service: StknBisvNotAllowedModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StknBisvNotAllowedModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
