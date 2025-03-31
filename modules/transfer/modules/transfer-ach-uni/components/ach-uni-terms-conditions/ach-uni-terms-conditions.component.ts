import { Component, OnInit } from '@angular/core';
import { AchUniTransferService } from '../../services/transaction/ach-uni-transfer.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { AchUniTermsConditionResponse } from '../../interfaces/ach-uni-terms-condition-response';
import { AchUniTransferProtectedNavigation, AchUniTransferUrlNavigationCollection } from '../../enums/ach-uni-navigation-parameter.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/service/common/util.service';
import { AchUniStatusTermsResponse } from '../../interfaces/ach-uni-status-terms-response';
import { ETMAchUniView } from '../../../transfer-ach-uni-multiple/enum/ach-uni-view.enum';
import { AchUniTransactionViewMode } from '../../enums/AchUniTransactionViewMode.enum';
import { ETmAchUniProtectedNavigation, ETmAchUniUrlCollection } from '../../../transfer-ach-uni-multiple/enum/ach-uni-url-collection';

@Component({
  selector: 'byte-ach-uni-terms-conditions',
  templateUrl: './ach-uni-terms-conditions.component.html',
  styleUrls: ['./ach-uni-terms-conditions.component.scss']
})
export class AchUniTermsConditionsComponent implements OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  urlUni: string = 'assets/images/logos/SVG_BIES_TOB_UNI_Logo.svg';
  view: string = '';
  storageParameters!: AchUniStatusTermsResponse;

  constructor(private service: AchUniTransferService,
    private storage: ParameterManagementService,
    public utils: UtilService,
    private router: Router,
    private activatedRouter: ActivatedRoute) {}

  ngOnInit(): void {
    this.view = this.activatedRouter.snapshot.data['view'];
    this.storageParameters = this.storage.getParameter('navigateStateParametersTC');

    if(this.isMultiple && this.errorTermsConditions){
      this.showAlert('error', this.storageParameters?.errorDescription);
    }
  }

  nextStep(){
    if(this.isMultiple && this.errorTermsConditions){
      this.storage.sendParameters({
        navigateStateParameters: null,
        navigateStateParametersTC: null,
        navigationProtectedParameter: null,
      });

      this.router.navigate([ETmAchUniUrlCollection.HOME])
        .finally(() => this.utils.hideLoader());

    }else{
      this.service.acceptTermsConditions(this.ClientCode, 'UNI')
      .subscribe({
        next: (response: AchUniTermsConditionResponse) => {
          if(response.errorCode === '0'){
            this.storage.sendParameters({
              navigateStateParameters: null,
              navigateStateParametersTC: response,
              navigationProtectedParameter: this.parameterProtection,
              AcceptedeStateParametersTC: (this.isMultiple) ? response : null
            });
            this.utils.showLoader();
            this.router.navigate([this.toNavigation])
              .finally(() => this.utils.hideLoader());
          }else{
            this.showAlert('error', response?.errorDescription);
          }
        },
        error:(error) => {
          this.showAlert('error', error?.error?.message || error?.errorDescription);
        }
      });
    }
  }

  lastStep(){
    this.storage.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    });
    if(this.isMultiple){
      this.router.navigate(['/home']).finally(() => this.utils.hideLoader());;
    }else{
      this.router.navigate([AchUniTransferUrlNavigationCollection.HOME])
      .finally(() => this.utils.hideLoader());
    }
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  get ClientCode(): string {
    return this.storage.getParameter('userInfo')?.customerCode;
  }

  get isMultiple(): boolean {
    return this.view === ETMAchUniView.TERMS_CONDITION_MULTIPLE;
  }

  get errorTermsConditions(): boolean {
    return this.storageParameters?.result !== 'N' && this.storageParameters?.result !== 'S' && this.isMultiple
  }

  get labelButton(): string {
    return this.errorTermsConditions ? 'tm-ach-uni:retry' : 't.continue';
  }

  get toNavigation(): string {
    return this.isMultiple ? ETmAchUniUrlCollection.HOME : AchUniTransferUrlNavigationCollection.DEFAULT_TRANSACTION;
  }

  get parameterProtection(): string {
    return this.isMultiple ? ETmAchUniProtectedNavigation.TRANSACTION : AchUniTransferProtectedNavigation.TRANSACTION;
  }
}
