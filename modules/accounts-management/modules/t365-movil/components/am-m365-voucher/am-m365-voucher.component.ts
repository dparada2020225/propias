import { Component, OnInit } from '@angular/core';
import {
  AdfConfirmationModalComponent,
  AdfFormatService,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute
} from '@adf/components';
import { IPrintData, PrintDataBuilder } from '../../../../../transfer/interface/print-data-interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AmpAchCreateService } from '../../../ach/services/print/amp-ach-create.service';
import { TranslateService } from '@ngx-translate/core';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import {
  IAM365ConfirmationDeleteState, IAM365ConfirmationUpdateState,
  IAM365CreateConfirmState,
  IAM365HomeUpdateState
} from '../../interfaces/state.interface';
import { AM365VoucherBuilder } from '../../interfaces/voucher.interface';
import { AmdM365DetailService } from '../../services/definition/amd-m365-detail.service';
import { AmdM365ModalService } from '../../services/definition/amd-m365-modal.service';
import { AMT365View } from '../../enum/view.enum';
import { AM365UrlCollection } from '../../enum/url-collection.enum';
import { IInfoFavorite } from '../../../../../transfer/modules/transfer-third/interfaces/third-transfer.interface';
import { AmM365TransactionService } from '../../services/transaction/am-m365-transaction.service';

@Component({
  selector: 'byte-am-m365-voucher',
  templateUrl: './am-m365-voucher.component.html',
  styleUrls: ['./am-m365-voucher.component.scss']
})
export class AmM365VoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;
  pdfData!: Array<IPrintData>;
  headbandLayout: IHeadBandAttribute[] = [];
  view: AMT365View = AMT365View.CREATE;
  subtitle = '';

  isFavorite: boolean = false;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowFavoriteWidget() {
    return this.view === AMT365View.CREATE;
  }

  get loaderHideService() {
    return () => this.utils.hidePulseLoader();
  }

  get loaderShowService() {
    return () => this.utils.showPulseLoader();
  }

  get addToFavoriteService() {
    return () => this.handleAddAccountToFavorite();
  }

  get removeToFavoriteService() {
    return () => this.handleRemoveAccountToFavorite();
  }


  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private voucherDefinitionService: AmdM365DetailService,
    private modalService: NgbModal,
    private modalDefinitionService: AmdM365ModalService,
    private pdfCreateService: AmpAchCreateService,
    private translate: TranslateService,
    private transactionService: AmM365TransactionService,
  ) { }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];
    this.manageBuildViewVoucher();
    this.utils.hideLoader();
  }

  manageBuildViewVoucher() {
    const mappedView = {
      [AMT365View.CREATE]: () => this.buildVoucherForCreateOperation(),
      [AMT365View.DELETE]: () => this.buildVoucherForDeleteOperation(),
      [AMT365View.UPDATE]: () => this.buildVoucherForUpdateOperation(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  buildVoucherForCreateOperation() {
    this.subtitle = 'ac:365_subtitle_add_account_confirm';
    const state = this.parameterManagement.getParameter<IAM365CreateConfirmState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new AM365VoucherBuilder()
      .bankName(state.bankSelected.description)
      .name(state.formValues.name)
      .email(state.formValues.email)
      .numberPhone(state.formValues.numberPhone)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
    });

    this.showAlert('success', 'ac:ach_message_add_account');
    this.buildHeadBand();
    this.buildProofModalForAccountCreated();
  }

  buildVoucherForDeleteOperation() {
    this.subtitle = 'ac:365_subtitle_delete_account_confirm_voucher';
    const state = this.parameterManagement.getParameter<IAM365ConfirmationDeleteState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new AM365VoucherBuilder()
      .bankName(state.account.bankName)
      .name(state.account.name)
      .email(state.account.email)
      .numberPhone(state.account.account)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
    });

    this.showAlert('success', 'ac:ach_message_delete_account');
    this.buildHeadBand();
    this.buildProofModalForAccountDeleted();
  }

  buildVoucherForUpdateOperation() {
    this.subtitle = 'ac:365_subtitle_update_account_confirm';
    const state = this.parameterManagement.getParameter<IAM365HomeUpdateState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new AM365VoucherBuilder()
      .bankName(state.bankSelected.description)
      .name(state.formValues.name)
      .email(state.formValues.email)
      .numberPhone(state.formValues.numberPhone)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
    });

    this.showAlert('success', 'ac:ach_message_update_account');
    this.buildHeadBand();
    this.buildProofModalForAccountUpdated();
  }

  buildHeadBand() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAM365CreateConfirmState>(PROTECTED_PARAMETER_STATE);

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(transactionResponse.data?.dateTime ?? ''),
      reference: transactionResponse.data?.reference ?? '',
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  buildProofModalForAccountCreated() {
    const state = this.parameterManagement.getParameter<IAM365CreateConfirmState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new AM365VoucherBuilder()
      .numberPhone(state.formValues.numberPhone)
      .name(state.formValues.name)
      .bankName(state.bankSelected.description)
      .email(state.formValues.email)
      .build();

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountDetail,
      transactionResponse: state.transactionResponse.data,
      title: 'ac:365_title_add_account_proof_modal',
    });


    const keys = {
      numberPhone: 'ac:365_label_beneficiary_number_phone',
      name: 'ac:365_label_beneficiary_name',
      bankName: 'account_credit_bank',
      email: 'notify_toEmail',
    }

    this.pdfData = Object.entries(accountDetail).map(([key, value]) => {
      if (keys[key] && value) {
        return new PrintDataBuilder()
          .label(keys[key])
          .value(`${value}`)
          .build();
      }

      return new PrintDataBuilder().build();
    });
  }

  buildProofModalForAccountUpdated() {
    const state = this.parameterManagement.getParameter<IAM365ConfirmationUpdateState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new AM365VoucherBuilder()
      .bankName(state.bankSelected.description)
      .name(state.formValues.name)
      .email(state.formValues.email)
      .numberPhone(state.formValues.numberPhone)
      .build();

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountDetail,
      transactionResponse: state.transactionResponse.data,
      title: 'ac:365_title_update_account_proof_modal',
    });

    const keys = {
      numberPhone: 'ac:365_label_beneficiary_number_phone',
      name: 'ac:365_label_beneficiary_name',
      bankName: 'account_credit_bank',
      email: 'notify_toEmail',
    }

    this.pdfData = Object.entries(accountDetail).map(([key, value]) => {
      if (keys[key] && value) {
        return new PrintDataBuilder()
          .label(keys[key])
          .value(`${value}`)
          .build();
      }

      return new PrintDataBuilder().build();
    });
  }

  buildProofModalForAccountDeleted() {
    const state = this.parameterManagement.getParameter<IAM365ConfirmationDeleteState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new AM365VoucherBuilder()
      .bankName(state.account.bankName)
      .name(state.account.name)
      .email(state.account.email)
      .numberPhone(state.account.account)
      .build();

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountDetail,
      transactionResponse: state.transactionResponse.data,
      title: 'ac:365_title_delete_account_proof_modal',
    });


    const keys = {
      numberPhone: 'ac:365_label_beneficiary_number_phone',
      name: 'ac:365_label_beneficiary_name',
      bankName: 'account_credit_bank',
      email: 'notify_toEmail',
    }

    this.pdfData = Object.entries(accountDetail).map(([key, value]) => {
      if (keys[key] && value) {
        return new PrintDataBuilder()
          .label(keys[key])
          .value(`${value}`)
          .build();
      }

      return new PrintDataBuilder().build();
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
      [AMT365View.CREATE]: () => this.exportFileForCreateOperation(),
      [AMT365View.DELETE]: () => this.exportFileForDeleteOperation(),
      [AMT365View.UPDATE]: () => this.exportFileForUpdateOperation(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  exportFileForCreateOperation() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAM365CreateConfirmState>(PROTECTED_PARAMETER_STATE);

    const fileName = this.translate.instant('ac:365_file_name_add_account') + Date.now();
    const reference = transactionResponse.data?.reference ?? '';
    const title = 'ac:365_title_add_account_proof_modal';
    this.pdfCreateService.pdfGenerate({
      referenceNumber: reference,
      date: this.adfFormat.getFormatDateTime(transactionResponse.data?.dateTime ?? ''),
      use365Pdf: true,
    }, reference, fileName, 268, title, this.pdfData, true);
  }

  exportFileForUpdateOperation() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAM365ConfirmationUpdateState>(PROTECTED_PARAMETER_STATE);

    const fileName = this.translate.instant('ac:365_file_name_update_account') + Date.now();
    const reference = transactionResponse.data.reference;
    const title = 'ac:365_title_update_account_proof_modal';
    this.pdfCreateService.pdfGenerate({
      referenceNumber: reference,
      use365Pdf: true,
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
    }, reference, fileName, 268, title, this.pdfData, true);
  }

  exportFileForDeleteOperation() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAM365ConfirmationDeleteState>(PROTECTED_PARAMETER_STATE);

    const fileName = this.translate.instant('ac:365_file_name_delete_account') + Date.now();
    const reference = transactionResponse.data.reference;
    const title = 'ac:365_title_delete_account_proof_modal';
    this.pdfCreateService.pdfGenerate({
      referenceNumber: reference,
      use365Pdf: true,
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
    }, reference, fileName, 268, title, this.pdfData, true);
  }

  previous() {
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate([AM365UrlCollection.HOME]).finally(() => this.utils.hideLoader());
  }

  nextStep() {
    this.openProofModal();
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  changeInfoAndShowAlert(data: IInfoFavorite) {
    const {favorite, typeAlert, message} = data

    this.isFavorite = favorite;

    if (typeAlert && message) {
      this.typeAlert = typeAlert!;
      this.messageAlert = message!
    }
  }

  handleAddAccountToFavorite() {
    const { formValues } = this.parameterManagement.getParameter<IAM365CreateConfirmState>(PROTECTED_PARAMETER_STATE);

    return this.transactionService.addFavorite(  {
        account: formValues.numberPhone,
        name: String(formValues.bank).padStart(4, '0'),
        properties: {
          bank: formValues.bank,
        }
      });
  }

  handleRemoveAccountToFavorite() {
    const { formValues } = this.parameterManagement.getParameter<IAM365CreateConfirmState>(PROTECTED_PARAMETER_STATE);

    return this.transactionService.deleteFavorite(  {
      account: formValues.numberPhone,
    });
  }
}
