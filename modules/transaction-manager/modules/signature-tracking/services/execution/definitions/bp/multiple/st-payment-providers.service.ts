import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IACHSettings } from '../../../../../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { AtdUtilService } from '../../../../../../../../transfer/modules/transfer-ach/services/atd-util.service';
import { TransactionManagerService } from '../../../../../../../services/transaction-manager.service';
import {
  BulkTransactionService
} from '../../../../../../../../transfer/modules/bulk-transfer/services/transaction/bulk-transfer-transaction.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IUserInfo } from '../../../../../../../../../models/user-info.interface';
import { EUsePaymentOFfProvidersService } from '../../../../../enum/st-navigate-enum';
import { IPaymentOfProvidersRequest, IProviderDetail } from '../../../../../interfaces/st-process.interface';
import { AccountBuilder, IAccount } from '../../../../../../../../../models/account.inteface';
import {
  BulkTransactionBuilder
} from '../../../../../../../../transfer/modules/bulk-transfer/models/bul-transaction.interface';
import { EPaymentType } from '../../../../../../../../../enums/payment-type.enum';
import {
  ACHTargetAccountBuilder
} from '../../../../../../../../transfer/modules/transfer-ach/interfaces/ach-transaction.interface';


@Injectable({
  providedIn: 'root'
})
export class StPaymentProvidersService {
  private achSettings: IACHSettings[] = [];

  constructor(
    private stTransaction: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
    private parameterManagementService: ParameterManagementService,
    private achUtils: AtdUtilService,
    private transactionManagerService: TransactionManagerService,
    private bulkTransactionService: BulkTransactionService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string, achSettings: IACHSettings[]) {
    this.achSettings = achSettings;
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processPaymentProviders(transaction, signatureType)
      .pipe(
        concatMap(() => this.executePaymentProviders(transaction))
      );
  }

  private processPaymentProviders(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);

  }

  private executePaymentProviders(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionPaymentToProviders(transaction?.request);
    const userInfo: IUserInfo = this.parameterManagementService.getParameter('userInfo');

    if (detail?.paymentMethod !== EUsePaymentOFfProvidersService.ACH) {
      return of(transaction);
    }

    const bodyRequest = {
      lotCode: detail?.numberOfLote,
      company: userInfo?.customerCode,
    } as IPaymentOfProvidersRequest;

    let currentSourceAccount: IAccount;

    return this.transactionManagerService.getSourceAccount(detail.sourceAccountNumber)
      .pipe(
        concatMap((sourceAccount) => {
          currentSourceAccount = new AccountBuilder()
            .account(sourceAccount?.account)
            .currency(sourceAccount?.currency)
            .product(Number(sourceAccount?.productType))
            .subproduct(Number(sourceAccount?.subProductType))
            .name(sourceAccount?.name)
            .email('')
            .build();

          return this.stTransaction.paymentOfProviders(bodyRequest);
        }),
        concatMap((response) => this.executeTransaction(detail, currentSourceAccount, response?.providerDetails ?? [])),
      );
  }

  private executeTransaction(transactionDetailFromRequest: any, sourceAccount: IAccount, listTarget: IProviderDetail[]) {
    const data = this.dataToExecuteTransaction({
      lote: {
        correlative: transactionDetailFromRequest?.numberOfLote,
        code: 0,
        message: null,
      },
      sourceAccount,
      targetAccounts: listTarget,
      formValues: null,
      formatRegister: 'CTX',
      fileName: 'stFileNameProcessTransaction'
    });

    return this.bulkTransactionService.bulkTransfer(data);
  }

  private dataToExecuteTransaction(parameters: any) {
    const { lote, sourceAccount, targetAccounts, formatRegister, fileName } = parameters ?? {};
    const idClient = this.parameterManagementService.getParameter('userInfo')?.customerCode;

    const currentSourceAccount = this.achUtils.getDataSourceAccountToExecuteTransaction(sourceAccount);

    return new BulkTransactionBuilder()
      .lot(lote?.correlative)
      .cif(idClient)
      .paymentType(EPaymentType.PAYMENT_OF_PROVIDERS)
      .formatRegister(formatRegister)
      .currency(sourceAccount?.currency)
      .scheduleDate('')
      .fileName(fileName)
      .source(currentSourceAccount.sourceAccount)
      .target(this.parseAchAccount(targetAccounts, sourceAccount?.currency))
      .build();
  }

  private parseAchAccount(account: IProviderDetail[], currency: string){
    return account.map((acc) => (
      new ACHTargetAccountBuilder()
        .bankId(acc?.bankRoute)
        .identification(acc?.providerId)
        .name(acc?.name)
        .email('')
        .account(acc?.targetAccount)
        .accountProduct(this.achUtils.getProduct(acc?.accountType))
        .id(this.achUtils.getBankRouteForSourceAccount(currency))
        .amount(acc?.targetAmount)
        .internalProduct(this.achUtils.getInternalProductForPaymentOfProviders(this.achSettings, acc, currency))
        .targetBankCode(Number(acc?.bankId))
        .build()
    ));
  }

}
