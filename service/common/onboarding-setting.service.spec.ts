import { TestBed } from '@angular/core/testing';

import { OnboardingSettingService } from './onboarding-setting.service';

describe('OnboardingSettingService', () => {
  let service: OnboardingSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardingSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
