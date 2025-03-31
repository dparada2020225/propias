import { AdfConfirmationModalComponent, AdfFormatService, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { EProfile } from 'src/app/enums/profile.enum';
import { ETHNavigationParameters } from 'src/app/modules/transaction-manager/modules/transaction-history/enums/transaction-history.enum';
import { IPrint } from 'src/app/modules/transfer/interface/print-data-interface';
import { TransfersPrintService } from 'src/app/modules/transfer/prints/transfers-print.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from '../../../../../../../environments/environment';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { ITMTransaction } from '../../../../../transaction-manager/interfaces/tm-transaction.interface';
import { EOwnTransferViewMode } from '../../enum/own-transfer.enum';
import { IResponseOwnTransfers } from '../../interfaces/own-transfer-respoce.interface';
import {
  IOwnAccount,
  IOwnTransferFormValues,
  IOwnTransferState,
  IOwnTransferSTVoucherParam
} from '../../interfaces/own-transfer.interface';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import { FeatureManagerService } from '../../../../../../service/common/feature-manager.service';
import {
  OtdTransferConfirmManagerService
} from '../../services/definition/manager/otd-transfer-confirm-manager.service';
import { OteTransferManagerService } from '../../services/execution/ote-transfer-manager.service';
import { EOwnTransferUrlNavigationCollection } from '../../enum/navigation-parameter.enum';
import {
  ETransactionHistoryUrlNavigationCollection
} from '../../../../../transaction-manager/modules/transaction-history/enums/th-navigate.enum';
import { EOwnTransferTypeTransaction } from '../../enum/own-transfer-control-name.enum';
import { IOTDConfirm, IOTDForm } from '../../interfaces/own-transfer-definition.interface';
import { IOTEVoucherLayoutRequest, TYPE_OWN_TRANSFERENCE } from '../../interfaces/own-transfer-execution.interface';
import {
  subTitleMessage
} from '../../../../../transaction-manager/modules/signature-tracking/enum/signature-tracking.enum';
import { ESTButtonMessage } from '../../../../../transaction-manager/modules/signature-tracking/enum/st-common.enum';
import {
  ESignatureTrackingTypeAction
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import { getTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import {
  StOperationHandlerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import {
  StProcessAtomicService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-process-atomic.service';

@Component({
  selector: 'byte-own-voucher',
  templateUrl: './own-voucher.component.html',
  styleUrls: ['./own-voucher.component.scss'],
})
export class OwnVoucherComponent implements OnInit, OnDestroy {
  typeAlert: string | undefined = undefined;
  messageAlert: string | undefined = undefined;

  accountAccreditSelected: IOwnAccount | null = null;
  accountDebitedSelected: IOwnAccount | null = null;
  formValues: IOwnTransferFormValues | null = null;

  modalLayout: IConfirmationModal | null = null;
  pdfLayout: IPrint | undefined = undefined;
  headBandLayout: IHeadBandAttribute[] = [];
  confirmationLayout: IDataReading | null = null;
  transactionResponse: IResponseOwnTransfers | null = null;
  isShowPrintButton: boolean = true;
  isShowHeadband = true;
  view: EOwnTransferViewMode | null = null;
  nextButtonMessage = 'print';
  currentStep: number | null = null;
  routerSubscription: Subscription;
  typeProfile:string = environment.profile;
  profileSV:EProfile = EProfile.SALVADOR;
  profilePA:EProfile =  EProfile.PANAMA;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typePrevButton() {
    return !this.isShowPrintButton && this.typeProfile === EProfile.HONDURAS ? 'primary' : 'secondary';
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private executionServiceManager: OteTransferManagerService,
    private parameterManagement: ParameterManagementService,
    private definitionServiceManager: OtdTransferConfirmManagerService,
    private pdfService: TransfersPrintService,
    private stOperationHandler: StOperationHandlerService,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private stProcessSingleTransaction: StProcessAtomicService,
    private utils: UtilService,
    private managementMethod: FeatureManagerService
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate' && this.view === EOwnTransferViewMode.SIGNATURE_TRACKING_MODIFY) {
        this.resetStorage(null);
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).then(() => {});
      }
    });
  }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];
    const ownTransferState: IOwnTransferState = this.parameterManagement.getParameter('navigateStateParameters');

    this.accountDebitedSelected = ownTransferState?.debitedAccount;
    this.accountAccreditSelected = ownTransferState?.accreditAccount;
    this.formValues = ownTransferState.formValues;
    this.transactionResponse = ownTransferState?.transactionResponse as never;

    this.initDefinition(ownTransferState);
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  initDefinition(state: IOwnTransferState) {
    switch (this.view) {
      case EOwnTransferViewMode.DEFAULT:
        this.buildScreenLayout(state);
        break;
      case EOwnTransferViewMode.TRANSACTION_HISTORY:
        this.voucherLayoutForTransactionHistory();
        break;
      case EOwnTransferViewMode.SIGNATURE_TRACKING:
        this.buildSignatureTrackingScreen({
          message: undefined as never,
          title: 'signature_tracking_label',
          subTitle: 'view_detail_transaction',
        });
        break;
      case EOwnTransferViewMode.SIGNATURE_TRACKING_OPERATION:
        this.signatureTransactionOperationDefinition();
        break;
      case EOwnTransferViewMode.SIGNATURE_TRACKING_MODIFY:
        this.buildVoucherForUpdateTransactionMode();
        break;
    }
  }

  nextStep() {
    if (this.view === EOwnTransferViewMode.DEFAULT || this.view === EOwnTransferViewMode.TRANSACTION_HISTORY) {
      this.openModal();
      return;
    }

    if (this.view === EOwnTransferViewMode.SIGNATURE_TRACKING_OPERATION) {
      this.handleExecuteOperation();
    }
  }

  lastStep() {
    this.utils.showLoader();
    switch (this.view) {
      case EOwnTransferViewMode.DEFAULT:
        this.resetStorage(null);
        this.router.navigate([EOwnTransferUrlNavigationCollection.HOME]).finally(() => this.utils.hideLoader());
        break;

      case EOwnTransferViewMode.SIGNATURE_TRACKING_MODIFY:
        this.resetStorage(null);
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
        break;

      case EOwnTransferViewMode.TRANSACTION_HISTORY:
        this.resetStorage(ETHNavigationParameters.CONSULT);
        this.router.navigate([ETransactionHistoryUrlNavigationCollection.CONSULT]).finally(() => this.utils.hideLoader());
        break;

      case EOwnTransferViewMode.SIGNATURE_TRACKING_OPERATION:
      case EOwnTransferViewMode.SIGNATURE_TRACKING:
        this.storageToBackSignatureTracking(this.currentStep as never);
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
        break;
    }
  }

  /* ========================================= DEFAULT TRANSACTION ===================================================*/

  buildScreenLayout(state: IOwnTransferState) {
    switch (state?.typeTransaction) {
      case EOwnTransferTypeTransaction.DEFAULT:
        if (this.managementMethod.implementMethod()) {
          this.voucherLayoutsMainBuilder({
            title: 'own-transfer',
            subtitle: 'transfer_confirmation',
            message: 'transfer_successfully_bipa',
          });
        }else{
          this.voucherLayoutsMainBuilder({
            title: 'own-transfer',
            subtitle: 'transfer_confirmation',
            message: 'transfer_successfully',
          });
        }

        break;
      case EOwnTransferTypeTransaction.SIGNATURE_TRACKING:
        this.buildSignatureTrackingScreen({
          message: state?.message as never,
          title: 'own-transfer',
          subTitle: 'transfer_confirmation',
        });
        break;
      default:
        this.voucherLayoutsMainBuilder({
          title: 'own-transfer',
          subtitle: 'transfer_successfully',
          message: 'transfer_confirmation',
        });
        break;
    }
  }

  voucherLayoutsMainBuilder(parameters: IOTDForm): void {
    const { title, subtitle, message } = parameters;

    const builderParameters: IOTEVoucherLayoutRequest = {
      date: this.transactionResponse?.date as never,
      reference: this.transactionResponse?.reference as never,
      titlePdf: `${this.typeProfile === this.profileSV || this.profilePA ? 'voucher-transfer_own-modal' : 'own-transfer'}`,
      fileNamePdf: 'title-pdf:own-transfer',
      accountCredit: this.accountAccreditSelected as never,
      accountDebited: this.accountDebitedSelected as never,
      formValues: this.formValues as any,
      title,
      subtitle,
    };

    const { layoutJsonVoucher, headBandLayout, layoutJsonVoucherModal, pdfLayout } =
      this.executionServiceManager.voucherLayoutsMainBuilderStep3(builderParameters);

    this.confirmationLayout = layoutJsonVoucher;
    this.headBandLayout = headBandLayout;
    this.modalLayout = layoutJsonVoucherModal;
    this.pdfLayout = pdfLayout;

    this.showAlert('success', message);
  }

  openModal() {
    let voucher_customization
  switch (environment.profile) {
    case EProfile.SALVADOR:
      voucher_customization = 'voucher-modal-bisv';
      break;
      case EProfile.PANAMA:
      voucher_customization = 'voucher-modal-bipa';
      break;
    default:
      break;
  }

    const voucherModal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} ${voucher_customization} voucher-modal `,
      size: `lg`,
    });

    voucherModal.componentInstance.data = this.modalLayout;

    voucherModal.result
      .then((isConfirm) => {
        if (!isConfirm) {
          return;
        }

        this.exportFile();
      })
      .catch((error) => error);
  }

  /* ========================================= DEFAULT TRANSACTION ===================================================*/

  /* ========================================= SIGNATURE TRANSACTION ===================================================*/
  buildVoucherForUpdateTransactionMode() {
    const confirm: IOTDConfirm = {
      title: 'signature_tracking_label',
      subtitle: 'signature_tackingModifyConfirmationTransaction',
      accountDebited: this.accountDebitedSelected as never,
      accountCredit: this.accountAccreditSelected as never,
      amount: this.formValues?.amount as any,
      comment: this.formValues?.comment as string,
      reference: this.transactionResponse?.reference,
      isSignatureTrackingMode: true,
    };

    this.confirmationLayout = this.definitionServiceManager.builderLayoutConfirmationStep2(confirm);

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(this.transactionResponse?.date as never),
      reference: this.transactionResponse?.reference as never,
    };

    this.showAlert('success', 'signature_trackingModifyMessage');
    this.headBandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
    this.isShowPrintButton = !this.isShowPrintButton;
  }

  signatureTransactionOperationDefinition() {
    const ownTransferState = this.parameterManagement.getParameter('navigateStateParameters');
    this.currentStep = ownTransferState?.position;

    this.buildSignatureTrackingScreen({
      message: undefined as never,
      title: 'signature_tracking_label',
      subTitle: subTitleMessage[(ownTransferState?.action ?? '' ).toLowerCase()],
    });


    this.nextButtonMessage = ESTButtonMessage[ownTransferState?.action];
  }

  buildSignatureTrackingScreen(parameters: IOwnTransferSTVoucherParam) {
    const ownTransferState = this.parameterManagement.getParameter('navigateStateParameters');
    this.currentStep = ownTransferState?.position;
    const { message, title, subTitle } = parameters ?? {};

    const confirm: IOTDConfirm = {
      title,
      subtitle: subTitle,
      accountDebited: this.accountDebitedSelected!,
      accountCredit: this.accountAccreditSelected!,
      amount: this.formValues?.amount as any,
      comment: this.formValues?.comment as any,
    };

    this.confirmationLayout = this.definitionServiceManager.builderLayoutConfirmationStep2(confirm);

    if (this.view !== EOwnTransferViewMode.SIGNATURE_TRACKING_OPERATION) {
      this.isShowPrintButton = !this.isShowPrintButton;
      this.isShowHeadband = !this.isShowHeadband;
    }

    if (message) {
      this.showAlert('info', message);
    }
  }

  handleExecuteOperation() {
    const ownTransferState = this.parameterManagement.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = ownTransferState?.transactionSelected;
    const position: number = ownTransferState?.position;

    if (ownTransferState?.action === ESignatureTrackingTypeAction.PROCESS) {
      this.stProcessSingleTransaction.execute(getTypeTransaction(TYPE_OWN_TRANSFERENCE));
      return;
    }

    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action: ownTransferState?.action
    });
  }

  /* ========================================= SIGNATURE TRANSACTION ===================================================*/

  /* ========================================= TRANSACTION HISTORY ===================================================*/

  voucherLayoutForTransactionHistory(): void {
    const builderParameters: IOTEVoucherLayoutRequest = {
      date: this.transactionResponse?.date as never,
      reference: this.transactionResponse?.reference as never,
      titlePdf: 'own-transfer',
      fileNamePdf: 'title-pdf:own-transfer',
      accountCredit: this.accountAccreditSelected as never,
      accountDebited: this.accountDebitedSelected as never,
      formValues: this.formValues as any,
      title: 'own-transfer',
      subtitle: 'transfer_confirmation',
      isAmountFromST: true,
    };

    const { layoutJsonVoucher, headBandLayout, layoutJsonVoucherModal, pdfLayout } =
      this.executionServiceManager.voucherLayoutsMainBuilderStep3(builderParameters);

    this.confirmationLayout = layoutJsonVoucher;
    this.headBandLayout = headBandLayout;
    this.modalLayout = layoutJsonVoucherModal;
    this.pdfLayout = pdfLayout;
  }

  /* ========================================= TRANSACTION HISTORY ===================================================*/

  /* ================================================= UTILITIES  ====================================================*/

  exportFile() {
    const { account, reference, title, fileName, items } = this.pdfLayout as IPrint;

    this.pdfService.pdfGenerate(account, reference, fileName, 268, title, items, true);
  }

  storageToBackSignatureTracking(currentStep: number) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: {
        position: currentStep,
      },
    });
  }

  resetStorage(parameterNav: string | null) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: parameterNav,
      navigateStateParameters: null,
    });
  }

  showAlert(type: string, message?: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = undefined;
    this.messageAlert = undefined;
  }

  /* ================================================= UTILITIES  ====================================================*/
}
