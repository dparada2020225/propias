import { Component } from '@angular/core';
import { HomePrivateService } from '../../../service/private/home-private.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IOnBoarding } from '../../../models/onboarding.interface';

@Component({
  selector: 'byte-onboarding-modal',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.scss']
})
export class OnboardingModalComponent {
  onBoardingDetail!: IOnBoarding;

  get title() {
    return this.onBoardingDetail?.title ?? 'UNDEFINED';
  }

  get description() {
    if (!this.onBoardingDetail) { return 'UNDEFINED'; }

    const { detail1, detail2, detail3, detail4 } = this.onBoardingDetail ?? {};

    return `${detail1} ${detail2} ${detail3} ${detail4}`;
  }

  get link() {
    if (!this.onBoardingDetail) { return 'UNDEFINED'; }

    return this.onBoardingDetail?.detail5 ?? 'UNDEFINED';
  }

  get url() {
    if (!this.onBoardingDetail) { return 'UNDEFINED'; }

    if (!this.onBoardingDetail?.detail5) { return 'home'; }

    return `https://${this.onBoardingDetail?.detail5}}`
  }

  constructor(
    public activeModal: NgbActiveModal,
    private onboardingService: HomePrivateService,
  ) { }

  close() {
    this.activeModal.close();
    this.onboardingService.onBoardingLow()
      .subscribe({
        next: () => {},
        error: () => {}
      });
  }
}
