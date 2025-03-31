import {
  AdfConfirmationModalComponent,
  AdfFormatService,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute
} from '@adf/components';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EProfile} from 'src/app/enums/profile.enum';
import {
  subTitleMessage
} from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/signature-tracking.enum';
import {ESTButtonMessage} from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-common.enum';
import {
  ESignatureTrackingUrlFlow
} from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import {
  ESignatureTrackingTypeAction
} from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import {
  ETransactionHistoryUrlNavigationCollection
} from 'src/app/modules/transaction-manager/modules/transaction-history/enums/th-navigate.enum';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {environment} from '../../../../../../../../environments/environment';
import {IAccount} from '../../../../../../../models/account.inteface';
import {IHeadBandLayoutConfirm} from '../../../../../../../models/util-work-flow.interface';
import {UtilService} from '../../../../../../../service/common/util.service';
import {ITMTransaction} from '../../../../../../transaction-manager/interfaces/tm-transaction.interface';
import {
  ETHNavigationParameters
} from '../../../../../../transaction-manager/modules/transaction-history/enums/transaction-history.enum';
import {IPrint} from '../../../../../interface/print-data-interface';
import {IThirdTransfersAccounts} from '../../../../../interface/transfer-data-interface';
import {TransfersPrintService} from '../../../../../prints/transfers-print.service';
import {EThirdTransferTypeTransaction} from '../../../enums/third-transfer-menu-options-licenses.enum';
import {
  EThirdTransferUrlNavigationCollection,
  EThirdTransferViewMode
} from '../../../enums/third-transfer-navigate-parameters.enum';
import {ITTEVoucherLayoutRequest} from '../../../interfaces/third-transfer-execution.interface';
import {IThirdTransferTransactionState} from '../../../interfaces/third-transfer-persistence.interface';
import {
  IInfoFavorite,
  IThirdTransferFormValues,
  IThirdTransferSampleVoucher,
  IThirdTransferSTVoucher,
} from '../../../interfaces/third-transfer.interface';
import {TtdTransferManagerService} from '../../../services/definition/transaction/manager/ttd-transfer-manager.service';
import {TteTransferVoucherService} from '../../../services/execution/tte-transfer-voucher.service';
import {IAddFavoriteACH} from "../../../../transfer-ach/interfaces/ach-transfer.interface";
import {
  StOperationHandlerService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import {
  StThirdPartyTransferService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/execution/definitions/bisv/multiple/st-third-party-transfer.service';

@Component({
  selector: 'byte-tt-transaction-voucher',
  templateUrl: './tt-transaction-voucher.component.html',
  styleUrls: ['./tt-transaction-voucher.component.scss'],
})
export class TtTransactionVoucherComponent implements OnInit {
  typeAlert: string | undefined;
  messageAlert: string | undefined;

  accountDebitedSelected: IAccount | null = null;
  accountAccreditSelected: IThirdTransfersAccounts | null = null;
  formValues: IThirdTransferFormValues | null = null;

  voucherLayout: IDataReading | null = null;
  voucherModalLayout: IConfirmationModal | null = null;
  typeTransaction: string | null = null;

  pdfLayout!: IPrint;
  headbandLayout: IHeadBandAttribute[] = [];
  viewMode: EThirdTransferViewMode | null = null;
  reference!: string;
  dateTime!: string;
  isShowPrintButton = true;
  isShowHeadband = true;
  currentStep!: number;
  nextButtonMessage = 'print';

  typeProfile: string = EProfile.SALVADOR;
  private profile: string = environment.profile;

  isFavorite: boolean = false;
  accountToSendFavorite: IAddFavoriteACH | null = null;
  isSignature: boolean = false;

  get isShowFavoriteWidget() {
    return this.viewMode === EThirdTransferViewMode.DEFAULT && this.profile === this.typeProfile;
  }

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typePrevButton() {
    return !this.isShowPrintButton && this.typeProfile === EProfile.HONDURAS ? 'primary' : 'secondary';
  }

  get classNameLayoutVoucher() {
    const classNameLayout = {
      [EProfile.SALVADOR]: 'layout_sv'
    }
    return classNameLayout[this.profile] || ''
  }

  get classNameButtons() {
    const classNameBtn = {
      [EProfile.SALVADOR]: 'hover_button-primary-sv container-sv'
    }
    return classNameBtn[this.profile] || ''
  }

  get classNameHeadband() {
    const classNameHeadband = {
      [EProfile.SALVADOR]: 'headBand-sv'
    }
    return classNameHeadband[this.profile] || ''
  }

  get classSignature(): string {
    return this.isSignature ? 'new-signature' : '';
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private pdfService: TransfersPrintService,
    private activatedRoute: ActivatedRoute,
    private thirdTransferManager: TtdTransferManagerService,
    private parameterManagement: ParameterManagementService,
    private confirmationScreenManager: TteTransferVoucherService,
    private stOperationHandler: StOperationHandlerService,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private stProcessSingleTransaction: StThirdPartyTransferService,
    private utils: UtilService,
  ) {
    this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        if (this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING) {
          this.parameterManagement.sendParameters({
            navigationProtectedParameter: null,
            navigateStateParameters: null,
          });

          this.router.navigate([ESignatureTrackingUrlFlow.HOME]).then(() => {
          });
          return;
        }

        if (this.viewMode === EThirdTransferViewMode.DEFAULT) {
          this.resetStorage();
          return;
        }
      }
    });
  }

  ngOnInit(): void {
    this.initDefinition();
    this.viewDefinition();
  }

  initDefinition() {
    this.viewMode = this.activatedRoute.snapshot.data['view'];
    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');
    this.accountAccreditSelected = transactionState?.targetAccount;
    this.accountDebitedSelected = transactionState?.sourceAccount;
    this.formValues = transactionState?.formValues as never;
    this.typeTransaction = transactionState?.typeTransaction as never;
    this.reference = transactionState?.transactionResponse?.reference;
    this.dateTime = transactionState?.transactionResponse?.date ?? transactionState?.transactionResponse?.dateTime;
    this.currentStep = transactionState?.position as never;

    if (this.profile === this.typeProfile) {
      this.isFavorite = this.accountAccreditSelected?.favorite || false;
      this.accountToSendFavorite = {
        number: this.accountAccreditSelected?.account || '',
        alias: this.accountAccreditSelected?.alias || '',
      }
    }

  }

  viewDefinition() {
    switch (this.viewMode) {
      case EThirdTransferViewMode.DEFAULT:
        this.buildVoucherToDefaultScreen();
        break;
      case EThirdTransferViewMode.TRANSACTION_HISTORY:
        this.buildVoucherForTransactionManager();
        break;
      case EThirdTransferViewMode.SIGNATURE_TRACKING:
        this.buildVoucherToSignatureTrackingModifyTransaction();
        break;
      case EThirdTransferViewMode.SIGNATURE_TRACKING_DETAIL:
        this.buildVoucherToSignatureTrackingDetail();
        break;
      case EThirdTransferViewMode.SIGNATURE_TRACKING_OPERATION:
        this.signatureTransactionOperationDefinition();
        break;
      default:
        this.buildVoucherToDefaultScreen();
        break;
    }
  }

  nextStep() {
    if (this.viewMode === EThirdTransferViewMode.DEFAULT || this.viewMode === EThirdTransferViewMode.TRANSACTION_HISTORY) {
      this.openProofModal();
      return;
    }

    if (this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING_OPERATION) {
      this.handleExecuteOperations();
    }
  }

  prevStep() {
    this.utils.showLoader();

    switch (this.viewMode) {
      case EThirdTransferViewMode.DEFAULT: {
        this.resetStorage();

        const mapRouterProfile = {
          [EProfile.SALVADOR]: EThirdTransferUrlNavigationCollection.HOMESV,
          [EProfile.HONDURAS]: EThirdTransferUrlNavigationCollection.HOME,
        }

        this.router.navigate([mapRouterProfile[this.profile] || EThirdTransferUrlNavigationCollection.HOME]).finally(() => this.utils.hideLoader());
      }
        break;
      case EThirdTransferViewMode.TRANSACTION_HISTORY:
        this.resetStorageTransactionManager();
        this.router.navigate([ETransactionHistoryUrlNavigationCollection.CONSULT]).finally(() => this.utils.hideLoader());
        break;
      case EThirdTransferViewMode.SIGNATURE_TRACKING_OPERATION:
      case EThirdTransferViewMode.SIGNATURE_TRACKING:
      case EThirdTransferViewMode.SIGNATURE_TRACKING_DETAIL:
        this.storageToBackSignatureTracking(this.currentStep);
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
        break;
    }
  }

  /* ===================================== SIGNATURE TRACKING TRANSACTION =============================================*/

  signatureTransactionOperationDefinition() {
    const thirdTransferState = this.parameterManagement.getParameter('navigateStateParameters');

    this.buildVoucherToSignatureTracking({
      message: undefined as never,
      title: 'signature_tracking_label',
      subTitle: subTitleMessage[(thirdTransferState?.action ?? '').toLowerCase()],
    });

    this.nextButtonMessage = ESTButtonMessage[thirdTransferState?.action];
  }

  buildVoucherToSignatureTracking(parameters: IThirdTransferSTVoucher, isModify = false) {
    const {message, title, subTitle, typeAlert} = parameters ?? {};

    const voucherProperties: IThirdTransferSampleVoucher = {
      accountToCredit: this.accountAccreditSelected as never,
      accountToDebit: this.accountDebitedSelected as never,
      formValues: this.formValues as never,
      isFavorite: false,
      title,
      subtitle: subTitle,
      reference: this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING ? this.reference ?? undefined : undefined,
    };

    this.voucherLayout = this.thirdTransferManager.buildTransferVoucherStep2(voucherProperties, false);

    if (message) {

      const mapTypeAlertProfile = {
        [EProfile.SALVADOR]: isModify ? 'success' : 'warning',
        [EProfile.HONDURAS]: typeAlert,
      }

      this.showAlert(`${mapTypeAlertProfile[this.profile] || 'info'}`, message);
    }
  }

  buildVoucherToSignatureTrackingDetail() {
    this.buildVoucherToSignatureTracking({
      title: 'signature_tracking_label',
      subTitle: 'view_detail_transaction',
      message: undefined as never,
      typeAlert: undefined as never,
    });

    this.hiddePrintButton();
    this.hiddenHeadBand();
  }

  buildVoucherToSignatureTrackingModifyTransaction() {
    this.buildVoucherToSignatureTracking({
      title: 'signature_tracking_label',
      subTitle: 'trackingSignature:edit_transaction_successfully',
      message: 'signature_trackingModifyMessage',
      typeAlert: 'success',
    }, true);
    this.headBandLayoutBuilder();
    this.hiddePrintButton();
  }

  handleExecuteOperations() {
    const thirdTransferState = this.parameterManagement.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = thirdTransferState?.transactionSelected;
    const position: number = thirdTransferState?.position;

    if (thirdTransferState?.action === ESignatureTrackingTypeAction.PROCESS) {
      this.stProcessSingleTransaction.executeSingleTransaction(transactionSelected.serviceCode);
      return;
    }

    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action: thirdTransferState?.action
    });
  }

  /* ===================================== SIGNATURE TRACKING TRANSACTION =============================================*/

  /* ===================================== DEFAULT TRANSACTION =============================================*/

  buildVoucherToDefaultScreen() {
    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');

    switch (transactionState?.typeTransaction) {
      case EThirdTransferTypeTransaction.DEFAULT:
        this.buildThirdTransferVoucher();
        break;
      case EThirdTransferTypeTransaction.SIGNATURE_TRACKING:
        this.buildVoucherToSignatureTracking({
          title: 'transfers-third-title',
          subTitle: 'transfer_confirmation',
          message: transactionState?.message as never,
        });
        this.isShowPrintButton = !this.isShowPrintButton;
        this.isSignature = true;
        this.isShowHeadband = !this.isShowHeadband;

        break;
      default:
        this.buildThirdTransferVoucher();
        break;
    }
  }

  buildThirdTransferVoucher() {
    const builderParameters: ITTEVoucherLayoutRequest = {
      date: this.dateTime as never,
      reference: this.reference as never,
      titlePdf: 'transfers-third-title',
      fileNamePdf: 'title-pdf:third-party-transfer',
      accountCredit: this.accountAccreditSelected as never,
      accountDebited: this.accountDebitedSelected as never,
      formValues: this.formValues as never,
      title: 'transfers-third-title',
      subtitle: '',
    };

    const {layoutJsonVoucher, headBandLayout, layoutJsonVoucherModal, pdfLayout} =
      this.confirmationScreenManager.voucherLayoutsMainBuilder(builderParameters);

    this.voucherModalLayout = layoutJsonVoucherModal;
    this.voucherLayout = layoutJsonVoucher;
    this.pdfLayout = pdfLayout;
    this.headbandLayout = headBandLayout;

    const mapMessageSuccess = {
      [EProfile.HONDURAS]: 'transfer_successfully',
      [EProfile.SALVADOR]: 'transfer_successfully_sv'
    }


    this.showAlert('success', mapMessageSuccess[this.profile] || 'transfer_successfully');
  }

  /* ===================================== DEFAULT TRANSACTION =============================================*/

  /* ===================================== HISTORY TRANSACTION =============================================*/

  buildVoucherForTransactionManager() {
    const builderTransactionManagerParameters: ITTEVoucherLayoutRequest = {
      date: this.dateTime as never,
      reference: this.reference as never,
      titlePdf: 'transfers-third-title',
      fileNamePdf: 'title-pdf:third-party-transfer',
      accountCredit: this.accountAccreditSelected as never,
      accountDebited: this.accountDebitedSelected as never,
      formValues: this.formValues as never,
      title: 'transfers-third-title',
      subtitle: 'transfer_confirmation',
    };

    const {layoutJsonVoucher, headBandLayout, layoutJsonVoucherModal, pdfLayout} =
      this.confirmationScreenManager.voucherLayoutsMainBuilder(builderTransactionManagerParameters);

    this.voucherModalLayout = layoutJsonVoucherModal;
    this.voucherLayout = layoutJsonVoucher;
    this.pdfLayout = pdfLayout;
    this.headbandLayout = headBandLayout;
  }

  /* ===================================== HISTORY TRANSACTION =============================================*/

  /* ===================================== DEFAULT AND HISTORY TRANSACTION =============================================*/

  openProofModal(): void {

    const classNameModal = {
      [EProfile.SALVADOR]: 'voucher-modal-bisv'
    }

    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} ${classNameModal[this.profile] || ''}  voucher-modal`,
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
    const {account, reference, title, fileName, items} = this.pdfLayout;
    this.pdfService.pdfGenerate(account, reference, fileName, 268, title, items, true);
  }

  /* ===================================== DEFAULT AND HISTORY TRANSACTION =============================================*/

  headBandLayoutBuilder(): void {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(this.dateTime),
      reference: this.reference,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  hiddePrintButton() {
    this.isShowPrintButton = !this.isShowPrintButton;
  }

  hiddenHeadBand() {
    this.isShowHeadband = !this.isShowHeadband;
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  resetStorage() {
    this.parameterManagement.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    });
  }

  storageToBackSignatureTracking(currentStep: number) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: {
        position: currentStep,
      },
    });
  }

  resetStorageTransactionManager() {
    this.parameterManagement.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: ETHNavigationParameters.CONSULT,
    });
  }

  changeInfoAndShowAlert(data: IInfoFavorite) {
    const {favorite, typeAlert, message} = data

    this.isFavorite = favorite;

    if (typeAlert && message) {
      this.typeAlert = typeAlert!;
      this.messageAlert = message!
    }
  }
}
