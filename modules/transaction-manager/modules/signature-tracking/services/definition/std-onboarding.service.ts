import { IOnboardingList, OnboardingCoverBuilder, OnboardingItemBuilder } from '@adf/components';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StdOnboardingService {

  constructor() { }

  buildOnBoardingDefinition() {
    const attributes: IOnboardingList = [];

    const coverStep1 = new OnboardingCoverBuilder()
      .desktop('assets/images/private/signature-tracking/onboarding/st-step1-desktop.gif')
      .mobile('assets/images/private/signature-tracking/onboarding/st-step1-mobile.gif')
      .tablet('assets/images/private/signature-tracking/onboarding/st-step1-tablet.gif')
      .build();

    const itemStep1 = new OnboardingItemBuilder()
      .title('label:st_onboarding_step1_title')
      .step(0)
      .description('label:st_onboarding_step1_description')
      .cover(coverStep1)
      .build();
    attributes.push(itemStep1);

    const coverStep2 = new OnboardingCoverBuilder()
      .desktop('assets/images/private/signature-tracking/onboarding/st-step2-desktop.gif')
      .mobile('assets/images/private/signature-tracking/onboarding/st-step2-mobile.gif')
      .tablet('assets/images/private/signature-tracking/onboarding/st-step2-tablet.gif')
      .build();

    const itemStep2 = new OnboardingItemBuilder()
      .title('label:st_onboarding_step2_title')
      .step(1)
      .description('label:st_onboarding_step2_description')
      .cover(coverStep2)
      .build();
    attributes.push(itemStep2);

    const coverStep3 = new OnboardingCoverBuilder()
      .desktop('assets/images/private/signature-tracking/onboarding/st-step3-desktop.gif')
      .mobile('assets/images/private/signature-tracking/onboarding/st-step3-mobile.gif')
      .tablet('assets/images/private/signature-tracking/onboarding/st-step3-tablet.gif')
      .build();

    const itemStep3 = new OnboardingItemBuilder()
      .title('label:st_onboarding_step3_title')
      .step(2)
      .description('label:st_onboarding_step3_description')
      .cover(coverStep3)
      .build();
    attributes.push(itemStep3);

    return attributes;
  }
}
