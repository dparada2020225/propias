import { Component, OnInit } from '@angular/core';
import {
  AdfConfirmationModalComponent,
  AdfFormatService,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute
} from '@adf/components';
import { IPrintData, PrintDataBuilder } from '../../../../../transfer/interface/print-data-interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { EAMACHView } from '../../enum/view.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import {
  IAMACHConfirmationDeleteState,
  IAMACHConfirmationState,
  IAMACHConfirmationUpdateState,
  IAMACHHomeSTate,
  IAMACHHomeUpdateState
} from '../../interfaces/state.interface';
import { IAMACHAccountDetail } from '../../interfaces/voucher.interface';
import { AmdAchDetailService } from '../../services/definition/amd-ach-detail.service';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AMAchUrlCollection } from '../../enum/url-collection.enum';
import { AmdAchModalService } from '../../services/definition/amd-ach-modal.service';
import { AmpAchCreateService } from '../../services/print/amp-ach-create.service';
import { TranslateService } from '@ngx-translate/core';
import { Product } from '../../../../../../enums/product.enum';

@Component({
  selector: 'byte-am-ach-voucher',
  templateUrl: './am-ach-voucher.component.html',
  styleUrls: ['./am-ach-voucher.component.scss']
})
export class AmAchVoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;
  pdfData!: Array<IPrintData>;
  headbandLayout: IHeadBandAttribute[] = [];
  view: EAMACHView = EAMACHView.CREATE;
  subtitle = '';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }


  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private voucherDefinitionService: AmdAchDetailService,
    private modalService: NgbModal,
    private modalDefinitionService: AmdAchModalService,
    private pdfCreateService: AmpAchCreateService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];
    this.manageBuildViewVoucher();
    this.utils.hideLoader();
  }

  manageBuildViewVoucher() {
    const mappedView = {
      [EAMACHView.CREATE]: () => this.buildVoucherForCreateOperation(),
      [EAMACHView.DELETE]: () => this.buildVoucherForDeleteOperation(),
      [EAMACHView.UPDATE]: () => this.buildVoucherForUpdateOperation(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  buildVoucherForCreateOperation() {
    this.subtitle = 'ac:ach_subtitle_add_account';
    const state = this.parameterManagement.getParameter<IAMACHHomeSTate>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new IAMACHAccountDetail()
      .typeClient(state.typeClientSelected.name)
      .bankName(state.bankSelected.description)
      .currency(state.currencySelected.currency)
      .typeAccount(state.productSelected.description)
      .account(state.formValues.account)
      .name(state.formValues.name)
      .email(state.formValues.email)
      .typeIdentification(state.documentIdentificationSelected.description)
      .identificationNumber(state.formValues.noIdentifier)
      .reason(state.reasonSelected.name)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
      useUpdateMode: false,
    });

    this.showAlert('success', 'ac:ach_message_add_account');
    this.buildHeadBand();
    this.buildProofModalForAccountCreated();
  }

  buildVoucherForDeleteOperation() {
    const state = this.parameterManagement.getParameter<IAMACHConfirmationDeleteState>(PROTECTED_PARAMETER_STATE);
    const userLabelKey = `ac:ach_label_person_${state.account.clientType.slice(0,1).toLowerCase()}`;
    const accountDetail = new IAMACHAccountDetail()
      .typeClient(this.translate.instant(userLabelKey))
      .bankName(state.account.bankName)
      .currency(state.account.currency)
      .typeAccount(this.utils.getProductNameFromEquivalence(state.account.type).toUpperCase())
      .account(state.account.account)
      .name(state.account.name)
      .email(state.account.email)
      .typeIdentification(state.documentTypeLabel)
      .identificationNumber(state.account.documentNumber)
      .reason('')
      .status(state.account.status ?? '')
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
      useUpdateMode: false,
    }, true);

    this.showAlert('success', 'ac:ach_message_delete_account');
    this.buildHeadBand();
    this.buildProofModalForAccountDeleted();
  }

  buildVoucherForUpdateOperation() {
    const state = this.parameterManagement.getParameter<IAMACHHomeUpdateState>(PROTECTED_PARAMETER_STATE);

    const accountUpdatedDetail = new IAMACHAccountDetail()
      .typeClient((state.account.clientType === 'LEGAL' || state.account.clientType === 'J') ? 'ac:ach_label_person_j' : 'ac:ach_label_person_n')
      .bankName(state.account.bankName)
      .currency(state.account.currency)
      .typeAccount(this.utils.getProductNameFromEquivalence(state.account.type).toUpperCase())
      .account(state.account.account)
      .name(state.formValues.name)
      .email(state.formValues.email)
      .typeIdentification(state.documentTypeLabel)
      .identificationNumber(state.formValues.noIdentifier)
      .reason(state.reasonSelected.name)
      .status(state.account.status ?? '')
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountUpdatedDetail,
      useUpdateMode: true,
    });

    this.subtitle = 'ac:ach_subtitle_update_account_confirm';
    this.showAlert('success', 'ac:ach_message_update_account');
    this.buildHeadBand();
    this.buildProofModalForAccountUpdated();
  }

  buildHeadBand() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAMACHConfirmationState>(PROTECTED_PARAMETER_STATE);

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
      reference: transactionResponse.data.reference,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  buildProofModalForAccountCreated() {
    const state = this.parameterManagement.getParameter<IAMACHConfirmationState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new IAMACHAccountDetail()
      .typeClient(this.translate.instant(state.typeClientSelected.name))
      .bankName(state.bankSelected.description)
      .currency(state.currencySelected.currency)
      .typeAccount(state.productSelected.description)
      .account(state.formValues.account)
      .name(state.formValues.name)
      .email(state.formValues.email)
      .typeIdentification(state.documentIdentificationSelected.description)
      .identificationNumber(state.formValues.noIdentifier)
      .reason(this.translate.instant(state.reasonSelected.name))
      .build();

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountDetail,
      transactionResponse: state.transactionResponse.data,
      useUpdateMode: false,
      title: 'ac:ach_title_proof_modal',
    });

    const { isOwnAccount, ...rest } = accountDetail;

    const keys = {
      typeClient: 'type_client',
      bankName: 'account-bank',
      currency: 'currency',
      typeAccount: 'type_account',
      account: 'no_account',
      email: 'm365:label_email',
      name: 'ach-name',
      typeIdentification: 'ac:label_type_identify',
      identificationNumber: 'ac:label_no_identify',
      reason: 'ac:label_reason',
    }

    this.pdfData = Object.entries(rest).map(([key, value]) => {
      return new PrintDataBuilder()
        .label(keys[key])
        .value(`${value}`)
        .build();
    });
  }

  buildProofModalForAccountUpdated() {
    const state = this.parameterManagement.getParameter<IAMACHConfirmationUpdateState>(PROTECTED_PARAMETER_STATE);
    const typeClient: string = this.translate.instant((state.account.clientType === 'LEGAL' || state.account.clientType === 'J') ? 'ac:ach_label_person_j' : 'ac:ach_label_person_n');

    const accountUpdatedDetail = new IAMACHAccountDetail()
      .typeClient(typeClient)
      .bankName(state.account.bankName)
      .currency(state.account.currency)
      .typeAccount(this.utils.getProductNameFromEquivalence(state.account.type).toUpperCase())
      .account(state.account.account)
      .name(state.formValues.name)
      .email(state.formValues.email)
      .typeIdentification(state.documentTypeLabel)
      .identificationNumber(state.formValues.noIdentifier)
      .reason(this.translate.instant(state.reasonSelected.name))
      .status(state.account.status ?? 'A')
      .build();

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountUpdatedDetail,
      transactionResponse: state.transactionResponse.data,
      useUpdateMode: true,
      title: 'ac:ach_title_update_proof_modal',
    });

    const { isOwnAccount, ...rest } = accountUpdatedDetail;

    const keys = {
      typeClient: 'type_client',
      bankName: 'account-bank',
      currency: 'currency',
      status: 'status',
      typeAccount: 'type_account',
      account: 'no_account',
      email: 'm365:label_email',
      name: 'ach-name',
      typeIdentification: 'ac:label_type_identify',
      identificationNumber: 'ac:label_no_identify',
      reason: 'ac:label_reason',
    }

    this.pdfData = Object.entries(rest).map(([key, value]) => {
      return new PrintDataBuilder()
        .label(keys[key])
        .value(`${value}`)
        .build();
    });
  }

  buildProofModalForAccountDeleted() {
    const state = this.parameterManagement.getParameter<IAMACHConfirmationDeleteState>(PROTECTED_PARAMETER_STATE);
    const userLabelKey = `ac:ach_label_person_${state.account.clientType.slice(0,1).toLowerCase()}`;
    const accountUpdatedDetail = new IAMACHAccountDetail()
      .typeClient(this.translate.instant(userLabelKey))
      .bankName(state.account.bankName)
      .currency(state.account.currency)
      .typeAccount(this.utils.getProductNameFromEquivalence(state.account.type).toUpperCase())
      .account(state.account.account)
      .name(state.account.name)
      .email(state.account.email)
      .typeIdentification(state.documentTypeLabel)
      .identificationNumber(state.account.documentNumber)
      .reason('')
      .status(state.account.status ?? '')
      .build();

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountUpdatedDetail,
      transactionResponse: state.transactionResponse.data,
      useUpdateMode: false,
      title: 'ac:ach_title_delete_proof_modal',
    }, true);

    const { isOwnAccount, ...rest } = accountUpdatedDetail;

    const keys = {
      typeClient: 'type_client',
      bankName: 'account-bank',
      currency: 'currency',
      status: 'status',
      typeAccount: 'type_account',
      account: 'no_account',
      email: 'm365:label_email',
      name: 'ach-name',
      typeIdentification: 'ac:label_type_identify',
      identificationNumber: 'ac:label_no_identify',
      reason: 'ac:label_reason',
    }

    this.pdfData = Object.entries(rest).map(([key, value]) => {
      return new PrintDataBuilder()
        .label(keys[key])
        .value(`${value}`)
        .build();
    });
  }

  openProofModal(): void {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv am-ach`,
      size: `lg`,
    });

    modal.componentInstance.data = this.voucherModalLayout;

    modal.result
      .then((isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }
        this.exportFile();
      })
      .catch((error) => error);
  }

  exportFile() {
    const mappedView = {
      [EAMACHView.CREATE]: () => this.exportFileForCreateOperation(),
      [EAMACHView.DELETE]: () => this.exportFileForDeleteOperation(),
      [EAMACHView.UPDATE]: () => this.exportFileForUpdateOperation(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  exportFileForCreateOperation() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAMACHConfirmationState>(PROTECTED_PARAMETER_STATE);

    const fileName = this.translate.instant('ac:ach_file_name_add_account') + Date.now();
    const reference = transactionResponse.data.reference;
    const title = 'ac:ach_title_proof_modal';
    this.pdfCreateService.pdfGenerate({
      referenceNumber: reference,
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
    }, reference, fileName, 268, title, this.pdfData, true);
  }

  exportFileForUpdateOperation() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAMACHConfirmationUpdateState>(PROTECTED_PARAMETER_STATE);

    const fileName = this.translate.instant('ac:ach_file_name_update_account') + Date.now();
    const reference = transactionResponse.data.reference;
    const title = 'ac:ach_title_update_proof_modal';
    this.pdfCreateService.pdfGenerate({
      referenceNumber: reference,
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
    }, reference, fileName, 268, title, this.pdfData, true);
  }

  exportFileForDeleteOperation() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAMACHConfirmationUpdateState>(PROTECTED_PARAMETER_STATE);

    const fileName = this.translate.instant('ac:ach_file_name_delete_account') + Date.now();
    const reference = transactionResponse.data.reference;
    const title = 'ac:ach_title_delete_proof_modal';
    this.pdfCreateService.pdfGenerate({
      referenceNumber: reference,
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
    }, reference, fileName, 268, title, this.pdfData, true);
  }

  previous() {
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate([AMAchUrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    this.openProofModal();
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
