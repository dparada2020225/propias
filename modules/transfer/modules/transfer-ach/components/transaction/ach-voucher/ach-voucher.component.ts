import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdfConfirmationModalComponent, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AteTransferManagerService } from '../../../services/execution/ate-transfer-manager.service';
import { AtdTransferManagerService } from '../../../services/definition/transaction/atd-transfer-manager.service';
import { IAchFormValues } from '../../../interfaces/ach-transfer.interface';
import { IAchAccount } from '../../../interfaces/ach-account-interface';
import { IAccount } from '../../../../../../../models/account.inteface';
import { IACHTransactionNavigateParametersState } from '../../../interfaces/ach-persists-parameters.interface';
import { ACH_PARAMETERS_HELPERS, EACHTransactionViewMode, EACHTypeTransaction } from '../../../enum/transfer-ach.enum';
import { IATEVoucherLayout } from '../../../interfaces/ach-transfer-definition.inteface';
import { TranslateService } from '@ngx-translate/core';
import { ETHNavigationParameters } from '../../../../../../transaction-manager/modules/transaction-history/enums/transaction-history.enum';
import { ITMTransaction } from '../../../../../../transaction-manager/interfaces/tm-transaction.interface';
import { ESignatureTrackingTypeAction } from '../../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../../service/common/util.service';
import { EACHTransferUrlNavigationCollection } from '../../../enum/navigation-parameter.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import {
  ETransactionHistoryUrlNavigationCollection
} from '../../../../../../transaction-manager/modules/transaction-history/enums/th-navigate.enum';
import { ESTButtonMessage } from '../../../../../../transaction-manager/modules/signature-tracking/enum/st-common.enum';
import {
  subTitleMessage
} from '../../../../../../transaction-manager/modules/signature-tracking/enum/signature-tracking.enum';
import { IACHSettings } from '../../../interfaces/settings.interface';
import { IPrint } from '../../../../../interface/print-data-interface';
import { TransfersPrintService } from '../../../../../prints/transfers-print.service';
import {
  StOperationHandlerService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import {
  StAchProcessSingleService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/execution/definitions/bp/atomic/st-ach-process-single.service';

@Component({
  selector: 'byte-ach-voucher',
  templateUrl: './ach-voucher.component.html',
  styleUrls: ['./ach-voucher.component.scss'],
})
export class AchVoucherComponent implements OnInit {
  targetAccountSelected: IAchAccount | null = null;
  formValues: IAchFormValues | undefined;
  sourceAccountSelected: IAccount | undefined;

  voucherLayout: IDataReading | null = null;
  voucherModalLayout: IConfirmationModal | null = null;
  pdfLayout!: IPrint;
  headbandLayout: IHeadBandAttribute[] = [];

  typeAlert: string | undefined;
  messageAlert: string | undefined;
  isShowPrintButton: boolean = true;
  isShowHeadband = true;

  dateTime: string | undefined;
  reference: string | undefined;
  view: EACHTransactionViewMode | null = null;
  typeTransaction: EACHTypeTransaction | undefined;
  currentTabPosition: number | undefined;
  printButtonMessage = 'print';
  generalSettings: IACHSettings[] = [];
  associatedAccounts: IAchAccount[] = [];

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typePrevButton() {
    return !this.isShowPrintButton ? 'primary' : 'secondary';
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private persistStepStateService: ParameterManagementService,
    private pdfService: TransfersPrintService,
    private transactionExecuteManagerDefinition: AteTransferManagerService,
    private transactionDefinitionManager: AtdTransferManagerService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private stOperationHandler: StOperationHandlerService,
    private utils: UtilService,
    private stACHProcess: StAchProcessSingleService,
  ) {
  }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];
    this.generalSettings = this.activatedRoute.snapshot.data?.['settings'] ?? [];
    this.associatedAccounts = this.activatedRoute.snapshot.data?.['associatedAccounts'] ?? [];

    this.initDefinition();
    this.initViewInit();
    this.utils.hideLoader();
  }

  initDefinition() {
    const achStateParameters: IACHTransactionNavigateParametersState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.targetAccountSelected = achStateParameters?.targetAccount;
    this.sourceAccountSelected = achStateParameters?.sourceAccount;
    this.formValues = achStateParameters?.formValues;
    this.dateTime = achStateParameters?.transactionResponse?.dateTime;
    this.reference = achStateParameters?.transactionResponse?.reference;
    this.typeTransaction = achStateParameters?.typeTransaction;
    this.currentTabPosition = achStateParameters?.position;
  }

  initViewInit() {
    switch (this.view) {
      case EACHTransactionViewMode.DEFAULT:
        this.voucherDefinitionForDefaultTransaction();
        break;
      case EACHTransactionViewMode.TRANSACTION_HISTORY:
        this.buildVoucherForDefaultTransactionAndTransactionHistory(ACH_PARAMETERS_HELPERS.IS_HIDDEN_ALERT_VOUCHER);
        break;
      case EACHTransactionViewMode.SIGNATURE_TRACKING:
        this.buildVoucherForSignatureTrackingDetail();
        break;
      case EACHTransactionViewMode.SIGNATURE_TRACKING_OPERATION:
        this.buildVoucherForSignatureTrackingOperations();
        break;
      case EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE:
        this.buildVoucherForUpdateTransaction();
        break;
    }
  }

  voucherDefinitionForDefaultTransaction() {
    switch (this.typeTransaction) {
      case EACHTypeTransaction.DEFAULT:
        this.buildVoucherForDefaultTransactionAndTransactionHistory(ACH_PARAMETERS_HELPERS.IS_SHOW_ALERT_VOUCHER);
        break;
      case EACHTypeTransaction.SIGNATURE_TRACKING:
        this.buildVoucherForSignatureTrackingTransaction('transfers_other_banks', 'transfer_confirmation', ACH_PARAMETERS_HELPERS.IS_HIDDEN_FAVORITE_WIDGET);
        this.isShowPrintButton = false;
        break;
      default:
        this.buildVoucherForDefaultTransactionAndTransactionHistory(ACH_PARAMETERS_HELPERS.IS_SHOW_ALERT_VOUCHER);
    }
  }

  buildVoucherForSignatureTrackingTransaction(title: string, subtitle: string, isShowFavoriteWidget = true) {
    const targetAccount = this.associatedAccounts.find((account) => account.account === this.targetAccountSelected?.account);
    const achStateParameters: IACHTransactionNavigateParametersState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.voucherLayout = this.transactionDefinitionManager.buildVoucherConfirmation(
      {
        accountToDebited: this.sourceAccountSelected as IAccount,
        accountToCredit: targetAccount ?? this.targetAccountSelected as IAchAccount,
        formValues: this.formValues as IAchFormValues,
        title,
        subtitle,
      },
      isShowFavoriteWidget
    );

    this.showAlert('info', achStateParameters?.message);
  }

  buildVoucherForSignatureTrackingDetail() {
    this.buildVoucherForSignatureTrackingTransaction('signature_tracking', 'view_detail_transaction', false);
    this.isShowPrintButton = !this.isShowPrintButton;
    this.isShowHeadband = !this.isShowHeadband;
  }

  buildVoucherForSignatureTrackingOperations() {
    const achState = this.persistStepStateService.getParameter('navigateStateParameters');

    const subtitle = subTitleMessage[(achState?.action).toLowerCase()];
    this.buildVoucherForSignatureTrackingTransaction('signature_tracking', subtitle, ACH_PARAMETERS_HELPERS.IS_HIDDEN_FAVORITE_WIDGET);
    this.isShowHeadband = !this.isShowHeadband;
    this.printButtonMessage = ESTButtonMessage[(achState?.action)];
  }

  buildVoucherForUpdateTransaction() {
    this.buildVoucherForSignatureTrackingTransaction('signature_tracking', 'trackingSignature:edit_transaction_successfully', ACH_PARAMETERS_HELPERS.IS_HIDDEN_FAVORITE_WIDGET);
    this.isShowPrintButton = false;
    this.showAlert(`success`, 'signature_trackingModifyMessage');
  }

  buildVoucherForDefaultTransactionAndTransactionHistory(isShowAlert: boolean) {
    const targetAccount = this.associatedAccounts.find((account) => account.account === this.targetAccountSelected?.account);

    const parametersVoucher: IATEVoucherLayout = {
      title: 'transfers_other_banks',
      subtitle: 'label:transaction-history',
      titlePdf: 'transfers_other_banks',
      fileNamePdf: this.translate.instant('pdf:ach'),
      formValues: this.formValues as IAchFormValues,
      sourceAccount: this.sourceAccountSelected as IAccount,
      targetAccount: targetAccount ?? this.targetAccountSelected as IAchAccount,
      reference: this.reference as string,
      dateTime: this.dateTime as string,
    };

    const { pdfLayout, voucherLayout, voucherModalLayout, headBandLayout } =
      this.transactionExecuteManagerDefinition.buildVoucherScreen(parametersVoucher);

    this.voucherLayout = voucherLayout;
    this.voucherModalLayout = voucherModalLayout;
    this.pdfLayout = pdfLayout as IPrint;
    this.headbandLayout = headBandLayout;

    isShowAlert && this.showAlert('success', 'success:ach_transfer');
  }

  print() {
    if (this.view === EACHTransactionViewMode.TRANSACTION_HISTORY || this.view === EACHTransactionViewMode.DEFAULT) {
      this.openProofACHTransactionModal();
      return;
    }

    if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_OPERATION) {
      this.handleExecuteOperations();
    }
  }

  openProofACHTransactionModal(): void {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal ach-transaction-modal`,
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

  back() {
    this.utils.showLoader();

    switch (this.view) {
      case EACHTransactionViewMode.DEFAULT:
        this.resetStorage();
        this.router.navigate([EACHTransferUrlNavigationCollection.HOME]).finally(() => this.utils.hideLoader());
        break;

      case EACHTransactionViewMode.TRANSACTION_HISTORY:
        this.resetStorage(ETHNavigationParameters.CONSULT);
        this.router.navigate([ETransactionHistoryUrlNavigationCollection.CONSULT]).finally(() => this.utils.hideLoader());
        break;

      case EACHTransactionViewMode.SIGNATURE_TRACKING_OPERATION:
      case EACHTransactionViewMode.SIGNATURE_TRACKING:
      case EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE:
        this.storageToBackSignatureTracking(this.currentTabPosition as number);
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
        break;
    }
  }

  handleExecuteOperations() {
    const achState = this.persistStepStateService.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = achState?.transactionSelected;
    const position: number = achState?.position;

    if (achState?.action === ESignatureTrackingTypeAction.PROCESS) {
      this.stACHProcess.execute({
        associatedAccounts: this.associatedAccounts,
        achSettings: this.generalSettings,
        sourceAccount: this.sourceAccountSelected as IAccount,
        transaction: transactionSelected,
      })
      return;
    }

    this.utils.showLoader();
    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action: achState?.action
    });
  }

  exportFile() {
    const { account, reference, title, fileName, items } = this.pdfLayout;
    this.pdfService.pdfGenerate(account, reference, fileName, 268, title, items, true);
  }

  resetStorage(navParameters?: string) {
    this.persistStepStateService.sendParameters({
      achParametersForm: null,
      navigationProtectedParameter: navParameters,
      navigateStateParameters: null,
    });
  }

  storageToBackSignatureTracking(currentStep: number) {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: {
        position: currentStep,
      },
    });
  }

  showAlert(typeAlert?: string, message?: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = undefined;
    this.messageAlert = undefined;
  }
}
