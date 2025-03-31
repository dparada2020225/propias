import { IDataReading, ITableStructure } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpStatusCode } from 'src/app/enums/http-status-code.enum';
import { IAccount } from 'src/app/models/account.inteface';
import { IFlowError } from 'src/app/models/error.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IAchAccount, IAChBulkTransferAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { IACHSettings } from '../../../transfer-ach/interfaces/settings.interface';
import { EBTTypeTransaction } from '../../enum/bt-view.enum';
import { IBulkTransferConfirmState, IBulTransferFormValues } from '../../interfaces/bulk-transfer-parameters.interface';
import { EBulkTransactionNavigationProtected } from '../../models/bulk-transfer.enum';
import { ICurrentFile, IHeadingFile, IPreResponseBulkT } from '../../models/bulk-transfer.interface';
import { BtdTableService } from '../../services/definition/table/btd-table.service';
import { BtdTransactionManagerService } from '../../services/definition/transaction/btd-transaction-manager.service';
import { Location } from '@angular/common';
import { AtdUtilService } from '../../../transfer-ach/services/atd-util.service';
import { BteTransactionService } from '../../services/execution/bte-transaction.service';
import { EBTUrlNavigateCollection } from '../../enum/bt-navigation.enum';
import { TBTExecuteTransaction } from '../../interfaces/bt-transaction.interface';
import { HandleTokenRequestService } from '../../../../../../service/common/handle-token-request.service';

@Component({
  selector: 'byte-bt-home-confirmation',
  templateUrl: './bt-confirmation.component.html',
  styleUrls: ['./bt-confirmation.component.scss']
})
export class BtConfirmationComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  voucherLayout: IDataReading | null = null;
  tableLayout: ITableStructure | null = null;


  formValues: IBulTransferFormValues | null = null;
  associatedAccounts: IAchAccount[] = [];
  targetAccountList: IAChBulkTransferAccount[] = [];
  preTransferResponse: IPreResponseBulkT | null = null;
  currentFile: ICurrentFile | null = null;
  sourceAccount: IAccount | null = null;
  settings: IACHSettings[] = [];
  fileName: string | null = null;
  associatedMappedAccounts: Map<string, IAchAccount> = new Map<string, IAchAccount>();


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private persistStepStateService: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private tableDefinition: BtdTableService,
    private transactionDefinitionManager: BtdTransactionManagerService,
    private achUtils: AtdUtilService,
    private btExecuteTransaction: BteTransactionService,
    private handleTokenRequired: HandleTokenRequestService,
  ) {}

  ngOnInit(): void {
    const currentState: IBulkTransferConfirmState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.sourceAccount = currentState?.sourceAccount;
    this.formValues = currentState?.formValues!;
    this.currentFile = currentState?.currentFile;
    this.preTransferResponse = currentState?.transactionResponse;
    this.fileName = currentState?.fileName!;

    this.getAccounts();
    this.initDefinition();

    this.utils.hideLoader();
    this.showAlert('info', 'label_alert_bulk_transfer');
  }


  initDefinition() {
    this.targetAccountList = this.achUtils.getTargetAccountForMassiveTransferenceMap({
      associatedAccountsMap: this.associatedMappedAccounts,
      currentFile: this.currentFile as ICurrentFile,
      achSettings: this.settings,
    });

    this.voucherLayout = this.transactionDefinitionManager.buildConfirmScreenLayout(this.sourceAccount!, this.currentFile?.heading as IHeadingFile);
    this.tableLayout = this.tableDefinition.tableLayoutDefinition(this.targetAccountList, 'detail_accounts', true, true);
  }

  getAccounts() {
    this.getLisOfBank();
    this.getAssociatedAccounts();
  }

  getAssociatedAccounts() {
    const resolverResponse = this.activatedRoute.snapshot.data?.['associatedAccounts'];

    if (resolverResponse.hasOwnProperty('error')) {
      this.showAlert('error', 'error_associated');
      return;
    }


    this.associatedAccounts = resolverResponse ?? [];

    this.associatedAccounts.forEach(account => {
      this.associatedMappedAccounts.set(account?.account, account);
    });
  }

  getLisOfBank() {
    const responseFromResolver = this.activatedRoute.snapshot.data?.['settings'];

    if (responseFromResolver.hasOwnProperty('error')) {
      this.showAlert('error', (responseFromResolver as IFlowError).message);
      return;
    }

    this.settings = responseFromResolver as IACHSettings[];
  }

  nextStep() {
    this.handleExecuteTransaction();
  }

  back() {
    this.resetStorage();
    this.location.back();
  }

  handleExecuteTransaction() {
    this.btExecuteTransaction.init({
      currentFile: this.currentFile as ICurrentFile,
      sourceAccount: this.sourceAccount as IAccount,
      achSettings: this.settings,
      formValues: this.formValues as IBulTransferFormValues,
      associatedAccountsMap: this.associatedMappedAccounts,
    });

    if (this.handleTokenRequired.isTokenRequired()) {
      this.btExecuteTransaction.openTokenModal()
        .then(response => {
          this.handleResponseExecuteTransaction(response)
        }).catch(error => error);

      return;
    }

    this.utils.showLoader();
    this.btExecuteTransaction.execute()
      .subscribe({
        next: (response) => {
          this.handleResponseExecuteTransaction(response);
        },
        error: (error) => {
          this.utils.hideLoader();
          this.showAlert('error', error?.error?.message);
        }
      })
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: null
    });
  }

  handleResponseExecuteTransaction(response: TBTExecuteTransaction) {
    const isSignatureTrackingTransaction = Number(response?.status) === Number(HttpStatusCode.SIGNATURE_TRACKING);

    if (response?.status !== 200 && !isSignatureTrackingTransaction) {
      this.utils.hideLoader();
      this.showAlert('error', response?.message!);
      this.utils.scrollToTop();
      return;
    }

    this.goToVoucher(response);
  }

  goToVoucher(response: TBTExecuteTransaction) {
    const isSignatureTrackingTransaction = Number(response?.status) === Number(HttpStatusCode.SIGNATURE_TRACKING);

    const parameters: IBulkTransferConfirmState = {
      sourceAccount: this.sourceAccount as IAccount,
      currentFile: this.currentFile as ICurrentFile,
      formValues: this.formValues as IBulTransferFormValues,
      transactionResponse: !isSignatureTrackingTransaction ? response?.data : null,
      targetAccounts: this.targetAccountList as any,
      fileName: this.fileName as any,
      messageTransaction: !isSignatureTrackingTransaction ? undefined : response?.message!,
      typeTransaction: !isSignatureTrackingTransaction ? EBTTypeTransaction.DEFAULT : EBTTypeTransaction.SIGNATURE_TRACKING_DEFAULT,
    };



    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: EBulkTransactionNavigationProtected.VOUCHER,
      navigateStateParameters: parameters,
    });


    this.router.navigate([EBTUrlNavigateCollection.DEFAULT_VOUCHER]).finally(() => this.utils.hideLoader());
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
