import {Component, OnInit} from '@angular/core';
import {
  ChangeLanguageService,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute,
  ITableStructure
} from '@adf/components';
import {IAccount} from '../../../../../../models/account.inteface';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from '../../../../../../service/common/util.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PmppProofModalComponent} from '../pmpp-proof-modal/pmpp-proof-modal.component';
import {SppPrintVoucherService} from '../../../print/spp-print-voucher.service';
import {SP_PAYMENT_VIEW, SPPPaymentView} from '../../../enums/pmp-view.enum';
import {PmpeVoucherService} from '../../../services/execution/pmpe-voucher.service';
import {PdfLayoutSpp} from '../../../interfaces/pmp-voucher.interface';
import {
  ETransactionHistoryUrlNavigationCollection
} from '../../../../../transaction-manager/modules/transaction-history/enums/th-navigate.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import {PmpTransactionService} from '../../../services/transaction/pmp-transaction.service';
import {finalize} from 'rxjs/operators';
import {
  subTitleMessage
} from '../../../../../transaction-manager/modules/signature-tracking/enum/signature-tracking.enum';
import {ESTButtonMessage} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-common.enum';
import {
  ESignatureTrackingTypeAction
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import {SPPMRoutes} from '../../../enums/pmp-routes.enum';
import {PayedDetailPayroll, PayedPayrollDetailResponse} from '../../../interfaces/pmp-payed-payroll.interface';
import {IUserInfo} from '../../../../../../models/user-info.interface';
import {IGetDataPayroll} from "../../../interfaces/pmp-payment-home.interface";
import {IPayrollPaySuccess} from "../../../interfaces/pmpe-transaction.interface";
import {TranslateService} from '@ngx-translate/core';
import {
  StsProcessPaymentOfPayrollService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/definitions/bisv/atomic/sts-process-payment-of-payroll.service';
import {
  StOperationHandlerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';

@Component({
  selector: 'byte-pmpp-voucher',
  templateUrl: './pmpp-voucher.component.html',
  styleUrls: ['./pmpp-voucher.component.scss']
})
export class PmppVoucherComponent implements OnInit {

  typeMessage = '';
  message = '';

  tableLayout!: ITableStructure;
  sourceAccountSelected!: IAccount;

  paymentDetail!: IGetDataPayroll;
  paymentDetailSignature!: PayedPayrollDetailResponse;
  voucherLayout!: IDataReading;
  proofVoucherLayout!: IConfirmationModal;
  proofVoucherTableLayout!: ITableStructure;
  paymentResponse!:IPayrollPaySuccess

  headBandLayout: IHeadBandAttribute[] = [];
  view: SP_PAYMENT_VIEW = SPPPaymentView.DEFAULT;
  pdfLayout: PdfLayoutSpp | undefined = undefined;

  isDisabledPrintButton = false;
  isDisabledHeadband = false;
  helperTitle = ''
  helperSubtitle = ''
  nextButtonMessage = 'print'
  userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');

  constructor(
    private parameterManager: ParameterManagementService,
    private router: Router,
    private utils: UtilService,
    private modalService: NgbModal,
    private pdfService: SppPrintVoucherService,
    private voucherExecution: PmpeVoucherService,
    private activatedRoute: ActivatedRoute,
    private paymentTransaction: PmpTransactionService,
    private stOperationHandler: StOperationHandlerService,
    private stProcess: StsProcessPaymentOfPayrollService,
    private adfTranslate: ChangeLanguageService,
    private translate: TranslateService,
  ) {
    this.translate.onLangChange.subscribe(() => {
      if (this.view === SPPPaymentView.DEFAULT) {
        this.buildDefaultVoucher();
      }

      if (this.view === SPPPaymentView.ST_VOUCHER) {
        this.buildDefaultVoucherForSignatureTracking();
      }
    });
  }

  get customShow() {
    return this.message && this.typeMessage ? 'custom_show' : '';
  }

  get isViewManageBySignatureTracking() {
    return this.view === SPPPaymentView.TH_VOUCHER
      || this.view === SPPPaymentView.ST_DETAIL
      || this.view === SPPPaymentView.ST_OPERATION;
  }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];

    this.initState();
    this.launchView();
  }

  initState() {
    const state = this.parameterManager.getParameter('navigateStateParameters');
    this.sourceAccountSelected = state?.sourceAccount;
    this.paymentDetail = state?.paymentDetail;
    this.paymentResponse = state?.serviceResponse;
  }

  launchView() {
    const mapView = {
      [SPPPaymentView.DEFAULT]: () => this.buildDefaultVoucher(),
      [SPPPaymentView.ST_VOUCHER]: () => this.buildDefaultVoucherForSignatureTracking(),
      [SPPPaymentView.ST_DETAIL]: () => this.getRegisters(),
      [SPPPaymentView.ST_OPERATION]: () => this.getRegisters(),
      [SPPPaymentView.TH_VOUCHER]: () => this.getRegisters(),
    }

    const view = mapView[this.view] || mapView[SPPPaymentView.DEFAULT];
    view();
  }

  buildDefaultVoucher() {
    const amount = String(this.paymentDetail.participants.reduce((sum, account) => sum + account.targetAmount, 0));

    const voucher = this.voucherExecution.buildDefaultVoucher({
      reference: this.paymentResponse.reference,
      date: this.paymentResponse.dateTime,
      registers: this.paymentDetail?.participants,
      sourceAccount: this.sourceAccountSelected,
      credits: String(this.paymentDetail?.participants.length),
      amount
    })

    const { voucherLayout,
      pdfVoucherLayout,
      headBandLayout,
      mainTableLayout,
      modalLayout,
      tableModalLayout} = voucher;

    this.tableLayout = mainTableLayout;
    this.voucherLayout = voucherLayout;
    this.proofVoucherLayout = modalLayout;
    this.headBandLayout = headBandLayout;
    this.pdfLayout = pdfVoucherLayout;
    this.proofVoucherTableLayout = tableModalLayout;

    this.showAlert('success', 'payroll:label_success_payment');
  }

  buildDefaultVoucherForSignatureTracking() {
    const amount = String(this.paymentDetail.participants.reduce((sum, account) => sum + account.targetAmount, 0));
    const date = this.utils.parseDateToFormat();

    const state = this.parameterManager.getParameter('navigateStateParameters');
    const voucher = this.voucherExecution.buildDefaultVoucherForSignatureTracking({
      reference: this.paymentResponse.reference ?? '0000000000',
      date: this.paymentResponse.dateTime ?? date,
      registers: this.paymentDetail?.participants,
      sourceAccount: this.sourceAccountSelected,
      credits: String(this.paymentDetail?.participants.length),
      amount
    })

    const {
      voucherLayout,
      mainTableLayout,
      pdfVoucherLayout,
      modalLayout,
      tableModalLayout
    } = voucher;

    this.tableLayout = mainTableLayout;
    this.voucherLayout = voucherLayout;
    this.pdfLayout = pdfVoucherLayout;
    this.proofVoucherLayout = modalLayout;
    this.proofVoucherTableLayout = tableModalLayout;
    this.isDisabledHeadband = true;
    this.isDisabledPrintButton = false;

    const message = state?.serviceResponse?.message ?? '';
    this.showAlert('warning', message);
  }


  buildMappedAccounts(registers: Array<PayedDetailPayroll>) {
    return registers.map(register => {
      return {
        accountName: register.accountName,
        targetAccount: register.targetAccount,
        targetAmount: register.targetAmount,
        email: register.email,
        status: register.accountStatus,
        statusAccount: register.accountStatus,
      }
    })
  }

  buildSignatureTrackingVoucherDetail() {
    const paymentDetail:any = this.paymentDetailSignature as any //PayedPayrollDetailResponse;

    return  this.voucherExecution.buildSignatureTrackingVoucherLayout({
      registers: this.buildMappedAccounts(paymentDetail?.records ?? []),
      sourceAccount: this.sourceAccountSelected,
      credits:`${paymentDetail?.debits ?? 0}`,
      amount: `${paymentDetail?.sourceAmount ?? 0}`,
    });
  }

  buildVoucherForSignatureTrackingOperations() {
    const state = this.parameterManager.getParameter('navigateStateParameters');


    const { voucherLayout, mainTableLayout } = this.buildSignatureTrackingVoucherDetail();

    this.tableLayout = mainTableLayout;
    this.voucherLayout = voucherLayout;
    this.isDisabledHeadband = true;

    this.helperTitle = 'signature_tracking'
    this.helperSubtitle = subTitleMessage[(state?.action ?? '').toLowerCase()];
    this.nextButtonMessage = ESTButtonMessage[state?.action];
  }

  buildVoucherForSignatureTrackingDetail() {
    const { voucherLayout, mainTableLayout } = this.buildSignatureTrackingVoucherDetail();

    this.tableLayout = mainTableLayout;
    this.voucherLayout = voucherLayout;
    this.isDisabledHeadband = true;
    this.isDisabledPrintButton = true;

    this.helperTitle = 'signature_tracking'
    this.helperSubtitle = 'view_detail_transaction'
  }

  buildVoucherForHistoryTransaction() {
    console.log('pending...');
  }

  getRegisters() {
    const state = this.parameterManager.getParameter('navigateStateParameters');
    const idTransaction = state?.transactionDetail?.authorization;
    const customerId = (state?.transactionDetail?.principalClient ?? '').trim();

    const mapView = {
      [SPPPaymentView.ST_DETAIL]: () => this.buildVoucherForSignatureTrackingDetail(),
      [SPPPaymentView.ST_OPERATION]: () => this.buildVoucherForSignatureTrackingOperations(),
      [SPPPaymentView.TH_VOUCHER]: () => this.buildVoucherForHistoryTransaction(),
    }

    this.utils.showLoader();
    this.paymentTransaction.getPayedPayrollDetail({
      mainClient: customerId,
      authorization: idTransaction
      })
      .pipe(finalize(() => this.utils.hideLoader()))
      .subscribe({
        next: (response:PayedPayrollDetailResponse) => {
          this.paymentDetailSignature = response;
          const view = mapView[this.view] || mapView[SPPPaymentView.DEFAULT];
          view();
        },
        error: (error) => {
          this.isDisabledPrintButton = true;
          const view = mapView[this.view] || mapView[SPPPaymentView.DEFAULT];
          view();
          this.showAlert('error', error?.error?.message ?? 'payroll:label_error_payment');
        }
      })
  }

  next() {
    const state = this.parameterManager.getParameter('navigateStateParameters');

    if (this.view === SPPPaymentView.DEFAULT || this.view === SPPPaymentView.TH_VOUCHER || this.view === SPPPaymentView.ST_VOUCHER) {
      this.openModal();
      return;
    }

    if (state?.action === ESignatureTrackingTypeAction.PROCESS) {
      this.stProcess.execute({
        transactionSelected: state.transactionSelected,
      });

      return;
    }

    this.stOperationHandler.operationManager({
      transactionSelected: state?.transactionSelected,
      action: state?.action,
      position: state?.position,
    });
  }

  previous() {
    if (this.view === SPPPaymentView.ST_VOUCHER || this.view === SPPPaymentView.DEFAULT) {
      this.resetState();
      this.utils.showLoader();
      this.router.navigate([SPPMRoutes.HOME]).finally(() => this.utils.hideLoader());
      return;
    }

    if (this.view === SPPPaymentView.TH_VOUCHER) {
      this.resetState();
      this.utils.showLoader();
      this.router.navigate([ETransactionHistoryUrlNavigationCollection.CONSULT]).finally(() => this.utils.hideLoader());
      return;
    }

    this.resetStateForSignatureTracking();
    this.utils.showLoader();
    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
  }

  openModal() {
    const voucherModal = this.modalService.open(PmppProofModalComponent
      , {
        centered: true,
        windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal-bisv voucher-modal payroll-modal`,
        size: `lg`,
      });

    voucherModal.componentInstance.data = this.proofVoucherLayout;
    voucherModal.componentInstance.paymentRegisters = this.proofVoucherTableLayout;

    voucherModal.result.then(isResult => {
      if (!isResult) { return; }

      this.exportFile();
    }).catch(error => error);
  }

  resetStateForSignatureTracking() {
    const state = this.parameterManager.getParameter('navigateStateParameters');
    this.parameterManager.sendParameters({
      navigateStateParameters: {
        position: state?.position,
      },
      navigationProtectedParameter: null,
    })
  }

  resetState() {
    this.parameterManager.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    })
  }

  exportFile() {
    const reference = this.pdfLayout?.reference ?? '';
    const label = this.pdfLayout?.label ?? '';

    this.pdfService.pdfGenerate(this.pdfLayout,reference, label, 248, '', undefined, true);
  }

  showAlert(type: string, message: string) {
    this.typeMessage = type;
    this.message = message;
  }

}
