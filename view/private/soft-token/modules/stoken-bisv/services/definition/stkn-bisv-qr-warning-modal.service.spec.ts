import { TestBed } from '@angular/core/testing';

import { StknBisvQrWarningModalService } from './stkn-bisv-qr-warning-modal.service';

describe('StknBipaQrWarningModalService', () => {
  let service: StknBisvQrWarningModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StknBisvQrWarningModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
