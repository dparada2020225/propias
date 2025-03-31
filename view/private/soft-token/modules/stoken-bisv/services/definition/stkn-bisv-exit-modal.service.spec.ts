import { TestBed } from '@angular/core/testing';

import { StknBisvExitModalService } from './stkn-bisv-exit-modal.service';

describe('StknBisvExitModalService', () => {
  let service: StknBisvExitModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StknBisvExitModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
