import { TestBed } from '@angular/core/testing';

import { HotpService } from './hotp.service';

describe('HotpService', () => {
  let service: HotpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Hotp', () => {
    expect(service.getHotp()).toBeDefined();
  })

});
