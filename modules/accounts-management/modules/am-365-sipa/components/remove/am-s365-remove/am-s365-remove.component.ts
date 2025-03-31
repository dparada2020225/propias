import { Component, OnInit } from '@angular/core';
import { IDataReading } from '@adf/components';
import { UtilService } from '../../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { AmdS365DetailService } from '../../../services/definition/amd-s365-detail.service';
import {
  IAMS365DetailState,
} from '../../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { S365AccountVoucherBuilder } from '../../../interfaces/voucher.interface';
import { AMS365UrlCollection } from '../../../enum/url-collection.enum';
import { EAMS365RouteProtected } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-s365-remove',
  templateUrl: './am-s365-remove.component.html',
  styleUrls: ['./am-s365-remove.component.scss']
})
export class AmS365RemoveComponent implements OnInit {
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
    private voucherDefinitionService: AmdS365DetailService,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    const {  account } = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new S365AccountVoucherBuilder()
      .typeClient(account.clientType)
      .name(account.name)
      .documentNumber(account.documentNumber)
      .address(account.address)
      .city(account.city)
      .country(account.countryName)
      .bankName(account.bankName)
      .product(+account.accountType)
      .accountNumber(account.account)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherDefinition({
      account: accountDetail,
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: null,
      [PROTECTED_PARAMETER_STATE]: null,
    });

    this.router.navigate([AMS365UrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: state,
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.REMOVE_CONFIRMATION,
    });

    this.router.navigate([AMS365UrlCollection.DELETE_CONFIRMATION]).finally(() => {});
  }
}
