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
import { EAMS365View } from '../../enum/view.enum';
import { AMS365UrlCollection } from '../../enum/url-collection.enum';
import {
  IAMS365AddConfirmState,
  IAMS365AddHomeState,
  IAMS365DeleteConfirmState,
  IAMS365UpdateConfirmState
} from '../../interfaces/state.interface';
import { S365AccountVoucherBuilder } from '../../interfaces/voucher.interface';
import { AmdS365DetailService } from '../../services/definition/amd-s365-detail.service';
import { AmdS365ModalService } from '../../services/definition/amd-s365-modal.service';

@Component({
  selector: 'byte-am-s365-voucher',
  templateUrl: './am-s365-voucher.component.html',
  styleUrls: ['./am-s365-voucher.component.scss']
})
export class AmS365VoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;
  pdfData!: Array<IPrintData>;
  headbandLayout: IHeadBandAttribute[] = [];
  view: EAMS365View = EAMS365View.ADD;
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
    private voucherDefinitionService: AmdS365DetailService,
    private modalService: NgbModal,
    private modalDefinitionService: AmdS365ModalService,
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
      [EAMS365View.ADD]: () => this.buildVoucherForCreateOperation(),
      [EAMS365View.REMOVE]: () => this.buildVoucherForDeleteOperation(),
      [EAMS365View.UPDATE]: () => this.buildVoucherForUpdateOperation(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  buildVoucherForCreateOperation() {
    this.subtitle = 'ac:ach_subtitle_add_account';
    const { formValues, bankSelected, countrySelected } = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new S365AccountVoucherBuilder()
      .typeClient(formValues.typeClient)
      .name(formValues.name)
      .documentNumber(formValues.documentNumber)
      .address(formValues.address)
      .city(formValues.city)
      .country(countrySelected.description)
      .bankName(bankSelected.description)
      .product(+formValues.product)
      .accountNumber(formValues.account)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherDefinition({
      account: accountDetail,
    });

    this.showAlert('success', 'ac:ach_message_add_account');
    this.buildHeadBand();
    this.buildProofModalForAccountCreated();
  }

  buildVoucherForDeleteOperation() {
    const { account } = this.parameterManagement.getParameter<IAMS365DeleteConfirmState>(PROTECTED_PARAMETER_STATE);
    this.subtitle = 'ac:ach_subtitle_delete_account_confirm';

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

    this.showAlert('success', 'ac:ach_message_delete_account');
    this.buildHeadBand();
    this.buildProofModalForAccountDeleted();
  }

  buildVoucherForUpdateOperation() {
    const { formValues, account } = this.parameterManagement.getParameter<IAMS365UpdateConfirmState>(PROTECTED_PARAMETER_STATE);
    this.subtitle = 'ac:ach_subtitle_update_account_confirm';

    const accountDetail = new S365AccountVoucherBuilder()
      .typeClient(account.clientType)
      .name(formValues.name)
      .documentNumber(account.documentNumber)
      .address(formValues.address)
      .city(formValues.city)
      .country(account.countryName)
      .bankName(account.bankName)
      .product(+account.accountType)
      .accountNumber(account.account)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherDefinition({
      account: accountDetail,
    });

    this.showAlert('success', 'ac:ach_message_update_account');
    this.buildHeadBand();
    this.buildProofModalForAccountUpdated();
  }

  buildHeadBand() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAMS365AddConfirmState>(PROTECTED_PARAMETER_STATE);

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
      reference: transactionResponse.data.reference,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  buildProofModalForAccountCreated() {
    const { formValues, bankSelected, transactionResponse, countrySelected } = this.parameterManagement.getParameter<IAMS365AddConfirmState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new S365AccountVoucherBuilder()
      .typeClient(formValues.typeClient)
      .name(formValues.name)
      .documentNumber(formValues.documentNumber)
      .address(formValues.address)
      .city(formValues.city)
      .country(countrySelected.description)
      .bankName(bankSelected.description)
      .product(+formValues.product)
      .accountNumber(formValues.account)
      .build();

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountDetail,
      transactionResponse: transactionResponse.data,
      title: 'ac:s365:title_proof_modal_add_account',
    });


    const keys = {
      typeClient: 'tm365:label_type_person',
      name: 'ac:s365:label_name_beneficiary',
      documentNumber: 'ac:s365:label_document_number_beneficiary',
      address: 'ac:s365:label_address_beneficiary',
      city: 'ac:s365:label_city_beneficiary',
      country: 'ac:s365:label_target_country',
      bank: 'target-bank',
      product: 'type_account',
      account: 'ac:s365:label_account_beneficiary',
    }

    this.pdfData = Object.entries(accountDetail).map(([key, value]) => {
      if (keys[key] && value) {
        return new PrintDataBuilder()
          .label(keys[key])
          .value(`${this.mappedPrintValues(value, key)}`)
          .build();
      }

      return new PrintDataBuilder().build();
    });
  }

  private mappedPrintValues(value: string, key: string) {
    if (key === 'typeClient') {
      return this.voucherDefinitionService.parseTypeClientValue(value);
    }

    if (key === 'product') {
      return this.utils.getLabelProduct(+value);
    }

    return value;
  }

  buildProofModalForAccountUpdated() {
    const { account, formValues, transactionResponse } = this.parameterManagement.getParameter<IAMS365UpdateConfirmState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new S365AccountVoucherBuilder()
      .typeClient(account.clientType)
      .name(formValues.name)
      .documentNumber(account.documentNumber)
      .address(formValues.address)
      .city(formValues.city)
      .country(account.countryName)
      .bankName(account.bankName)
      .product(+account.accountType)
      .accountNumber(account.account)
      .status('')
      .build();

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountDetail,
      transactionResponse: transactionResponse.data,
      title: 'ac:s365:title_proof_modal_update_account',
    });


    const keys = {
      typeClient: 'tm365:label_type_person',
      name: 'ac:s365:label_name_beneficiary',
      documentNumber: 'ac:s365:label_document_number_beneficiary',
      address: 'ac:s365:label_address_beneficiary',
      city: 'ac:s365:label_city_beneficiary',
      country: 'ac:s365:label_target_country',
      bank: 'target-bank',
      product: 'type_account',
      account: 'ac:s365:label_account_beneficiary',
    }

    this.pdfData = Object.entries(accountDetail).map(([key, value]) => {
      return new PrintDataBuilder()
        .label(keys[key])
        .value(`${this.mappedPrintValues(value, key)}`)
        .build();
    });
  }

  buildProofModalForAccountDeleted() {
    const { account, transactionResponse } = this.parameterManagement.getParameter<IAMS365DeleteConfirmState>(PROTECTED_PARAMETER_STATE);

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

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountDetail,
      transactionResponse: transactionResponse.data,
      title: 'ac:s365:title_proof_modal_remove_account',
    });

    const keys = {
      typeClient: 'tm365:label_type_person',
      name: 'ac:s365:label_name_beneficiary',
      documentNumber: 'ac:s365:label_document_number_beneficiary',
      address: 'ac:s365:label_address_beneficiary',
      city: 'ac:s365:label_city_beneficiary',
      country: 'ac:s365:label_target_country',
      bank: 'target-bank',
      product: 'type_account',
      account: 'ac:s365:label_account_beneficiary',
    }

    this.pdfData = Object.entries(accountDetail).map(([key, value]) => {
      return new PrintDataBuilder()
        .label(keys[key])
        .value(`${this.mappedPrintValues(value, key)}`)
        .build();
    });
  }

  openProofModal(): void {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv am-ach ams365`,
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
      [EAMS365View.ADD]: () => this.exportFileForCreateOperation(),
      [EAMS365View.REMOVE]: () => this.exportFileForDeleteOperation(),
      [EAMS365View.UPDATE]: () => this.exportFileForUpdateOperation(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  exportFileForCreateOperation() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAMS365AddConfirmState>(PROTECTED_PARAMETER_STATE);

    const fileName = this.translate.instant('ac:s365:filename_add_account') + Date.now();
    const reference = transactionResponse.data.reference;
    const title = 'ac:s365:title_proof_modal_add_account';
    this.pdfCreateService.pdfGenerate({
      referenceNumber: reference,
      useS365Pdf: true,
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
    }, reference, fileName, 268, title, this.pdfData, true);
  }

  exportFileForUpdateOperation() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAMS365AddConfirmState>(PROTECTED_PARAMETER_STATE);

    const fileName = this.translate.instant('ac:s365:filename_update_account') + Date.now();
    const reference = transactionResponse.data.reference;
    const title = 'ac:s365:title_proof_modal_update_account';
    this.pdfCreateService.pdfGenerate({
      referenceNumber: reference,
      useS365Pdf: true,
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
    }, reference, fileName, 268, title, this.pdfData, true);
  }

  exportFileForDeleteOperation() {
    const { transactionResponse } = this.parameterManagement.getParameter<IAMS365AddConfirmState>(PROTECTED_PARAMETER_STATE);

    const fileName = this.translate.instant('ac:s365:filename_remove_account') + Date.now();
    const reference = transactionResponse.data.reference;
    const title = 'ac:s365:title_proof_modal_remove_account';

    this.pdfCreateService.pdfGenerate({
      referenceNumber: reference,
      useS365Pdf: true,
      date: this.adfFormat.getFormatDateTime(transactionResponse.data.dateTime),
    }, reference, fileName, 268, title, this.pdfData, true);
  }

  previous() {
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate([AMS365UrlCollection.HOME]).finally(() => this.utils.hideLoader());
  }

  nextStep() {
    this.openProofModal();
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
