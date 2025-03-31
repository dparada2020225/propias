import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {
  IACHSettings,
  IDataToSettingsACH
} from '../../../../../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import {
  ACHBulkTransferBuilder,
  IAchAccount,
  IAChBulkTransferAccount
} from '../../../../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import {
  IBTSaveTransactionDetailRequest,
  IBTSaveTransactionRequest
} from '../../../../../../../../transfer/modules/bulk-transfer/interfaces/bt-transaction.interface';
import { AccountBuilder, IAccount } from '../../../../../../../../../models/account.inteface';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { TransactionManagerService } from '../../../../../../../services/transaction-manager.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { AtdUtilService } from '../../../../../../../../transfer/modules/transfer-ach/services/atd-util.service';
import {
  BulkTransactionService
} from '../../../../../../../../transfer/modules/bulk-transfer/services/transaction/bulk-transfer-transaction.service';
import {
  BtdTransactionManagerService
} from '../../../../../../../../transfer/modules/bulk-transfer/services/definition/transaction/btd-transaction-manager.service';
import { StBtProcessManagerService } from '../../../utils/st-bt-process-manager.service';
import {
  IBTProcessStartupParametersExtended,
  ISTProcessExecuteMultipleBulkTransferParameters
} from '../../../../../interfaces/st-process-multiple.interface';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import {
  EDataToExecuteTransactionBulkTransfer
} from '../../../../../../../../transfer/modules/bulk-transfer/enum/bulk-transfer.enum';
import { ITMRequestDetailBulkTransaction } from '../../../../../../../interfaces/transaction-manger.interface';
import { FlowErrorBuilder, IFlowError } from '../../../../../../../../../models/error.interface';
import { EProductFromCode } from '../../../../../../../../../enums/product.enum';


@Injectable({
  providedIn: 'root',
})
export class StBulkTransactionsService {
  private settings: IACHSettings[] = [];
  private associatedAccountsMap!: Map<string, IAchAccount>;
  private customerId: string = this.persistStepStateService.getParameter('userInfo')?.customerCode;
  private achAssociatedAccountsLoaded: IBTSaveTransactionRequest | undefined = undefined;
  private sourceAccountLoaded: IAccount | undefined = undefined;

  constructor(
    private persistStepStateService: ParameterManagementService,
    private transactionManagerService: TransactionManagerService,
    private splitService: SplitTransactionDetailService,
    private achUtils: AtdUtilService,
    private bulkTransaction: BulkTransactionService,
    private bulkTransactionManagerDefinition: BtdTransactionManagerService,
    private stBTProcessManager: StBtProcessManagerService,
  ) {}

  execute(parameters: IBTProcessStartupParametersExtended) {
    const {
      achSettings,
      achAssociatedAccounts,
      transactionSelected,
      achAssociatedAccountsLoaded,
      sourceAccountLoaded } = parameters ?? {};

    this.settings = achSettings;
    this.associatedAccountsMap = achAssociatedAccounts;
    this.achAssociatedAccountsLoaded = achAssociatedAccountsLoaded;
    this.sourceAccountLoaded = sourceAccountLoaded;

    return this.getTransactionDetails(transactionSelected);
  }

  private getTransactionDetails(transaction: ITMTransaction) {
    const transactionDetailFromRequest = this.splitService.getTransactionDetailForBulkTransferRequest(transaction?.request);

    const sourceAccount = this.getSourceAccount(transactionDetailFromRequest?.sourceAccount);
    const transactionList = this.transactionDetail(transactionDetailFromRequest?.numberOfLote);
    let currentSourceAccount: IAccount | null = null;
    let targetListAccount: IBTSaveTransactionRequest | null = null;

    return sourceAccount.pipe(
      concatMap((data) => {
        currentSourceAccount = new AccountBuilder()
          .account(transactionDetailFromRequest?.sourceAccount)
          .currency(transactionDetailFromRequest?.sourceCurrency)
          .product(Number(transactionDetailFromRequest?.sourceProduct))
          .subproduct(Number(data?.subProductType))
          .name(data?.name)
          .email('')
          .build();
        return transactionList;
      }),
      concatMap((data) => {
        targetListAccount = data as IBTSaveTransactionRequest;
        return this.stBTProcessManager.executeProcessTransactionWithoutToken(transaction, true);
      }),
      concatMap(() => this.stBTProcessManager.getTransactionLimits(transaction, transactionDetailFromRequest)),
      concatMap((limitsResponse) => {
        const currentAmount = transactionDetailFromRequest.amount;
        if (limitsResponse && Number(currentAmount) > Number(limitsResponse.amount)) {
          return this.stBTProcessManager.handleErrorToTransactionLimits();
        }

        return this.stBTProcessManager.executeNotification(transaction, currentSourceAccount as IAccount, transactionDetailFromRequest);
      }),
      concatMap(() =>
        this.executeTransaction({
          accountsToTransaction: targetListAccount as IBTSaveTransactionRequest,
          sourceAccount: currentSourceAccount as IAccount,
          transactionSelected: transaction,
          transactionDetail: transactionDetailFromRequest,
        }),
      )
    );
  }


  private executeTransaction(parameters: ISTProcessExecuteMultipleBulkTransferParameters) {
    const { sourceAccount, transactionDetail, accountsToTransaction } = parameters ?? {};

    const firstTransaction = accountsToTransaction?.details ? accountsToTransaction.details[0] : {} as IBTSaveTransactionDetailRequest;
    const dateString = firstTransaction?.transferDate || '';
    const date = !firstTransaction?.programmedTransfer ? '' : this.achUtils.buildStringDateIntoDate(dateString.replace(/.{6}$/, ''));

    const formValues = {
      schedule: firstTransaction?.programmedTransfer,
      hour: !firstTransaction?.programmedTransfer && firstTransaction?.transferHour ? '' : firstTransaction?.transferHour,
      date: date as NgbDate,
    }

    const data = this.bulkTransactionManagerDefinition.dataToExecuteTransaction({
      lote: {
        correlative: Number(transactionDetail?.numberOfLote),
        code: 0,
        message: '',
      },
      sourceAccount,
      targetAccounts: this.getTargetAccounts(transactionDetail, accountsToTransaction),
      formValues,
      formatRegister: EDataToExecuteTransactionBulkTransfer.FORMAT_REGISTER,
      fileName: EDataToExecuteTransactionBulkTransfer.FILE_NAME,
    });

    return this.bulkTransaction.bulkTransfer(data);
  }

  private getTargetAccounts(detail: ITMRequestDetailBulkTransaction, listTarget: IBTSaveTransactionRequest) {
    const targetAccountList = this.parsedAccountsToDetail(listTarget, detail?.sourceCurrency);
    const list: IAChBulkTransferAccount[] = [];

    targetAccountList.forEach(account => {
      if (this.associatedAccountsMap.has(account.account)) {
        const associatedAccount = this.associatedAccountsMap.get(account.account) as IAchAccount;
        list.push({
          ...associatedAccount,
          currentAmount: account?.parsedAmount as string,
          ...(this.achUtils.getDataToListOfBanks(this.settings, associatedAccount) as IDataToSettingsACH),
        });
      }
    });

    return list;
  }

  private getSourceAccount(sourceNumberAccount: string): Observable<IFlowError | any> {
    if (this.sourceAccountLoaded) {
      return of(this.sourceAccountLoaded);
    }

    return this.transactionManagerService.getAccountDetail(sourceNumberAccount).pipe(
      catchError((error) =>
        of(
          new FlowErrorBuilder()
            .error(error?.error)
            .message(error?.error?.message ?? 'error:getting_source_accounts')
            .status(error?.status)
            .build()
        )
      )
    );
  }

  private transactionDetail(codeLote: string) {
    if (this.achAssociatedAccountsLoaded) {
      return of(this.achAssociatedAccountsLoaded);
    }

    const dataToGetDetail: any = {
      company: this.customerId,
      lotCode: codeLote,
    };

    return this.bulkTransaction.bulkTransactionDetail(dataToGetDetail).pipe(
      catchError((error) =>
        of(
          new FlowErrorBuilder()
            .error(error?.error)
            .message(error?.error?.message ?? 'error:getting_source_accounts')
            .status(error?.status)
            .build()
        )
      )
    );
  }

  private parsedAccountsToDetail(response: any | IFlowError, currency: string): IAChBulkTransferAccount[] {
    if ((response as IFlowError).hasOwnProperty('error')) {
      return [];
    }

    return response?.details.map((account: any) =>
      new ACHBulkTransferBuilder()
        .name(account?.participant)
        .account(account?.account)
        .product(EProductFromCode[account?.accountType])
        .documentNumber('')
        .currency(currency)
        .bankName(account?.institution)
        .type(EProductFromCode[account?.accountType])
        .bank(Number(account?.institutionId))
        .parsedAmount(account?.amount)
        .build()
    );
  }
}
