import { Component, OnInit } from '@angular/core';
import { AdfFormatService, IConfirmationModal, IDataReading, IHeadBandAttribute, ITableStructure } from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IPrint } from 'src/app/modules/transfer/interface/print-data-interface';
import { IAccount } from 'src/app/models/account.inteface';
import { ETMAchUniView } from '../../enum/ach-uni-view.enum';
import { TmAchUniPrintService } from '../../services/print/tm-ach-uni-print.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { TmAchUniVoucherModalService } from '../../services/definition/tm-ach-uni-voucher-modal.service';
import { TmAchUniVoucherService } from '../../services/definition/tm-ach-uni-voucher.service';
import { PROTECTED_PARAMETER_STATE } from 'src/app/enums/common-value.enum';
import { ITMAchUniAchAccount } from '../../interfaces/ach-uni-table.interface';
import { ETmAchUniUrlCollection } from '../../enum/ach-uni-url-collection';
import { IHeadBandLayoutConfirm } from 'src/app/models/util-work-flow.interface';
import { TmAchUniModalPdfComponent } from '../tm-ach-uni-modal-pdf/tm-ach-uni-modal-pdf.component';
import { AchUniTransactionCode } from '../../enum/ach-uni-transaction.enum';

@Component({
  selector: 'byte-tm-ach-uni-voucher',
  templateUrl: './tm-ach-uni-voucher.component.html',
  styleUrls: ['./tm-ach-uni-voucher.component.scss']
})
export class TmAchUniVoucherComponent implements OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  tableStructure!: ITableStructure;
  voucherModalLayout!: IConfirmationModal;
  pdfLayout!: IPrint;
  headbandLayout: IHeadBandAttribute[] = [];

  sourceAccountSelected!: IAccount;
  view: ETMAchUniView = ETMAchUniView.DEFAULT;
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
    private tmAchUniVoucherDefinitionService: TmAchUniVoucherService,
    private parameterManagement: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private adfFormat: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private modalService: NgbModal,
    private voucherModalDefinitionService: TmAchUniVoucherModalService,
    private pdfService: TmAchUniPrintService,
    private adfFormatService: AdfFormatService,
    private translate: TranslateService,) {
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

  manageBuildViewVoucher() {
    const mappedView = {
      [ETMAchUniView.DEFAULT]: () => this.buildDefaultVoucher(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  buildDefaultVoucher() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.tmAchUniVoucherDefinitionService.buildVoucherConfirmationLayout({
      sourceAccount: this.sourceAccountSelected,
    });

    this.tableStructure = this.tmAchUniVoucherDefinitionService.buildTableLayout({
      accounts: state.targetAccountListFromFile,
    });

    const { transactionResponse } = this.parameterManagement.getParameter<any>(PROTECTED_PARAMETER_STATE);
    this.isShowNextButton = transactionResponse?.responseCode === AchUniTransactionCode.DEFAULT || transactionResponse?.responseCode === AchUniTransactionCode.OUT_OF_TIME;

    if(transactionResponse.responseCode === AchUniTransactionCode.DEFAULT || transactionResponse.responseCode === AchUniTransactionCode.OUT_OF_TIME){
      this.showAlert('success', `tm-ach-uni:response-${transactionResponse.responseCode}`);
    }

    if(transactionResponse.responseCode === AchUniTransactionCode.SIGNATURE_TRACKING){
      this.showAlert('warning', 'tm-ach-uni:response-039');
    }

    this.buildHeadBand();
    this.buildProofModalLayout();
  }

  calcSummary() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    const accounts: Array<ITMAchUniAchAccount> = state.targetAccountListFromFile;
    this.credits = accounts.length;
    this.currency = this.sourceAccountSelected.currency;
    const calcTotal = accounts.reduce((acc, register) => acc + this.utils.parseNumberAsFloat(register.dataFromFile.amount), 0);
    this.total = this.adfFormat.formatAmount(calcTotal.toFixed(2)) + '';
  }

  manageExportedFileLabelsChanged() {
    this.translate.onLangChange.subscribe(() =>{
      this.exportedFileLabels = this.setExportedFileLabels();
      this.manageBuildViewVoucher();
    });
  }

  setExportedFileLabels() {
    return {
      labelBankName: this.translate.instant('tm-ach-uni:confirmation_bank'),
      labelProduct: this.translate.instant('tm-ach-uni:confirmation_product'),
      labelCurrency: this.translate.instant('tm-ach-uni:confirmation_currency'),
      labelAccount: this.translate.instant('tm-ach-uni:confirmation_number_account'),
      labelAmount: this.translate.instant('tm-ach-uni:confirmation_amount'),
      labelComment: this.translate.instant('tm-ach-uni:confirmation_comment'),
    }
  }

  buildHeadBand() {
    const { transactionResponse } = this.parameterManagement.getParameter<any>(PROTECTED_PARAMETER_STATE);
    this.isShowHeadBand = transactionResponse.responseCode === AchUniTransactionCode.DEFAULT || transactionResponse.responseCode === AchUniTransactionCode.OUT_OF_TIME;

    if (!this.isShowHeadBand) return;

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(transactionResponse.date),
      reference: transactionResponse.reference,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirmUni(headBandLayoutConfirm);
  }

  buildProofModalLayout() {
    const { transactionResponse } = this.parameterManagement.getParameter<any>(PROTECTED_PARAMETER_STATE);//error
    const isShowModalLayout = transactionResponse?.responseCode === AchUniTransactionCode.DEFAULT || transactionResponse?.responseCode === AchUniTransactionCode.OUT_OF_TIME;

    if  (!isShowModalLayout) return;

    this.voucherModalLayout = this.voucherModalDefinitionService.builderLayoutVoucherModal({
      sourceAccount: this.sourceAccountSelected,
      transactionResponse,
    });
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
    });
    this.router.navigate([ETmAchUniUrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    if (this.view === ETMAchUniView.DEFAULT) {
      this.openProofModal();
      return;
    }
  }

  openProofModal() {
    const voucherModal = this.modalService.open(TmAchUniModalPdfComponent, {
        centered: true,
        windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv tuni tm-ach`,
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
    const { transactionResponse } = this.parameterManagement.getParameter<any>(PROTECTED_PARAMETER_STATE);

    const data = {
      registers: this.tableStructure.items,
      sourceAccount: this.sourceAccountSelected,
      date: this.adfFormat.getFormatDateTime(transactionResponse?.date),
      labels: this.exportedFileLabels,
      amount: this.total,
      credits: this.credits,
      currency: this.currency
    };

    const label = this.translate.instant('tm-ach-uni:filename') + `_${Date.now()}`;
    this.pdfService.pdfGenerate(data, transactionResponse?.reference, label, 248, '', undefined, true);
  }
}
