import { Component, OnInit } from '@angular/core';
import { IDataReading } from '@adf/components';
import { UtilService } from '../../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { AmdAchDetailService } from '../../../services/definition/amd-ach-detail.service';
import { IAMACHDetailState, IAMACHHomeUpdateState } from '../../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { IAMACHAccountDetail } from '../../../interfaces/voucher.interface';
import { AMAchUrlCollection } from '../../../enum/url-collection.enum';
import { Product } from '../../../../../../../enums/product.enum';
import { IFlowError } from '../../../../../../../models/error.interface';
import { IACHBiesGeneralParameters } from '../../../../../../../models/ach-general-parameters.interface';
import { AmACHRouteProtected } from '../../../enum/route-protected.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-ac-ach-delete',
  templateUrl: './ac-ach-delete.component.html',
  styleUrls: ['./ac-ach-delete.component.scss']
})
export class AcAchDeleteComponent implements OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  settings!: IACHBiesGeneralParameters;


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
  }

  getGeneralSettings() {
    const settings = this.activatedRouter.snapshot.data['generalParameters'];

    if (settings.hasOwnProperty('error')) {
      this.showAlert('error', (settings as IFlowError).message);
      return;
    }

    this.settings = settings
  }


  initDefinition() {
    const state = this.parameterManagement.getParameter<IAMACHDetailState>(PROTECTED_PARAMETER_STATE);
    const documentTypeLabel = this.settings.general.listDocuments.find(doc => doc.identificationId === state.account.documentType);
    const userLabelKey = `ac:ach_label_person_${state.account.clientType.slice(0,1).toLowerCase()}`
    const accountDetail = new IAMACHAccountDetail()
      .typeClient(this.translate.instant(userLabelKey))
      .bankName(state.account.bankName)
      .currency(state.account.currency)
      .typeAccount(this.utils.getProductNameFromEquivalence(state.account.type).toUpperCase())
      .account(state.account.account)
      .name(state.account.name)
      .email(state.account.email)
      .typeIdentification(documentTypeLabel?.description ?? '')
      .identificationNumber(state.account.documentNumber)
      .reason('')
      .status(state.account.status ?? '')
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
      useUpdateMode: false,
    }, true);
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });


    this.router.navigate([AMAchUrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    this.utils.showLoader();
    const { account } = this.parameterManagement.getParameter<IAMACHDetailState>(PROTECTED_PARAMETER_STATE);

    const documentTypeLabel = this.settings.general.listDocuments.find(doc => doc.identificationId === account.documentType);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account,
        documentTypeLabel: documentTypeLabel?.description ?? '',
      } as IAMACHHomeUpdateState,
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.REMOVE_CONFIRM,
    });

    this.router.navigate([AMAchUrlCollection.DELETE_CONFIRMATION]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }


}
