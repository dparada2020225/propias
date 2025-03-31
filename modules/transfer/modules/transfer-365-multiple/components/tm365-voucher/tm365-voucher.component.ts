import { Component, OnInit } from '@angular/core';
import {
  AdfFormatService,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute,
  ITableStructure
} from '@adf/components';
import { IAccount } from '../../../../../../models/account.inteface';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tm365dVoucherService } from '../../services/definition/tm365d-voucher.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { ETm365UrlCollection } from '../../enum/url-collection.enum';
import { ETM365View } from '../../enum/view.enum';
import { IPrint } from '../../../../interface/print-data-interface';
import { M3635StateConfirmation } from '../../../transfer-365-movil/interfaces/state.interface';
import { EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { ITM365AchAccount } from '../../interfaces/table.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tm365ProofModalComponent } from '../tm365-proof-modal/tm365-proof-modal.component';
import { Tm365dModalService } from '../../services/definition/tm365d-modal.service';
import { Tm365PrintService } from '../../services/print/tm365-print.service';
import { TranslateService } from '@ngx-translate/core';
import { ITM365FileLoadedList } from '../../interfaces/load-file.interface';

@Component({
  selector: 'byte-tm365-voucher',
  templateUrl: './tm365-voucher.component.html',
  styleUrls: ['./tm365-voucher.component.scss']
})
export class Tm365VoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  tableStructure!: ITableStructure;
  voucherModalLayout!: IConfirmationModal;
  pdfLayout!: IPrint;
  headbandLayout: IHeadBandAttribute[] = [];

  sourceAccountSelected!: IAccount;
  view: ETM365View = ETM365View.DEFAULT;
  isShowNextButton = true;
  isShowHeadBand = true;
  nextButtonMessage = 'print';
  exportedFileLabels: any;

  credits = 0;
  total = '';
  currency = '';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get userVirtualScrollInTable() {
    return this.tableStructure.items.length > 8
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private tm365VoucherDefinitionService: Tm365dVoucherService,
    private parameterManagement: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private adfFormat: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private modalService: NgbModal,
    private voucherModalDefinitionService: Tm365dModalService,
    private pdfService: Tm365PrintService,
    private adfFormatService: AdfFormatService,
    private translate: TranslateService,
  ) {
    this.manageExportedFileLabelsChanged();
  }

  ngOnInit(): void {
    this.initState();
    this.manageBuildViewVoucher();
    this.exportedFileLabels = this.setExportedFileLabels();
    this.utils.hideLoader();
  }

  initState() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.view = this.activatedRoute.snapshot.data['view'];
    this.sourceAccountSelected = state.sourceAccountSelected;
    this.calcSummary();
  }

  calcSummary() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    const accounts: ITM365FileLoadedList = state.targetAccountListFromFile;
    this.credits = accounts.length;
    this.currency = this.sourceAccountSelected.currency;
    const calcTotal = accounts.reduce((acc, register) => acc + this.utils.parseNumberAsFloat(register.amount), 0);
    this.total = this.adfFormat.formatAmount(calcTotal.toFixed(2)) + '';
  }

  manageBuildViewVoucher() {
    const mappedView = {
      [ETM365View.DEFAULT]: () => this.buildDefaultVoucher(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  buildDefaultVoucher() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.tm365VoucherDefinitionService.buildVoucherConfirmationLayout({
      sourceAccount: this.sourceAccountSelected,
    });

    this.tableStructure = this.tm365VoucherDefinitionService.buildTableLayout({
      accounts: state.targetAccountListFromFile,
    });

    const { typeTransaction,  message } = this.parameterManagement.getParameter<M3635StateConfirmation>(PROTECTED_PARAMETER_STATE);
    this.isShowNextButton = typeTransaction === EACHTypeTransaction.DEFAULT;
    const alertMessage = typeTransaction === EACHTypeTransaction.DEFAULT ? 'ach:bisv:label_success_transaction' : message ?? 'signature_tracking:send_successfully';
    const statusMessage = typeTransaction === EACHTypeTransaction.DEFAULT ? 'success' : 'warning';

    this.showAlert(statusMessage, alertMessage);
    this.buildHeadBand();
    this.buildProofModalLayout();
  }

  buildHeadBand() {
    const { typeTransaction, transactionResponse } = this.parameterManagement.getParameter<M3635StateConfirmation>(PROTECTED_PARAMETER_STATE);
    this.isShowHeadBand = typeTransaction === EACHTypeTransaction.DEFAULT;

    if (!this.isShowHeadBand) return;

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(transactionResponse.dateTime),
      reference: transactionResponse.reference,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  buildProofModalLayout() {
    const { typeTransaction, transactionResponse } = this.parameterManagement.getParameter<M3635StateConfirmation>(PROTECTED_PARAMETER_STATE);
    const isShowModalLayout = typeTransaction === EACHTypeTransaction.DEFAULT;

    if  (!isShowModalLayout) return;

    this.voucherModalLayout = this.voucherModalDefinitionService.builderLayoutVoucherModal({
      sourceAccount: this.sourceAccountSelected,
      transactionResponse,
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
    });
    this.router.navigate([ETm365UrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    if (this.view === ETM365View.DEFAULT) {
      this.openProofModal();
      return;
    }

    console.log('execute operation st');
  }

  openProofModal() {
    const voucherModal = this.modalService.open(Tm365ProofModalComponent
      , {
        centered: true,
        windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv t365 tm365`,
        size: `lg`,
      });

    voucherModal.componentInstance.data = this.voucherModalLayout;
    voucherModal.componentInstance.uploadedAccountsLayout = this.tableStructure;
    voucherModal.componentInstance.total = this.total;
    voucherModal.componentInstance.credits = this.credits;
    voucherModal.componentInstance.currency = this.currency;

    voucherModal.result.then(isResult => {
      if (!isResult) { return; }

      this.exportFile();
    }).catch(error => error);
  }

  exportFile() {
    const { transactionResponse } = this.parameterManagement.getParameter<M3635StateConfirmation>(PROTECTED_PARAMETER_STATE);

    const data = {
      registers: this.tableStructure.items,
      sourceAccount: this.sourceAccountSelected,
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime),
      labels: this.exportedFileLabels,
    };

    const label = this.translate.instant('tm365:label_proof_modal_title_fileName') + `_${Date.now()}`;
    this.pdfService.pdfGenerate(data, transactionResponse?.reference, label, 248, '', undefined, true);
  }

  manageExportedFileLabelsChanged() {
    this.translate.onLangChange.subscribe(() =>{
      this.exportedFileLabels = this.setExportedFileLabels();
    });
  }

  setExportedFileLabels() {
    return {
      labelBankName: this.translate.instant('ach:bisv:label_bank'),
      labelProduct: this.translate.instant('product'),
      labelCurrency: this.translate.instant('currency'),
      labelAccount: this.translate.instant('account-number'),
      clientType: this.translate.instant('tm365:label_type_person'),
      labelEmail: this.translate.instant('tm365:label_email'),
      labelAmount: this.translate.instant('amount'),
      labelComment: this.translate.instant('comment'),
    }
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }
}
