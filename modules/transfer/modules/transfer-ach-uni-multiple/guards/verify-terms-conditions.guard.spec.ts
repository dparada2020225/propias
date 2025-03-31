import { TestBed } from '@angular/core/testing';

import { VerifyTermsConditionsGuard } from './verify-terms-conditions.guard';

describe('VerifyTermsConditionsGuard', () => {
  let guard: VerifyTermsConditionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerifyTermsConditionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
