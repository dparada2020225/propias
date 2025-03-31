import { Component, OnInit } from '@angular/core';
import { IT365MHomeState } from '../../interfaces/state.interface';
import { PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { AMT365View } from '../../../t365-movil/enum/view.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ET365MView } from '../../enum/view.enum';
import { IDataReading } from '@adf/components';
import { T365mVoucherService } from '../../services/definition/t365m-voucher.service';
import { ET365MUrlCollection } from '../../enum/url-collection.enum';

@Component({
  selector: 'byte-am-m365-voucher',
  templateUrl: './am-t365m-voucher.component.html',
  styleUrls: ['./am-t365m-voucher.component.scss']
})
export class AmT365mVoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  view: AMT365View = AMT365View.CREATE;
  subtitle = '';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private voucherDefinitionService: T365mVoucherService,
  ) { }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];

    this.manageBuildViewVoucher();
    this.utils.hideLoader();
  }

  manageBuildViewVoucher() {
    const mappedView = {
      [ET365MView.AFFILIATE]: () => this.buildAffiliateVoucherView(),
      [ET365MView.DISAFFILIATE]: () => this.buildDisaffiliateVoucherView(),
      [ET365MView.UPDATE]: () => this.buildUpdateVoucherView(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }


  buildAffiliateVoucherView() {
    const { account, formValues } = this.parameterManagement.getParameter<IT365MHomeState>(PROTECTED_PARAMETER_STATE);
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    this.subtitle = 'ac:m365_subtitle_affiliate_account_confirm';
    this.showAlert('success', 'ac:365m_message_affiliate_account');

    this.voucherLayout = this.voucherDefinitionService.buildVoucherDefinition({
      account,
      formValues,
      email: userInfo.email,
    });
  }

  buildDisaffiliateVoucherView() {
    const { account, formValues } = this.parameterManagement.getParameter<IT365MHomeState>(PROTECTED_PARAMETER_STATE);
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    this.subtitle = 'ac:m365_subtitle_disaffiliate_account_confirm';
    this.showAlert('success', 'ac:365m_message_disaffiliate_account');

    this.voucherLayout = this.voucherDefinitionService.buildVoucherDefinition({
      account,
      formValues,
      email: userInfo.email,
    });
  }

  buildUpdateVoucherView() {
    const { account, formValues } = this.parameterManagement.getParameter<IT365MHomeState>(PROTECTED_PARAMETER_STATE);
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    this.subtitle = 'ac:m365_subtitle_update_affiliation_account_confirm';
    this.showAlert('success', 'ac:365m_message_update_affiliation_account');

    this.voucherLayout = this.voucherDefinitionService.buildVoucherDefinition({
      account,
      formValues,
      email: userInfo.email,
    });
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate([ET365MUrlCollection.HOME]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
