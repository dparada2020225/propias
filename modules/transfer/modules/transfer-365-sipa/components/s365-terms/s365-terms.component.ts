import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../../environments/environment';
import { AdfFormBuilderService, ILayout } from '@adf/components';
import { S368dFormService } from '../../services/definition/s368d-form.service';
import { FormGroup } from '@angular/forms';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { AchUniTransferService } from '../../../transfer-ach-uni/services/transaction/ach-uni-transfer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ETMACHTypeTransaction } from '../../../../../transaction-manager/modules/ach/enum/form-control-name.enum';
import { ES365UrlCollection } from '../../enum/url-collection.enum';
import { S365TransferRouteProtected } from '../../enum/route-protected.enum';
import { IS365TermsConditionInfoResponse } from '../../interfaces/transfer.interface';
import { IFlowError } from '../../../../../../models/error.interface';

@Component({
  selector: 'byte-s365-terms',
  templateUrl: './s365-terms.component.html',
  styleUrls: ['./s365-terms.component.scss']
})
export class S365TermsComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  terms: Array<string> = [];
  terms1: Array<string> = [];

  formLayout!: ILayout;
  form!: FormGroup;
  termsConditionInfo: IS365TermsConditionInfoResponse | undefined = undefined;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private translate: TranslateService,
    private adfFormBuilder: AdfFormBuilderService,
    private formLayoutDefinition: S368dFormService,
    public parameterManagement: ParameterManagementService,
    public achUniTransferService: AchUniTransferService,
    private activatedRouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getTermsAndConditionsInfo();

    this.formLayout = this.formLayoutDefinition.buildAcceptTermsAndConditionFormLayout();
    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
    this.setTerms();
    this.utils.hideLoader();
  }

  getTermsAndConditionsInfo() {
    const response = this.activatedRouter.snapshot.data['termsConditionInfo'];

    if (response.hasOwnProperty('error')) {
      this.showAlert('error', (response as IFlowError).message);
      return;
    }

    this.termsConditionInfo = response;
  }


  setTerms() {
    const labelHourSend = this.translate.instant('s365:terms_text_4', {
      value: this.termsConditionInfo?.shippingSchedule ?? ''
    });

    const labelHourReceive = this.translate.instant('s365:terms_text_5', {
      value: this.termsConditionInfo?.receptionSchedule ?? ''
    });

    const labelAmountCommission = this.translate.instant('s365:terms_text_6', {
      value: `${environment.currency} ${this.termsConditionInfo?.refusalFee ?? ''}`
    });

    const labelAmountRejected = this.translate.instant('s365:terms_text_9', {
      value: `${environment.currency} ${this.termsConditionInfo?.surcharge ?? ''}`
    });

    const labelAmountNaturalClient = this.translate.instant('s365:terms_text_14', {
      value: `${environment.currency} ${this.termsConditionInfo?.naturalClientInitialValue ?? ''}`
    });

    const labelAmountLegalClient = this.translate.instant('s365:terms_text_15', {
      value: `${environment.currency} ${this.termsConditionInfo?.legalClientInitialValue ?? ''}`
    });

    this.terms1 = [
      labelHourSend,
      labelHourReceive,
      labelAmountCommission,
      's365:terms_text_7',
      's365:terms_text_8',
      labelAmountRejected,
    ]

    this.terms = [
      's365:terms_text_10',
      's365:terms_text_11',
      's365:terms_text_12',
      's365:terms_text_13',
      labelAmountNaturalClient,
      labelAmountLegalClient,
      's365:terms_text_16',
      's365:terms_text_17',
      's365:terms_text_18',
    ]
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.acceptTermsAndCondition();
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate(['home']).finally(() => {});
  }

  acceptTermsAndCondition() {
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

    this.utils.showLoader();
    this.achUniTransferService.acceptTermsConditions(userInfo.customerCode, ETMACHTypeTransaction.TRANSFER_SIPA).subscribe({
      next: () => {
        this.parameterManagement.sendParameters({
          [PROTECTED_PARAMETER_STATE]: null,
          [PROTECTED_PARAMETER_ROUTE]: S365TransferRouteProtected.HOME,
        });

        this.router.navigate([ES365UrlCollection.HOME]).finally(() => {});
      },
      error: (error: HttpErrorResponse) => {
        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.showAlert('error', error?.error?.errorDescription ? error.error.errorDescription :  error.error.message);
      }
    })
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }


}
