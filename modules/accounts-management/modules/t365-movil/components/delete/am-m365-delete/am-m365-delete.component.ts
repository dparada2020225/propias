import { Component, OnInit } from '@angular/core';
import { IDataReading } from '@adf/components';
import { UtilService } from '../../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { AmdM365DetailService } from '../../../services/definition/amd-m365-detail.service';
import { IAM365DetailState } from '../../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { AM365VoucherBuilder } from '../../../interfaces/voucher.interface';
import { AM365UrlCollection } from '../../../enum/url-collection.enum';
import { M365RouteProtectedParameters } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-m365-delete',
  templateUrl: './am-m365-delete.component.html',
  styleUrls: ['./am-m365-delete.component.scss']
})
export class AmM365DeleteComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private voucherDefinitionService: AmdM365DetailService,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    const { account } = this.parameterManagement.getParameter<IAM365DetailState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new AM365VoucherBuilder()
      .bankName(account.bankName)
      .name(account.name)
      .email(account.email)
      .numberPhone(account.account)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate([AM365UrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: M365RouteProtectedParameters.DELETE_CONFIRM,
    });

    this.router.navigate([AM365UrlCollection.DELETE_CONFIRMATION]).finally(() => {});
  }
}
