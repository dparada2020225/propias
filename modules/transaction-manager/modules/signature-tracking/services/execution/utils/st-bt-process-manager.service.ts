import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { ITMTransaction } from '../../../../../interfaces/tm-transaction.interface';
import { ITMRequestDetailBulkTransaction } from '../../../../../interfaces/transaction-manger.interface';
import { IAccount } from '../../../../../../../models/account.inteface';
import { TranslateService } from '@ngx-translate/core';
import {
  TransferACHService
} from '../../../../../../transfer/modules/transfer-ach/services/transaction/transfer-ach.service';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { StProcessHandlerService } from './st-process-handler.service';
import { HandleTokenRequestService } from '../../../../../../../service/common/handle-token-request.service';
import { UtilService } from '../../../../../../../service/common/util.service';
import {
  BulkTransactionService
} from '../../../../../../transfer/modules/bulk-transfer/services/transaction/bulk-transfer-transaction.service';
import {
  EDataToExecuteTransactionBulkTransfer
} from '../../../../../../transfer/modules/bulk-transfer/enum/bulk-transfer.enum';
import {
  BtdTransactionManagerService
} from '../../../../../../transfer/modules/bulk-transfer/services/definition/transaction/btd-transaction-manager.service';
import { ERequestTypeTransaction } from '../../../../../../../enums/transaction-header.enum';
import { IMassiveACHTransferProcessParameters } from '../../../interfaces/st-ach-process.interface';

@Injectable({
  providedIn: 'root'
})
export class StBtProcessManagerService {

  constructor(
    private translate: TranslateService,
    private transfer: TransferACHService,
    private persistStepStateService: ParameterManagementService,
    private stProcessHandler: StProcessHandlerService,
    private handleTokenRequest: HandleTokenRequestService,
    private util: UtilService,
    private bulkTransaction: BulkTransactionService,
    private bulkTransactionManagerDefinition: BtdTransactionManagerService,
  ) { }

  handleErrorToTransactionLimits() {
    const message = this.translate.instant('error:massive_transference_limit');

    return throwError(() => ({
      error: {
        message,
      },
      status: 400,
      statusText: message,
    }));
  }

  getTransactionLimits(transaction: ITMTransaction, transactionDetail: ITMRequestDetailBulkTransaction) {
    return this.transfer.transactionLimits({
      currency: transactionDetail?.sourceCurrency,
      service: transaction.serviceCode,
    });
  }

  executeProcessTransactionWithoutToken(transactions: ITMTransaction, isMultiple: boolean) {
    const userInfo = this.persistStepStateService.getParameter('userInfo');

    return this.stProcessHandler.processTransactionWithoutToken(
      {
        transactionCode: transactions?.reference,
        signatureType: userInfo?.signatureType,
      },
      isMultiple
    );
  }

  executeProcessTransactionWithToken(transactions: ITMTransaction, token?: string) {
    const userInfo = this.persistStepStateService.getParameter('userInfo');

    return this.stProcessHandler.processTransactionWithToken({
      isTokenRequired: this.handleTokenRequest.isTokenRequired(transactions.serviceCode),
      tokenValue: token as string,
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      bodyRequest: {
        transactionCode: transactions?.reference,
        signatureType: userInfo?.signatureType,
      },
      serviceCode: transactions.serviceCode,
    });
  }

  executeNotification(transactions: ITMTransaction, sourceAccount: IAccount, transactionDetail: ITMRequestDetailBulkTransaction) {
    return this.bulkTransaction.notification({
      sourceAccount: sourceAccount?.account,
      reference: transactions?.reference,
      dateTime: transactions?.interfaceDate,
      currency: sourceAccount?.currency,
      amount: this.util.parseAmountStringToNumber(transactions?.amount || transactionDetail?.amount),
    });
  }

  executeTransaction(values: IMassiveACHTransferProcessParameters) {
    const { formValues, targetAccount, parameters } = values;
    const { sourceAccount, transactionDetail } = parameters ?? {};

    const data = this.bulkTransactionManagerDefinition.dataToExecuteTransaction({
      lote: {
        correlative: Number(transactionDetail?.numberOfLote),
        code: 0,
        message: '',
      },
      sourceAccount,
      targetAccounts: targetAccount,
      formValues,
      formatRegister: EDataToExecuteTransactionBulkTransfer.FORMAT_REGISTER,
      fileName: EDataToExecuteTransactionBulkTransfer.FILE_NAME,
    });

    return this.bulkTransaction.bulkTransfer(data);
  }
}
