import { Injectable } from '@angular/core';
import { AtdUtilService } from '../../../transfer-ach/services/atd-util.service';
import {
  IBTDetailBodyRequest,
  IBTSaveTransactionDetailRequest,
  IBTSaveTransactionRequest
} from '../../interfaces/bt-transaction.interface';
import { FlowErrorBuilder, IFlowError } from '../../../../../../models/error.interface';
import {
  ACHBulkTransferBuilder, IAchAccount, IAChBulkTransferAccount
} from '../../../transfer-ach/interfaces/ach-account-interface';
import { forkJoin, Observable, of } from 'rxjs';
import {
  ITransactionManagerAccountDetail
} from '../../../../../transaction-manager/interfaces/transaction-manger.interface';
import { catchError } from 'rxjs/operators';
import { BulkTransactionService } from '../transaction/bulk-transfer-transaction.service';
import { TransactionManagerService } from '../../../../../transaction-manager/services/transaction-manager.service';
import { IBTDetailState } from '../../interfaces/bulk-transfer-parameters.interface';
import { AdfFormatService } from '@adf/components';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IBTParsedTargetAccountParameters } from '../../interfaces/bt-utils.interface';

@Injectable({
  providedIn: 'root'
})
export class BteUtilsService {

  private customerId: string = this.persistStepStateService.getParameter('userInfo')?.customerCode;

  constructor(
    private achUtils: AtdUtilService,
    private bulkTransaction: BulkTransactionService,
    private transactionManagerService: TransactionManagerService,
    private persistStepStateService: ParameterManagementService,
    private utils: UtilService,
    private formatService: AdfFormatService,
  ) { }



  getTransactionDetails() {
    const transactionState: IBTDetailState = this.persistStepStateService.getParameter('navigateStateParameters');

    const getSourceAccount = this.getSourceAccount(transactionState?.transactionDetail?.sourceAccount);
    const getTransactionList = this.transactionDetail(transactionState?.transactionDetail?.numberOfLote);

    return forkJoin([getSourceAccount, getTransactionList]);
  }

  parsedAccountsToDetail(parameters: IBTParsedTargetAccountParameters) {
    const { response, currency, associatedAccounts } = parameters;
    const accountsParsed: IAChBulkTransferAccount[] = [];

    if ((response as IFlowError).hasOwnProperty('error')) {
      return [];
    }

    const details = response as IBTSaveTransactionRequest;

    for (const account of details?.details) {
      if (associatedAccounts.has(account?.account)) {
        accountsParsed.push(this.btAccountParsed(account, currency, associatedAccounts.get(account?.account) as IAchAccount));
      }
    }

    return accountsParsed;
  }

  private btAccountParsed(accountInDetail: IBTSaveTransactionDetailRequest, currency: string, achAccount: IAchAccount) {
    return new ACHBulkTransferBuilder()
      .name(accountInDetail?.participant)
      .account(accountInDetail?.account)
      .product(this.utils.getLabelProduct(Number(this.achUtils.getProduct(achAccount?.type))))
      .documentNumber(achAccount?.documentNumber)
      .currency(currency)
      .bankName(accountInDetail?.institution)
      .bank(Number(accountInDetail?.institutionId))
      .parsedAmount(this.formatService.formatAmount(accountInDetail?.amount))
      .build();
  }




  private getSourceAccount(sourceNumberAccount: string): Observable<IFlowError | ITransactionManagerAccountDetail> {
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

  private transactionDetail(codeLote: string) {
    const dataToGetDetail: IBTDetailBodyRequest = {
      company: this.customerId,
      lotCode: codeLote,
    };

    return this.bulkTransaction.bulkTransactionDetail(dataToGetDetail)
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
}
