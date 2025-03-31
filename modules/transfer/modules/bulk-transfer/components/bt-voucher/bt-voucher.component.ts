import { IHeadBandAttribute, IDataReading, ITableStructure, IConfirmationModal, AdfFormatService } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AccountBuilder, IAccount } from 'src/app/models/account.inteface';
import { ITMTransaction } from 'src/app/modules/transaction-manager/interfaces/tm-transaction.interface';
import { ITransactionManagerAccountDetail } from 'src/app/modules/transaction-manager/interfaces/transaction-manger.interface';
import {
  ESignatureTrackingTypeAction,
} from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import { ETHNavigationParameters } from 'src/app/modules/transaction-manager/modules/transaction-history/enums/transaction-history.enum';
import { IPrint } from 'src/app/modules/transfer/interface/print-data-interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IAchAccount, IAChBulkTransferAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { IACHSettings } from '../../../transfer-ach/interfaces/settings.interface';
import { EBViewMode, EBTTypeTransaction } from '../../enum/bt-view.enum';
import { IBTDVoucherBuilder, HeadingFileBuilder, CurrentFileBuilder } from '../../interfaces/btd-voucher.interface';
import { IBulTransferFormValues, IBulkTransferConfirmState } from '../../interfaces/bulk-transfer-parameters.interface';
import { ICurrentFile, IHeadingFile } from '../../models/bulk-transfer.interface';
import { BtdTableService } from '../../services/definition/table/btd-table.service';
import { BtdTransactionManagerService } from '../../services/definition/transaction/btd-transaction-manager.service';
import { BteUtilsService } from '../../services/execution/bte-utils.service';
import { BteVoucherService } from '../../services/execution/bte-voucher.service';
import { BulkTransferPrintService } from '../../print/bulk-transfer-print.service';
import { BtProofVoucherModalComponent } from '../bt-proof-voucher-modal/bt-proof-voucher-modal.component';
import { IBTSaveTransactionDetailRequest, IBTSaveTransactionRequest } from '../../interfaces/bt-transaction.interface';
import {
  ETransactionHistoryUrlNavigationCollection
} from '../../../../../transaction-manager/modules/transaction-history/enums/th-navigate.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import { EBTUrlNavigateCollection } from '../../enum/bt-navigation.enum';
import {
  ESTButtonMessage,
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-common.enum';
import {
  subTitleMessage
} from '../../../../../transaction-manager/modules/signature-tracking/enum/signature-tracking.enum';
import { IFlowError } from '../../../../../../models/error.interface';
import { AtdUtilService } from '../../../transfer-ach/services/atd-util.service';
import {
  StOperationHandlerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import {
  StBtProcessService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/definitions/bp/atomic/st-bt-process.service';


@Component({
  selector: 'byte-bt-home-voucher',
  templateUrl: './bt-voucher.component.html',
  styleUrls: ['./bt-voucher.component.scss']
})

export class BtVoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  headBandLayout: IHeadBandAttribute[] = [];
  voucherLayout: IDataReading | null = null;
  tableLayout: ITableStructure | null = null;
  pdfLayout: IPrint | null = null;
  layoutJsonVoucherModal: IConfirmationModal | null = null;

  reference: string | null = null;
  dateTime: string | null = null;

  formValues: IBulTransferFormValues | null = null;
  targetAccountList: IAChBulkTransferAccount[] | null = null;
  currentFile: ICurrentFile | null = null;
  sourceAccount: IAccount | null = null;
  typeTransaction: string | null = null;
  isSignatureTransaction = false;
  messageTransaction: string | null = null;
  viewMode: EBViewMode | null = null;
  isShowAlert = true;
  nextButtonMessage = 'print';
  isFatalError = false;
  settings: IACHSettings[] = [];
  achAssociatedAccounts: IAchAccount[]  = [];
  achAccountToCredit: IBTSaveTransactionRequest | null = null;
  associatedMappedAccounts: Map<string, IAchAccount> = new Map<string, IAchAccount>();

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typeButton() {
    return this.isSignatureTransaction ? '' : 'secondary';
  }

  constructor(
    private pdfService: BulkTransferPrintService,
    private modalService: NgbModal,
    private formatService: AdfFormatService,
    private router: Router,
    private persistStepStateService: ParameterManagementService,
    private transactionDefinitionManager: BtdTransactionManagerService,
    private transactionExecutionVoucherManager: BteVoucherService,
    private translate: TranslateService,
    private stOperationHandler: StOperationHandlerService,
    private utils: UtilService,
    private tableDefinition: BtdTableService,
    private activatedRoute: ActivatedRoute,
    private stProcessSingleBulkTransaction: BteUtilsService,
    private stProcessTransaction: StBtProcessService,
    private achUtils: AtdUtilService,
  ) {}

  ngOnInit(): void {
    this.settings = this.activatedRoute.snapshot.data?.['settings'] ?? [];
    this.achAssociatedAccounts = this.activatedRoute.snapshot.data?.['associatedAccounts'] ?? [];
    this.viewMode = this.activatedRoute.snapshot.data?.['view'];

    this.setAssociatedMappedAccounts();
    this.buildInitDefinition();
  }

  setAssociatedMappedAccounts() {
    for (const account of this.achAssociatedAccounts) {
      this.associatedMappedAccounts.set(account.account, account);
    }
  }


  buildInitDefinition() {
    switch (this.viewMode) {
      case EBViewMode.DEFAULT:
        this.defaultInitDefinition();
        break;
      case EBViewMode.HISTORY_TRANSACTION:
        this.handleGetTransactionDetail(EBTTypeTransaction.DEFAULT);
        this.isShowAlert = !this.isShowAlert;
        break;
      case EBViewMode.SIGNATURE_TRACKING:
        this.handleGetTransactionDetail(EBTTypeTransaction.SIGNATURE_TRACKING);
        break;
      case EBViewMode.SIGNATURE_TRACKING_OPERATION:
        const currentState: IBulkTransferConfirmState = this.persistStepStateService.getParameter('navigateStateParameters');
        this.handleGetTransactionDetail(EBTTypeTransaction.SIGNATURE_TRACKING_OPERATION);
        this.nextButtonMessage = ESTButtonMessage[(currentState?.action!)];
        break;
      default:
        this.back();
        break;
    }
  }

  defaultInitDefinition() {
    const currentState: IBulkTransferConfirmState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.sourceAccount = currentState?.sourceAccount;
    this.formValues = currentState?.formValues!;
    this.currentFile = currentState?.currentFile;
    this.dateTime = currentState?.transactionResponse?.dateTime;
    this.reference = currentState?.transactionResponse?.reference;
    this.targetAccountList = currentState?.targetAccounts!;
    this.typeTransaction = currentState?.transactionResponse?.segTransactional;
    this.isSignatureTransaction = currentState?.isSignatureTrackingTransaction ?? false;
    this.messageTransaction = currentState?.messageTransaction ?? '';


    this.buildVoucher(currentState?.typeTransaction!);
  }

  buildVoucher(view: string) {
    switch (view) {
      case EBTTypeTransaction.DEFAULT:
        this.defaultVoucherDefinition();
        break;
      case EBTTypeTransaction.SIGNATURE_TRACKING_DEFAULT:
        this.buildVoucherForSignatureTracking(this.messageTransaction!);
        break;
      case EBTTypeTransaction.SIGNATURE_TRACKING:
        this.buildVoucherForSignatureTracking(this.messageTransaction!, 'signature_tracking', 'view_detail_transaction');
        break;
      case EBTTypeTransaction.SIGNATURE_TRACKING_OPERATION:
        const currentState: IBulkTransferConfirmState = this.persistStepStateService.getParameter('navigateStateParameters');
        const subTitle = subTitleMessage[(currentState?.action!).toLowerCase()];

        this.buildVoucherForSignatureTracking(null!, 'signature_tracking', subTitle);
        this.isSignatureTransaction = false;
        break;
      default:
        this.back();
        break;
    }

    this.utils.hideLoader();
  }

  defaultVoucherDefinition() {
    const title = this.viewMode === EBViewMode.DEFAULT ? '' : 'label:ach_massive_transference';
    const subtitle = this.viewMode === EBViewMode.DEFAULT ? '' : 'label:transaction-history';
    const startupParameters: IBTDVoucherBuilder = {
      date: this.dateTime!,
      titlePdf: '',
      reference: this.reference!,
      fileNamePdf: '',
      targetAccounts: this.targetAccountList!,
      sourceAccount: this.sourceAccount!,
      currentFile: this.currentFile!,
      formValues: this.formValues,
      title,
      subtitle,
    };

    const {
      headBandLayout,
      layoutVoucher,
      layoutVoucherModal } = this.transactionExecutionVoucherManager.buildVoucherScreen(startupParameters);

    this.voucherLayout = layoutVoucher;
    this.headBandLayout = headBandLayout;
    this.layoutJsonVoucherModal = layoutVoucherModal;
    this.tableLayout = this.tableDefinition.tableLayoutDefinition(this.targetAccountList!, 'detail_accounts', true, true);

    if (this.isShowAlert) {
      this.showAlert('success', 'label:file_uploaded_success');
    }
  }

  nextStep() {
    if (this.viewMode === EBViewMode.DEFAULT || this.viewMode === EBViewMode.HISTORY_TRANSACTION) {
      this.openModal();
      return;
    }

    if (this.viewMode === EBViewMode.SIGNATURE_TRACKING_OPERATION) {
      this.handleExecuteOperation();
    }
  }

  back() {
    this.utils.showLoader();

    switch (this.viewMode) {
      case EBViewMode.HISTORY_TRANSACTION:
        this.resetStorage(ETHNavigationParameters.CONSULT);
        this.router.navigate([ETransactionHistoryUrlNavigationCollection.CONSULT]).finally(() => this.utils.hideLoader());
        break;

      case EBViewMode.SIGNATURE_TRACKING_OPERATION:
      case EBViewMode.SIGNATURE_TRACKING:
        const currentState = this.persistStepStateService.getParameter('navigateStateParameters');
        this.resetStorage('', {
          position: currentState?.position,
        });
        this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
        break;

      case EBViewMode.DEFAULT:
        this.resetStorage(null!);
        this.router.navigate([EBTUrlNavigateCollection.HOME]).finally(() => this.utils.hideLoader());
        break;
    }
  }

  openModal() {
    const voucherModal = this.modalService.open(BtProofVoucherModalComponent
      , {
        centered: true,
        windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal bulk-transfer-modal`,
        size: `lg`,
      });

    voucherModal.componentInstance.data = this.layoutJsonVoucherModal;
    voucherModal.componentInstance.uploadedAccountsLayout = this.tableDefinition.tableLayoutDefinition(this.targetAccountList!, 'detail-destionation-account');
    voucherModal.result.then(isResult => {
      if (!isResult) { return; }

      this.exportFile();
    }).catch(error => error);
  }

  exportFile() {
    const data = {
      data: this.targetAccountList,
      sourceAccount: this.sourceAccount,
      currencyDescription: this.utils.getLabelCurrency(this.sourceAccount?.currency!),
      amountRegister: this.currentFile?.heading?.credits,
      totalAmount: this.formatService.formatAmount(this.currentFile?.heading?.totalAmount!),
      reference: this.reference,
      operationDate: this.formatService.getFormatDateTime(this.dateTime!).numberFormat,
      typeAccount: this.utils.getLabelProduct(Number(this.sourceAccount?.product! ?? '00')),
      date: this.formatService.getFormatDateTime(this.dateTime!),
    };

    const label = this.translate.instant('pdf:bulk_transfer');

    this.pdfService.pdfGenerate(data, this.reference!, label, 248, '', undefined, true);
  }


  /* =========================================== SIGNATURE TRACKING ==============================================*/

  handleGetTransactionDetail(mode: string) {
    const currentState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.utils.showLoader();

    const headingFile = new HeadingFileBuilder()
      .key('heading')
      .credits(currentState?.transactionDetail?.numberOfCredits)
      .totalAmount(Number(currentState?.transactionDetail?.amount))
      .currency((currentState?.transactionDetail?.sourceCurrency))
      .sourceAccount(currentState?.transactionDetail?.sourceAccount)
      .build();

    this.currentFile = new CurrentFileBuilder()
      .heading(headingFile)
      .build();

    this.stProcessSingleBulkTransaction.getTransactionDetails()
      .subscribe(([sourceAccount, associatedAccounts]) => {
        this.achAccountToCredit = associatedAccounts as IBTSaveTransactionRequest;
        this.targetAccountList = this.stProcessSingleBulkTransaction.parsedAccountsToDetail({
          associatedAccounts: this.associatedMappedAccounts,
          response: associatedAccounts,
          currency: currentState?.transactionDetail?.sourceCurrency
        });

        this.dateTime = currentState?.transactionSelected?.dateTime;
        this.reference = currentState?.transactionSelected?.reference;
        const getAccountFromDetail = this.getAccountFromDetail(associatedAccounts) as IBTSaveTransactionDetailRequest;
        const dateString = getAccountFromDetail?.transferDate || ''
        const date = !getAccountFromDetail?.programmedTransfer ? '' : this.achUtils.buildStringDateIntoDate(dateString.replace(/.{6}$/, ''));

        this.formValues = {
          schedule: getAccountFromDetail?.programmedTransfer,
          hour: !getAccountFromDetail?.programmedTransfer ? '' : getAccountFromDetail?.transferHour,
          date: date as NgbDate,
        }

        const currentAccount = sourceAccount as ITransactionManagerAccountDetail;
        this.sourceAccount = new AccountBuilder()
          .account(currentState?.transactionDetail?.sourceAccount)
          .currency(currentState?.transactionDetail?.sourceCurrency)
          .product(currentState?.transactionDetail?.sourceProduct)
          .name(currentAccount?.name)
          .build();

        this.buildVoucher(mode);
      });
  }

  getAccountFromDetail(response: IBTSaveTransactionRequest | IFlowError) {
    if (response.hasOwnProperty('error')) {
      return {};
    }

    const responseParsed = response as IBTSaveTransactionRequest;
    return responseParsed.details[0];
  }

  handleExecuteOperation() {
    const currentState = this.persistStepStateService.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = currentState?.transactionSelected;
    const position: number = currentState?.position;

    if (currentState?.action === ESignatureTrackingTypeAction.PROCESS) {
      this.handleProcessTransaction();
      return;
    }

    this.utils.showLoader();
    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action: currentState?.action
    });

  }

  handleProcessTransaction() {
    const currentState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.stProcessTransaction.execute({
      achAssociatedAccounts: this.achAssociatedAccounts,
      achSettings: this.settings,
      transactionSelected: currentState?.transactionSelected,
      sourceAccountLoaded: this.sourceAccount!,
      achAssociatedAccountsLoaded: this.achAccountToCredit!,
      formValues: this.formValues,
    });
  }

  buildVoucherForSignatureTracking(message: string, title: string = 'transfers_other_banks', subtitle: string = 'upload_files') {
    this.isSignatureTransaction = true;
    this.saveStorageForSignatureTracking(message);
    this.voucherLayout = this.transactionDefinitionManager.buildConfirmScreenLayout(this.sourceAccount!, this.currentFile?.heading as IHeadingFile, title, subtitle);
    this.tableLayout = this.tableDefinition.tableLayoutDefinition(this.targetAccountList!, 'detail_accounts');

    if (this.isShowAlert) {
      this.showAlert('info', message);
    }
  }


  /* =========================================== SIGNATURE TRACKING ==============================================*/

  saveStorageForSignatureTracking(message: string) {
    const currentState: IBulkTransferConfirmState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.persistStepStateService.sendParameters({
      navigateStateParameters: {
        ...currentState,
        transactionResponse: null,
        isSignatureTrackingTransaction: true,
        messageTransaction: message,
      }
    });
  }

  resetStorage(navParam: string, params?: any) {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: navParam,
      navigateStateParameters: params,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
