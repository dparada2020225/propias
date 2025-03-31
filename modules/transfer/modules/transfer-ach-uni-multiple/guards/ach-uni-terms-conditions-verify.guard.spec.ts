import { TestBed } from '@angular/core/testing';

import { AchUniTermsConditionsVerifyGuard } from './ach-uni-terms-conditions-verify.guard';

describe('AchUniTermsConditionsVerifyGuard', () => {
  let guard: AchUniTermsConditionsVerifyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AchUniTermsConditionsVerifyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
