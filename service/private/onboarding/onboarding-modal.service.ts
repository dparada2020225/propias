import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '@adf/security';
import { HomePrivateService } from '../home-private.service';
import { finalize } from 'rxjs/operators';
import { OnboardingModalComponent } from '../../../view/private/onboarding-modal/onboarding-modal.component';
import { environment } from '../../../../environments/environment';
import { IOnBoarding } from '../../../models/onboarding.interface';
import { FeatureManagerService } from '../../common/feature-manager.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingModalService {

  constructor(
    private homePrivateService: HomePrivateService,
    private modalService: NgbModal,
    private storage: StorageService,
    private featureManager: FeatureManagerService,
  ) { }

  validateOnBoarding() {
    if (!this.featureManager.isOnBoardingEnabled) { return; }

    this.executeGetDetailOnBoarding();
  }

  private executeGetDetailOnBoarding() {
    this.homePrivateService.getOnBoardingDetail()
      .pipe(finalize(() => {
        this.storage.addItem('validateOnBoarding', 'false')
      }))
      .subscribe({
        next: (onBoardingDetail) => {
          if (onBoardingDetail.presNotify === 'S') {
            this.openModal(onBoardingDetail);
          }
        },
        error: () => {}
      });
  }

  private openModal(onBoardingDetail: IOnBoarding) {
    const modalRef = this.modalService.open(OnboardingModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modalRef.componentInstance.name = 'OnBoarding';
    modalRef.componentInstance.onBoardingDetail = onBoardingDetail;

    modalRef.dismissed.subscribe(isClosed => {
      if (isClosed === 0) {
        this.homePrivateService.onBoardingLow().subscribe({
          next: () => {},
          error: () => {},
        });
      }
    });

    modalRef.result.then(() => {
    })
      .catch(() => {
      });
  }
}
