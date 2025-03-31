import { AdfConfirmationModalComponent, AdfFormatService, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ITMTransaction } from 'src/app/modules/transaction-manager/interfaces/tm-transaction.interface';
import { ITMRequestDetailThirdPartyLoanPayment } from 'src/app/modules/transaction-manager/interfaces/transaction-manger.interface';
import { ESignatureTrackingTypeAction } from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import { StBuildUpdateBodyRequestService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
import { SignatureTrackingService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import { ETHNavigationParameters } from 'src/app/modules/transaction-manager/modules/transaction-history/enums/transaction-history.enum';
import { IPrint } from 'src/app/modules/transfer/interface/print-data-interface';
import { TransfersPrintService } from 'src/app/modules/transfer/prints/transfers-print.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import { TPLPTypeView } from '../../../enum/payment.interface';
import {
  IDestinationData, IRootData,
  ITPLPVoucherBuilder,
  ITPLPVoucherState,
  IVoucherPaymentTPL
} from '../../../interfaces/payment-interface';
import { TpldPaymentManagerService } from '../../../services/definition/payment/tpld-payment-manager.service';
import { ThirdPartyLoansService } from '../../../services/transaction/third-party-loans.service';
import { TpldPaymentStVoucherService } from '../../../services/definition/payment/tpld-payment-st-voucher.service';
import {
  ETransactionHistoryUrlNavigationCollection
} from '../../../../../../transaction-manager/modules/transaction-history/enums/th-navigate.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import {
  ENavigateProtectionParameter,
  EPaymentLoansFlowView,
  ETPLPaymentUrlNavigationCollection
} from '../../../enum/navigate-protection-parameter.enum';
import { IGetReceiptBodyRequest } from '../../../interfaces/crud/crud-third-party-loans-interface';
import {
  ISTBodyRequestThirdPartyLoanTransaction
} from '../../../../../../transaction-manager/modules/signature-tracking/interfaces/st-transfer.interface';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import { ERequestTypeTransaction } from '../../../../../../../enums/transaction-header.enum';
import { ESTButtonMessage } from '../../../../../../transaction-manager/modules/signature-tracking/enum/st-common.enum';
import {
  subTitleMessage
} from '../../../../../../transaction-manager/modules/signature-tracking/enum/signature-tracking.enum';
import {
  StOperationHandlerService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import {
  StProcessAtomicService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-process-atomic.service';

@Component({
  selector: 'byte-tpl-payment-voucher',
  templateUrl: './tpl-payment-voucher.component.html',
  styleUrls: ['./tpl-payment-voucher.component.scss'],
})
export class TplPaymentVoucherComponent implements OnInit, OnDestroy {
  view: TPLPTypeView | null = null;
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  isShowPrintButton = true;
  isShowHeadband = true;
  printButtonMessage = 'print';

  voucherLayout: IDataReading | null = null;
  voucherModalLayout: IConfirmationModal | null = null;
  modalVoucherStructure: IVoucherPaymentTPL | null = null;
  pdfLayout: IPrint | null = null;
  headbandLayout: IHeadBandAttribute[] = [];
  voucherStructure: ITPLPVoucherState | null = null;
  currentPositionToBackWard: number | null = null;
  userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
  routerSubscription: Subscription;
  isPrimaryButton: boolean = false;


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typePrevButton() {
    return !this.isShowPrintButton && !this.isPrimaryButton ? 'primary' : 'secondary';
  }

  constructor(
    private parameterManagement: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private stVoucherManager: TpldPaymentStVoucherService,
    private transactionService: SignatureTrackingService,
    private modalService: NgbModal,
    private utils: UtilService,
    private location: Location,
    private adfFormat: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
    private tplPaymentService: ThirdPartyLoansService,
    private stOperationHandler: StOperationHandlerService,
    private stProcessSingleTransaction: StProcessAtomicService,
    private paymentManagerDefinition: TpldPaymentManagerService,
    private pdfService: TransfersPrintService,
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      this.utils.showLoader();
      if (event.navigationTrigger === 'popstate') {
        this.back();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data?.['view'];

    this.initDefinition();
    this.buildVoucherByView();
    this.utils.hideLoader();
  }

  initDefinition() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');
    this.currentPositionToBackWard = paymentState?.position;
    this.voucherStructure = paymentState?.data;
  }

  buildVoucherByView() {
    switch (this.view) {
      case TPLPTypeView.DEFAULT:
        this.buildVoucherForSignatureTrackingTransaction();
        break;
      case TPLPTypeView.ST_DETAIL_TRANSACTION:
        this.buildVoucherForSignatureTrackingTransactionDetail();
        break;
      case TPLPTypeView.ST_OPERATIONS:
        this.buildVoucherForSignatureTrackingOperations();
        break;
      case TPLPTypeView.ST_CONFIRM_TRANSACTION:
        this.buildConfirmationScreenToModifyTransaction();
        break;
      case TPLPTypeView.ST_MODIFY_TRANSACTIONS:
        this.buildVoucherToModifyTransaction();
        break;

      case TPLPTypeView.TRANSACTION_HISTORY:
        this.buildVoucherForHistoryTransaction();
        break;
    }
  }

  buildVoucherForSignatureTrackingTransaction() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');

    this.isShowHeadband = false;
    this.isShowPrintButton = false;
    this.isPrimaryButton = true;
    this.voucherLayout = this.stVoucherManager.buildLayoutVoucher(this.voucherStructure!, 'payments_loans', 'confirmation_paymentTPL');

    this.showAlert('info', paymentState?.message);
  }

  buildConfirmationScreenToModifyTransaction() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');
    const { amount, data, detailTransaction, selectedSourceAccount } = paymentState ?? {};

    const voucherStructure = new ITPLPVoucherBuilder()
      .accountDebited(selectedSourceAccount?.account)
      .accountProduct(selectedSourceAccount?.product)
      .accountSubProduct(selectedSourceAccount?.subproduct)
      .aliasAccountDebited(selectedSourceAccount?.alias)
      .aliasLoan(data?.alias)
      .amount(amount)
      .comment((detailTransaction?.comment ?? 'UNDEFINED').trim())
      .currency(data?.currencyCode)
      .description('')
      .email((detailTransaction?.email ?? 'UNDEFINED').trim())
      .loanIdentifier(detailTransaction?.targetAccount)
      .loanProduct(data?.loanProduct)
      .loanSubProduct(data?.loanSubProduct)
      .nameAccountDebited(selectedSourceAccount?.name)
      .nameLoan(data?.loanName)
      .notifyTo((detailTransaction?.email ?? 'UNDEFINED').trim() + (detailTransaction?.email2 ?? 'UNDEFINED').trim())
      .totalPayment('')
      .build();

    this.voucherStructure = voucherStructure;
    this.isShowHeadband = false;
    this.printButtonMessage = 't.confirm';
    this.voucherLayout = this.stVoucherManager.buildLayoutVoucher(
      voucherStructure,
      'signature_tracking',
      'signature_tackingModifyConfirmationTransaction'
    );
  }

  buildVoucherToModifyTransaction() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');
    const { date, reference } = paymentState ?? {};

    this.isShowPrintButton = false;
    this.showAlert('success', 'signature_trackingModifyMessage');
    this.headbandLayout = this.utilWorkFlow.getHeadBandLayout({
      date: this.adfFormat.getFormatDateTime(date),
      reference,
    });
    this.voucherLayout = this.stVoucherManager.buildLayoutVoucher(
      this.voucherStructure!,
      'signature_tracking',
      'signature_tackingModifyConfirmationTransaction'
    );
  }

  buildVoucherForSignatureTrackingTransactionDetail() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');

    this.isShowHeadband = false;
    this.isShowPrintButton = false;
    this.voucherLayout = this.stVoucherManager.buildLayoutVoucher(this.voucherStructure!, 'signature_tracking', 'view_detail_transaction');

    this.showAlert('info', paymentState?.message);
  }

  buildVoucherForHistoryTransaction() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');
    const transactionSelected: ITMTransaction = paymentState?.transactionSelected;
    const transactionDetail: ITMRequestDetailThirdPartyLoanPayment = paymentState?.detail;
    const date = transactionSelected?.interfaceDate;
    const reference = transactionSelected?.reference;

    this.voucherLayout = this.stVoucherManager.buildTransactionHistoryTPLVoucher(
      this.voucherStructure!,
      'payments_loans',
      'label:transaction-history',
      reference,
      date
    );
    this.headbandLayout = this.utilWorkFlow.getHeadBandLayout({
      date: this.adfFormat.getFormatDateTime(transactionSelected?.interfaceDate),
      reference: transactionSelected?.reference,
    });

    const rootGroupData: IRootData = {
      dateOperation: transactionSelected?.interfaceDate,
      typeAccount: Number(transactionDetail?.sourceProduct ?? '00'),
      accountDebited: transactionDetail?.sourceAccount,
      currency: transactionSelected?.currency,
      amountDebited: transactionSelected?.amount,
      nameAccount: paymentState?.data?.nameAccountDebited,
    };

    const rootGroupDestination: IDestinationData = {
      accountCredit: transactionDetail?.targetAccount,
      nameLoan: (transactionDetail?.nameLoan ?? 'UNDEFINED').trim(),
      typeAccount: Number(transactionDetail?.targetProduct ?? '00'),
      comment: (transactionDetail?.comment ?? 'UNDEFINED').trim(),
    };

    this.modalVoucherStructure = {
      rootData: rootGroupData,
      destinationData: rootGroupDestination,
      reference: transactionSelected?.reference,
    };

    this.voucherModalLayout = this.paymentManagerDefinition.buildVoucherPaymentModal(this.modalVoucherStructure);
  }

  buildVoucherForSignatureTrackingOperations() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');

    const subtitle = subTitleMessage[(paymentState?.operation).toLowerCase()];
    const nextButtonMessage = ESTButtonMessage[(paymentState?.operation)];


    this.voucherLayout = this.stVoucherManager.buildLayoutVoucher(this.voucherStructure!, 'signature_tracking', subtitle);
    this.printButtonMessage = nextButtonMessage;
  }

  back() {
    switch (this.view) {
      case TPLPTypeView.DEFAULT:
        const currentView = this.parameterManagement.getParameter('navigateStateParameters')?.currentView;
        this.resetStorage();
        if(currentView === EPaymentLoansFlowView.ALL_LOANS){
          this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME2]).then(() => {});
        } else {
          this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME]).then(() => {});
        }
        break;
      case TPLPTypeView.ST_CONFIRM_TRANSACTION:
        this.parameterManagement.sendParameters({
          navigationProtectedParameter: ENavigateProtectionParameter.FORM_ST_MODIFY_PAYMENT,
        });
        this.location.back();
        break;
      case TPLPTypeView.ST_MODIFY_TRANSACTIONS:
        this.resetStorage();
        this.utils.showLoader();
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
        break;
      case TPLPTypeView.ST_DETAIL_TRANSACTION:
      case TPLPTypeView.ST_OPERATIONS:
        this.utils.showLoader();
        this.resetStorageToSignatureTracking(this.currentPositionToBackWard!, null!);
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
        break;
      case TPLPTypeView.TRANSACTION_HISTORY:
        this.resetStorage(ETHNavigationParameters.CONSULT as any);
        this.router.navigate([ETransactionHistoryUrlNavigationCollection.CONSULT]).finally(() => this.utils.hideLoader());
        break;
    }
  }

  print() {
    switch (this.view) {
      case TPLPTypeView.TRANSACTION_HISTORY:
        return this.openModal();
      case TPLPTypeView.ST_OPERATIONS:
        return this.handleOperations();
      case TPLPTypeView.ST_CONFIRM_TRANSACTION:
        return this.executeModifyTransaction();
    }
  }

  openModal() {
    const voucherModal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} voucher-modal`,
      size: `lg`,
    });

    voucherModal.componentInstance.data = this.voucherModalLayout;

    voucherModal.result
      .then((isResult) => {
        if (!isResult) {
          return;
        }

        this.exportPdf();
      })
      .then((error) => error);
  }

  exportPdf() {
    this.pdfLayout = this.paymentManagerDefinition.buildVoucherPaymentPDF(this.modalVoucherStructure!);
    const { account, reference, title, fileName, items } = this.pdfLayout;

    this.pdfService.pdfGenerate(account, reference, fileName, 268, title, items);
  }

  executeModifyTransaction() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');
    const { transaction, amount, detailTransaction } = paymentState ?? {};

    this.utils.showLoader();

    const receiptBodyRequest: IGetReceiptBodyRequest = {
      product: detailTransaction?.targetProduct,
      subProduct: detailTransaction?.targetSubProduct,
      loan: this.voucherStructure?.loanIdentifier!,
      currency: this.voucherStructure?.currency!,
      amount,
    };

    this.tplPaymentService.getReceipt(receiptBodyRequest).subscribe({
      next: (response) => {
        const updateParams = {
          transactionCode: transaction?.reference,
          serviceModify: transaction?.serviceCode,
          data: this.getBodyToUpdateTransaction(response?.receiptNumber),
        };

        this.transactionService.update(updateParams).subscribe({
          next: (updateResponse) => {
            const date = updateResponse?.dateTime;
            const reference = updateResponse?.reference;
            this.goToUpdateVoucher(date, reference);
          },
          error: (error: HttpErrorResponse) => {
            if (error?.error?.code === '044') {
              const date = error?.error?.dateTime;
              const reference = error?.error?.reference;
              this.goToUpdateVoucher(date, reference);

              return;
            }

            this.utils.hideLoader();
            this.showAlert('error', error?.error?.message ?? 'signature_tracking:error:modify_transaction');
            this.utils.scrollToTop();
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.showAlert('error', error?.error?.message ?? 'fatal-error:get_receipt_number');
      },
    });
  }

  goToUpdateVoucher(date: string, reference: string) {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');

    this.parameterManagement.sendParameters({
      navigateStateParameters: {
        ...paymentState,
        data: this.voucherStructure,
        date,
        reference,
      },
      navigationProtectedParameter: ENavigateProtectionParameter.VOUCHER_ST_MODIFY_TRANSACTION,
    });

    this.router.navigate([ETPLPaymentUrlNavigationCollection.SIGNATURE_TRACKING_MODIFY_VOUCHER]).finally(() => this.utils.hideLoader());
  }

  getBodyToUpdateTransaction(receipt: string) {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');
    const { amount, detailTransaction, selectedSourceAccount, quotasSelected, typePayment } = paymentState ?? {};

    const requestProperties: ISTBodyRequestThirdPartyLoanTransaction = {
      sourceAccount: selectedSourceAccount,
      targetAccount: null!,
      comment: detailTransaction?.comment,
      amount,
      email: detailTransaction?.email,
      detailAccountToUpdate: detailTransaction,
      receiptNumber: receipt,
      quotasSelected,
      typePayment,
    };

    return this.stBuildUpdateBodyRequest.buildBodyToUpdateThirdPartyLoan({ ...requestProperties });
  }

  handleOperations() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = paymentState?.transactionSelected;
    const position: number = paymentState?.position;

    if (paymentState?.operation === ESignatureTrackingTypeAction.PROCESS) {
      this.stProcessSingleTransaction.execute(ERequestTypeTransaction.THIRD_LOAN_PAYMENT);
      return;
    }

    this.utils.showLoader();
    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action: paymentState?.operation
    });
  }

  resetStorage(navParameter = null) {
    this.parameterManagement.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: navParameter,
    });
  }

  resetStorageToSignatureTracking(position: number, message: string) {
    this.parameterManagement.sendParameters({
      navigateStateParameters: {
        position,
        message,
      },
    });
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
}
