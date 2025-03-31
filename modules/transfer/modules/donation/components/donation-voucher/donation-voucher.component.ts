import {
  AdfConfirmationModalComponent,
  AdfFormatService,
  IConfirmationModal, IDataReading,
  IHeadBandAttribute
} from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { IHeadBandLayoutConfirm } from 'src/app/models/util-work-flow.interface';
import { ITMTransaction } from 'src/app/modules/transaction-manager/interfaces/tm-transaction.interface';
import { ESignatureTrackingTypeAction } from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import { environment } from 'src/environments/environment';
import {
  EDonationTransferUrlNavigationCollection,
  EDonationTypeTransaction,
  EDonationViewMode
} from '../../enum/donation.enum';
import { IDTDFormRequest, IDTDVoucherBuilder, IDTDVoucherSample } from '../../interfaces/donation-definition.interface';
import { IDonationState } from '../../interfaces/donation.state.interface';
import {
  ETHNavigationParameters
} from '../../../../../transaction-manager/modules/transaction-history/enums/transaction-history.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { DtdTransferManagerService } from '../../services/definition/dtd-transfer-manager.service';
import { DteDonationManagerService } from '../../services/execute/dte-donation-manager.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransfersPrintService } from '../../../../prints/transfers-print.service';
import { Subscription } from 'rxjs';
import { IPrint } from '../../../../interface/print-data-interface';
import { IDonationAccount, IDonationFormValues } from '../../interfaces/donation-account.interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  ETransactionHistoryUrlNavigationCollection
} from '../../../../../transaction-manager/modules/transaction-history/enums/th-navigate.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import {
  subTitleMessage
} from '../../../../../transaction-manager/modules/signature-tracking/enum/signature-tracking.enum';
import { ESTButtonMessage } from '../../../../../transaction-manager/modules/signature-tracking/enum/st-common.enum';
import {
  DonationProcessService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/definitions/bp/multiple/st-donation.service';
import {
  StOperationHandlerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';

@Component({
  selector: 'byte-donation-voucher',
  templateUrl: './donation-voucher.component.html',
  styleUrls: ['./donation-voucher.component.scss']
})
export class DonationVoucherComponent implements OnInit {
  fundationAccountSelected: IDonationAccount | null = null;
  debitedAccountSelected: IAccount | null = null;
  formValues: IDonationFormValues | null = null;
  voucherLayout!: IDataReading;

  modalLayout: IConfirmationModal | null = null;
  pdfLayout: IPrint | null = null;
  headBandLayout: IHeadBandAttribute[] = [];

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  view: EDonationViewMode | null = null;
  dateTime: string | null = null;
  reference: string | null = null;
  nextButtonMessage = 'print';
  currentPosition: number | null = null;
  isShowHeadband = true;
  isShowPrintButton = true;
  routerSubscription: Subscription;


  get typePrevButton() {
    return !this.isShowPrintButton ? 'primary' : 'secondary';
  }

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pdfService: TransfersPrintService,
    private modalService: NgbModal,
    private parameterManagement: ParameterManagementService,
    private donationExecuteManager: DteDonationManagerService,
    private donationDefinitionManager: DtdTransferManagerService,
    private stOperationHandler: StOperationHandlerService,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private donationProcess: DonationProcessService,
    private utils: UtilService,
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate' && this.view === EDonationViewMode.SIGNATURE_TRACKING) {
        this.resetStorage(null);
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).then(() => {});
        return;
      }

      if (event.navigationTrigger === 'popstate' && this.view === EDonationViewMode.TRANSACTION_HISTORY) {
        this.resetStorage(ETHNavigationParameters.CONSULT);
      }
    });
  }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];
    const donationState: IDonationState = this.parameterManagement.getParameter('navigateStateParameters');

    this.fundationAccountSelected = donationState?.fundationAccount;
    this.debitedAccountSelected = donationState?.debitedAccount;
    this.formValues = donationState?.formValues;
    this.dateTime = donationState?.transactionResponse?.dateTime as string;
    this.reference = donationState?.transactionResponse?.reference as string;
    this.currentPosition = donationState?.position as number;

    this.viewDefinition();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  viewDefinition() {
    switch (this.view) {
      case EDonationViewMode.DEFAULT:
        this.handlerVoucherToDefaultTransaction();
        break;
      case EDonationViewMode.TRANSACTION_HISTORY:
        this.voucherForHistoryTransaction();
        break;
      case EDonationViewMode.SIGNATURE_TRACKING_DETAIL:
        this.voucherDetailSignatureTracking();
        break;
      case EDonationViewMode.SIGNATURE_TRACKING:
        this.voucherModifySignatureTracking();
        break;
      case EDonationViewMode.SIGNATURE_TRACKING_OPERATION:
        this.signatureTransactionOperationDefinition();
        break;
    }
  }

  nextStep() {
    if (this.view === EDonationViewMode.DEFAULT || this.view === EDonationViewMode.TRANSACTION_HISTORY) {
      this.openVoucherModal();
      return;
    }

    if (this.view === EDonationViewMode.SIGNATURE_TRACKING_OPERATION) {
      this.handleExecuteOperations();
    }
  }

  lastStep() {
    this.utils.showLoader();

    switch (this.view) {
      case EDonationViewMode.SIGNATURE_TRACKING_OPERATION:
      case EDonationViewMode.SIGNATURE_TRACKING:
      case EDonationViewMode.SIGNATURE_TRACKING_DETAIL:
        this.storageToBackSignatureTracking(this.currentPosition as number);
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
        break;
      case EDonationViewMode.DEFAULT:
        this.resetStorage(null);
        this.router.navigate([EDonationTransferUrlNavigationCollection.HOME]).finally(() => this.utils.hideLoader());
        break;
      case EDonationViewMode.TRANSACTION_HISTORY:
        this.resetStorage(ETHNavigationParameters.CONSULT);
        this.router.navigate([ETransactionHistoryUrlNavigationCollection.CONSULT]).finally(() => this.utils.hideLoader());
        break;
    }

  }

  /* ===================================== DEFAULT TRANSACTION ============================*/

  handlerVoucherToDefaultTransaction() {
    const donationState: IDonationState = this.parameterManagement.getParameter('navigateStateParameters');

    switch (donationState?.typeTransaction) {
      case EDonationTypeTransaction.DEFAULT:
        this.voucherLayoutMainBuilder();
        break;

      case EDonationTypeTransaction.SIGNATURE_TRACKING:
        this.voucherForSignatureTracking({
          message: donationState?.message as string,
          title: 'donation-title',
          subtitle: 'donations_confirmation',
        });
        this.hiddenPrintButton();
        break;

      default:
        this.voucherLayoutMainBuilder();
        break;
    }

  }

  voucherLayoutMainBuilder() {
    const voucherProperties: IDTDVoucherBuilder = {
      date: this.dateTime as string,
      reference: this.reference as string,
      titlePdf: 'donation-title',
      fileNamePdf: 'title-pdf:donations',
      fundationAccount: this.fundationAccountSelected as IDonationAccount,
      accountDebited: this.debitedAccountSelected as IAccount,
      formValues: this.formValues as IDonationFormValues,
      title: 'donation.title',
      subtitle: 'proof_donations',
    };

    const {
      layoutVoucher,
      pdfLayout,
      headBandLayout,
      layoutVoucherModal } = this.donationExecuteManager.voucherLayoutsMainBuilderStep3({ ...voucherProperties });

    this.voucherLayout = layoutVoucher;
    this.modalLayout = layoutVoucherModal;
    this.headBandLayout = headBandLayout;
    this.pdfLayout = pdfLayout;
    this.showAlert('success', 'transfer_successfully');
  }

  openVoucherModal() {
    const voucherModal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} voucher-modal`,
      size: 'lg',
    });

    voucherModal.dismissed.subscribe(() => {
      return;
    });

    voucherModal.componentInstance.data = this.modalLayout;

    voucherModal.result.then(isResult => {
      if (!isResult) { return; }

      this.exportFile();
    }).catch(error => error);
  }

  exportFile() {
    const { account, reference, title, fileName, items } = this.pdfLayout as IPrint;

    this.pdfService.pdfGenerate(
      account,
      reference,
      fileName,
      268,
      title,
      items,
      true
    );
  }

  headBandLayoutBuilder(): void {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(this.dateTime as string),
      reference: this.reference as string,
    };

    this.headBandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  /* ===================================== DEFAULT TRANSACTION ============================*/


  /* ===================================== SIGNATURE TRACKING  ============================*/

  signatureTransactionOperationDefinition() {
    const donationState = this.parameterManagement.getParameter('navigateStateParameters');

    const confirm: IDTDVoucherSample = {
      title: 'signature_tracking',
      subtitle: subTitleMessage[(donationState?.action).toLowerCase()],
      accountDebited: this.debitedAccountSelected as IAccount,
      fundationAccount: this.fundationAccountSelected as IDonationAccount,
      amount: this.formValues?.amount as any,
      referenceNumber: this.reference as string,
      dateTime: this.dateTime as string,
      isAmountFromST: true,
    };

    this.voucherLayout = this.donationDefinitionManager.builderLayoutConfirmationStep3({ ...confirm });
    this.nextButtonMessage = ESTButtonMessage[(donationState?.action)];
  }

  voucherForSignatureTracking(parameters: IDTDFormRequest, isModifyTransaction: boolean = false) {
    const { title, subtitle, message, typeAlert } = parameters ?? {};

    const confirm: IDTDVoucherSample = {
      title,
      subtitle,
      accountDebited: this.debitedAccountSelected as IAccount,
      fundationAccount: this.fundationAccountSelected as IDonationAccount,
      amount: this.formValues?.amount as any,
      referenceNumber: this.reference as string,
      dateTime: this.dateTime as string,
    };

    this.voucherLayout = this.donationDefinitionManager.builderLayoutVoucherStep2({ ...confirm }, isModifyTransaction);

    if (message) {
      const alertType = typeAlert ? typeAlert : 'info';
      this.showAlert(alertType, message);
    }

  }

  voucherModifySignatureTracking() {
    this.voucherForSignatureTracking({
      message: 'signature_trackingModifyMessage',
      title: 'signature_tracking',
      subtitle: 'signature_tackingModifyConfirmationTransaction',
      typeAlert: 'success',
    }, true);
    this.headBandLayoutBuilder();
    this.hiddenPrintButton();
  }

  voucherDetailSignatureTracking() {
    const confirm: IDTDVoucherSample = {
      title: 'signature_tracking',
      subtitle: 'view_detail_transaction',
      accountDebited: this.debitedAccountSelected as IAccount,
      fundationAccount: this.fundationAccountSelected as IDonationAccount,
      amount: this.formValues?.amount as any,
      referenceNumber: this.reference as string,
      dateTime: this.dateTime as string,
      isAmountFromST: true
    };

    this.voucherLayout = this.donationDefinitionManager.builderLayoutConfirmationStep3({ ...confirm });

    this.hiddenPrintButton();
  }

  handleExecuteOperations() {
    const donationState = this.parameterManagement.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = donationState?.transactionSelected;
    const position: number = donationState?.position;

    if (donationState?.action === ESignatureTrackingTypeAction.PROCESS) {
      this.donationProcess.processSingleDonationHandler(transactionSelected.serviceCode);
      return;
    }

    this.utils.showLoader();
    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action: donationState?.action
    });
  }

  /* ===================================== SIGNATURE TRACKING  ============================*/


  /* ===================================== HISTORY TRANSACTION ============================*/

  voucherForHistoryTransaction() {
    const voucherProperties: IDTDVoucherBuilder = {
      date: this.dateTime as string,
      reference: this.reference as string,
      titlePdf: 'donation-title',
      fileNamePdf: 'title-pdf:donations',
      fundationAccount: this.fundationAccountSelected as IDonationAccount,
      accountDebited: this.debitedAccountSelected as IAccount,
      formValues: this.formValues as IDonationFormValues,
      title: 'donation.title',
      subtitle: 'proof_donations',
      isAmountFromST: true,
    };

    const {
      layoutVoucher,
      pdfLayout,
      headBandLayout,
      layoutVoucherModal } = this.donationExecuteManager.voucherLayoutsMainBuilderStep3({ ...voucherProperties });

    this.voucherLayout = layoutVoucher;
    this.modalLayout = layoutVoucherModal;
    this.headBandLayout = headBandLayout;
    this.pdfLayout = pdfLayout;
  }


  /* ===================================== HISTORY TRANSACTION ============================*/


  /* ===================================== UTILITIES ============================*/

  storageToBackSignatureTracking(currentStep: number) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: {
        position: currentStep,
      },
    });
  }

  resetStorage(navParams: string | null) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: navParams,
      navigateStateParameters: null,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenPrintButton() {
    this.isShowPrintButton = !this.isShowPrintButton;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
  /* ===================================== UTILITIES ============================*/
}
