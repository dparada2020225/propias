import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { IACHSettings } from '../../../../../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import { IAchAccount } from '../../../../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { TransactionManagerService } from '../../../../../../../services/transaction-manager.service';
import {
  TransferACHService
} from '../../../../../../../../transfer/modules/transfer-ach/services/transaction/transfer-ach.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { AtdUtilService } from '../../../../../../../../transfer/modules/transfer-ach/services/atd-util.service';
import { StProcessHandlerService } from '../../../utils/st-process-handler.service';
import { StBtProcessManagerService } from '../../../utils/st-bt-process-manager.service';
import { IExecuteACHTransactions } from '../../../../../interfaces/st-process.interface';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import {
  ITMRequestDetailACHTransaction,
  ITransactionManagerAccountDetail
} from '../../../../../../../interfaces/transaction-manger.interface';
import { AccountBuilder } from '../../../../../../../../../models/account.inteface';
import { FlowErrorBuilder } from '../../../../../../../../../models/error.interface';


@Injectable({
  providedIn: 'root'
})
export class StAchService {

  private settings: IACHSettings[] = [];
  private associatedAccounts: IAchAccount[]  = [];

  constructor(
    private translate: TranslateService,
    private persistStepStateService: ParameterManagementService,
    private transactionManagerService: TransactionManagerService,
    private achTransaction: TransferACHService,
    private splitTransactionDetail: SplitTransactionDetailService,
    private achUtils: AtdUtilService,
    private stProcessHandler: StProcessHandlerService,
    private stBTProcessManagerService: StBtProcessManagerService,
  ) { }

  execute(startupParameters: IExecuteACHTransactions) {
    const { transaction, settings, achAssociatedAccounts } = startupParameters ?? {};

    this.settings = settings;
    this.associatedAccounts = achAssociatedAccounts;

    return this.handleTransactionExecution(transaction);
  }


  private handleTransactionExecution(transaction: ITMTransaction) {
    const detailFromRequest = this.splitTransactionDetail.getTransactionDetailForACHRequest(transaction?.request);
    const sourceAccount = this.getSourceAccount(detailFromRequest?.sourceAccount);

    return sourceAccount
      .pipe(
        concatMap(account => {
          return this.executeProcessTransaction(transaction, detailFromRequest, account);
        }),
      );
  }

  private executeTransaction(transaction: ITMTransaction, detail: ITMRequestDetailACHTransaction, sourceAccount: ITransactionManagerAccountDetail) {
    const targetAccount: IAchAccount = this.getTargetAccount(detail?.targetAccount);
    const bankData = this.achUtils.getDataToListOfBanks(this.settings, targetAccount);


    const errorMessage = this.translate.instant('error:st_missing_target_account');

    if (!targetAccount || !bankData) {
      return throwError(() => {
        return {
          error: {
            message: errorMessage,
          },
          status: 400,
          statusText: errorMessage,
          headers: null,
        }
      });
    }

    const calcDate = this.achUtils.buildScheduleForUseInServiceProcess(detail?.transferenceDateRaw, detail?.transferenceHour);
    const isSchedule = this.achUtils.buildIsTransactionSchedule(detail?.transferenceDate, detail?.transferenceHour);
    const hourSchedule = {
      hour: '',
      code: detail?.transferenceHourRaw,
      description: detail?.transferenceHour
    }

    const dataToExecute = this.achUtils.dataToExecuteTransaction({
      debitedAccount: new AccountBuilder()
        .account(detail?.sourceAccount)
        .currency(detail?.sourceCurrency)
        .product(Number(detail?.sourceProduct))
        .subproduct(Number(detail?.sourceSubProduct))
        .name(sourceAccount?.name)
        .build(),
      formValues: {
        accountDebited: detail?.sourceAccount,
        amount: transaction?.amount,
        comment: detail?.comment,
        schedule: isSchedule,
        date: isSchedule ? calcDate.date : null,
        hour: isSchedule ? calcDate.hour : null,
      },
      omitASTransaction: true,
      dataFromSettings: bankData,
      accreditedAccount: targetAccount,
      hourSelected: isSchedule ? hourSchedule : null,
    });


    return this.achTransaction.achTransfer(false, dataToExecute, null);
  }

  private executeProcessTransaction(transaction: ITMTransaction, detail: ITMRequestDetailACHTransaction, sourceAccount: ITransactionManagerAccountDetail) {
    const userInfo =  this.persistStepStateService.getParameter('userInfo');

    return this.achTransaction.transactionLimits({
      currency: detail?.sourceCurrency,
      service: transaction?.serviceCode,
    })
      .pipe(
        concatMap((limitsResponse) => {
          const currentAmount = detail?.amount;
          console.log('currentAmount', currentAmount)

          if (limitsResponse && Number(currentAmount) > Number(limitsResponse.amount)) {
            return this.stBTProcessManagerService.handleErrorToTransactionLimits();
          }

          return this.stProcessHandler.processTransactionWithoutToken({
            transactionCode: transaction?.reference,
            signatureType: userInfo?.signatureType,
          }, true);
        }),
        concatMap(() => this.executeTransaction(transaction, detail, sourceAccount))
      )
  }

  private getSourceAccount(sourceNumberAccount: string): Observable<any> {
    return this.transactionManagerService.getAccountDetail(sourceNumberAccount)
      .pipe(
        catchError(error => of(
          new FlowErrorBuilder()
            .error(error?.error)
            .message(error?.error?.message ?? 'error:getting_source_accounts')
            .status(error?.status)
            .build()
        ))
      );
  }

  private getTargetAccount(account: string): IAchAccount {
    return this.associatedAccounts.find(acc => acc.account === account) as IAchAccount;
  }
}
