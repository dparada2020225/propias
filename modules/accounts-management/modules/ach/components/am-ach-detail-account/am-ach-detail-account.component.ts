import { Component, OnInit } from '@angular/core';
import { IDataReading } from '@adf/components';
import { IAMACHDetailState } from '../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { IAMACHAccountDetail } from '../../interfaces/voucher.interface';
import { AMAchUrlCollection } from '../../enum/url-collection.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { AmdAchDetailService } from '../../services/definition/amd-ach-detail.service';
import { IFlowError } from '../../../../../../models/error.interface';
import { IACHBiesGeneralParameters } from '../../../../../../models/ach-general-parameters.interface';
import { AchUniPurpose } from '../../../../../transfer/modules/transfer-ach-uni/interfaces/ach-uni-purpose';
import { Product } from '../../../../../../enums/product.enum';
import { AmACHRouteProtected } from '../../enum/route-protected.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-am-ach-detail-account',
  templateUrl: './am-ach-detail-account.component.html',
  styleUrls: ['./am-ach-detail-account.component.scss']
})
export class AmAchDetailAccountComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  settings!: IACHBiesGeneralParameters;
  purpose: Array<AchUniPurpose> = [];


  voucherLayout!: IDataReading;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private voucherDefinitionService: AmdAchDetailService,
    private activatedRouter: ActivatedRoute,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    this.getGeneralSettings();
    this.getPurposeList();
  }

  getGeneralSettings() {
    const settings = this.activatedRouter.snapshot.data['generalParameters'];

    if (settings.hasOwnProperty('error')) {
      this.showAlert('error', (settings as IFlowError).message);
      return;
    }

    this.settings = settings
  }

  getPurposeList() {
    const purposeResponse = this.activatedRouter.snapshot.data['getPurposeList'];

    if (purposeResponse.hasOwnProperty('error')) {
      this.showAlert('error', (purposeResponse as IFlowError).message);
      return;
    }

    this.purpose = purposeResponse
  }

  initDefinition() {
    const { account } = this.parameterManagement.getParameter<IAMACHDetailState>(PROTECTED_PARAMETER_STATE);
    const { documentTypeLabel } = this.getParameters();

    const accountDetail = new IAMACHAccountDetail()
      .typeClient((account.clientType === 'LEGAL' || account.clientType === 'J') ? 'ac:ach_label_person_j' : 'ac:ach_label_person_n')
      .bankName(account.bankName)
      .typeAccount(this.getProduct(account.type))
      .currency(account.currency)
      .status(account.status ?? '')
      .account(account.account)
      .name(account.name)
      .email(account.email)
      .typeIdentification(documentTypeLabel)
      .identificationNumber(account.documentNumber)
      .reason('')
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
      useUpdateMode: false,
    });
  }

  getProduct(product: string) {
    const hasProduct = Product[product ?? 0];

    if (!hasProduct) return product

    return this.utils.getLabelProduct(Number(Product[product])).toUpperCase()
  }

  getParameters() {
    const { account } = this.parameterManagement.getParameter<IAMACHDetailState>(PROTECTED_PARAMETER_STATE);

    const documentTypeLabel = this.settings.general.listDocuments.find(doc => doc.identificationId === account.documentType);

    return {
      documentTypeLabel: documentTypeLabel?.description ?? '',
    }
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: undefined,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate([AMAchUrlCollection.HOME]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
