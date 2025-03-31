import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import { AchUniTransferService } from '../../../transfer-ach-uni/services/transaction/ach-uni-transfer.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { ServiceTypeStatusTermsConditions } from '../../../../enum/service-type-status-terms-conditions.enum';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { EM365UrlCollection } from '../../enum/url-collection.enum';
import { S365RouteProtected } from '../../enum/route-protected.enum';

@Component({
  selector: 'byte-m365-terms-condition',
  templateUrl: './m365-terms-condition.component.html',
  styleUrls: ['./m365-terms-condition.component.scss']
})
export class M365TermsConditionComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    public achUniTransferService: AchUniTransferService,
    public parameterManagement: ParameterManagementService,
  ) { }

  ngOnInit(): void {
    this.utils.hideLoader();
  }

  nextStep() {
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

    this.utils.showLoader();
    this.achUniTransferService.acceptTermsConditions(userInfo.customerCode, ServiceTypeStatusTermsConditions.M365).subscribe({
      next: () => {
        this.parameterManagement.sendParameters({
          [PROTECTED_PARAMETER_STATE]: null,
          [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.HOME,
        });

        this.router.navigate([EM365UrlCollection.HOME]).finally(() => {});
      },
      error: (error: HttpErrorResponse) => {
        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.showAlert('error', error?.error?.errorDescription ? error.error.errorDescription :  error.error.message);
      }
    })
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

}
