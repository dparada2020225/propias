import { Injectable } from '@angular/core';
import { SplitTransactionDetailService } from './split-transaction-detail.service';
import { UtilService } from '../../../../../service/common/util.service';
import { AtdUtilService } from '../../../../transfer/modules/transfer-ach/services/atd-util.service';
import {
  ITMRequestDetailACHTransaction,
  ITMThirdPartyLoanPaymentParameters,
  ITMThirdTransferParameters,
  ITransactionManagerAccountDetail
} from '../../../interfaces/transaction-manger.interface';
import {
  AchAccountBuilder,
  IAchAccount
} from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';
import {
  IOwnTransferState,
  OwnTransferAccount,
  OwnTransferFormValuesBuilder
} from '../../../../transfer/modules/transfer-own/interfaces/own-transfer.interface';
import { ITPLPVoucherBuilder } from '../../../../loan/modules/third-party-loans/interfaces/payment-interface';
import { environment } from '../../../../../../environments/environment';
import { ACHFormValuesBuilder } from '../../../../transfer/modules/transfer-ach/interfaces/ach-transfer.interface';
import { EACHTypeTransaction } from '../../../../transfer/modules/transfer-ach/enum/transfer-ach.enum';
import {
  IACHTransactionNavigateParametersState
} from '../../../../transfer/modules/transfer-ach/interfaces/ach-persists-parameters.interface';
import {
  DonationAccountBuilder,
  DonationFormValuesBuilder
} from '../../../../transfer/modules/donation/interfaces/donation-account.interface';
import { IDonationState } from '../../../../transfer/modules/donation/interfaces/donation.state.interface';
import {
  EOwnTransferTypeTransaction
} from '../../../../transfer/modules/transfer-own/enum/own-transfer-control-name.enum';
import {
  ThirdTransferFormValuesBuilder
} from '../../../../transfer/modules/transfer-third/interfaces/third-transfer.interface';
import {
  EThirdTransferTypeTransaction
} from '../../../../transfer/modules/transfer-third/enums/third-transfer-navigate-parameters.enum';
import {
  IThirdTransferTransactionState
} from '../../../../transfer/modules/transfer-third/interfaces/third-transfer-persistence.interface';
import { ThirdTransferAccount } from '../../../../transfer/interface/transfer-data-interface';



@Injectable({
  providedIn: 'root',
})
export class TmdConfirmationVoucherManagerService {

  constructor(
    private splitTransactionDetail: SplitTransactionDetailService,
    private util: UtilService,
    private achUtils: AtdUtilService,
  ) { }


  buildParametersToTransferThird(parameters: ITMThirdTransferParameters) {
    const {
      accountDebited,
      accountCredited,
      transaction } = parameters ?? {};
    const data = this.splitTransactionDetail.getTransactionDetailForSampleTransactions(transaction?.request.trimStart());

    const targetAccountAlias = data?.targetAlias ? data?.targetAlias : data?.accountTarget;

    const targetAccount = new ThirdTransferAccount()
      .alias(targetAccountAlias)
      .accountNumber(accountCredited?.account ?? data?.accountTarget ?? '')
      .name(accountCredited?.name)
      .currency(accountCredited?.currency)
      .formattedAccount( '')
      .product(Number(accountCredited?.productType))
      .email('')
      .status(accountCredited?.status ?? '')
      .favorite(false)
      .subProduct(accountCredited?.subProductType)
      .productLabel( '')
      .build();

    const sourceAccount = new OwnTransferAccount()
      .account(accountDebited?.account ?? data?.accountOrigin)
      .agency( 0)
      .alias(transaction?.alias ?? data?.accountOrigin ?? '')
      .availableAmount(0)
      .cif( '')
      .consortium('')
      .currency(accountDebited?.currency)
      .enabled(true)
      .mask(accountDebited?.mask)
      .name(accountDebited?.name)
      .product(Number(accountDebited?.productType))
      .status(accountDebited?.status)
      .subproduct(Number(accountDebited?.subProductType))
      .totalAmount('')
      .build();

    const formValues = new ThirdTransferFormValuesBuilder()
      .accountDebited(data?.accountOrigin)
      .email(`${data?.email}`)
      .amount(`${this.util.parseAmountStringToNumber(transaction?.amount ?? data?.amountOrigin)}`)
      .comment(data?.description)
      .build();

    return {
      targetAccount,
      sourceAccount,
      formValues,
      typeTransaction: EThirdTransferTypeTransaction.DEFAULT,
      message: parameters?.message ?? '',
      transactionManagerDetail: data,
      transactionSelected: transaction,
      transactionResponse: {
        reference: transaction?.reference ?? '',
        dateTime: transaction?.dateTime ?? '',
      }
    } as IThirdTransferTransactionState;
  }

  buildParametersToTransferOwn(parameters: ITMThirdTransferParameters) {
    const { accountDebited, accountCredited, transaction } = parameters ?? {};
    const data = this.splitTransactionDetail.getTransactionDetailForSampleTransactions(transaction?.request.trimStart());

    const targetAccount = new OwnTransferAccount()
      .account(data?.accountTarget ?? accountCredited?.account)
      .agency( 0)
      .alias(transaction?.targetAlias ?? data.accountTarget ?? '')
      .availableAmount(0)
      .cif( '')
      .consortium('')
      .currency(data.currencyTarget ?? accountCredited?.currency)
      .enabled(true)
      .mask(accountCredited?.mask)
      .name(accountCredited?.name)
      .product(Number(data?.productTarget ?? accountCredited?.productType))
      .status(accountCredited?.status)
      .subproduct(Number(data?.subProductTarget ?? accountCredited?.subProductType))
      .totalAmount('')
      .build();

    const sourceAccount = new OwnTransferAccount()
      .account(data?.accountOrigin ?? accountDebited?.account)
      .agency( 0)
      .alias(transaction?.alias ?? data?.accountOrigin ?? '')
      .availableAmount(0)
      .cif( '')
      .consortium('')
      .currency(data?.currencyOrigin ?? accountDebited?.currency)
      .enabled(true)
      .mask(accountDebited?.mask)
      .name(accountDebited?.name)
      .product(Number(data?.productOrigin ?? accountDebited?.productType))
      .status(accountDebited?.status ?? '')
      .subproduct(Number(data.subProductOrigin ?? accountDebited?.subProductType))
      .totalAmount('')
      .build();

    const formValues = new OwnTransferFormValuesBuilder()
      .accountDebited(data?.accountOrigin)
      .accountCredit(data?.accountTarget)
      .amount(`${this.util.parseAmountStringToNumber(transaction?.amount ?? data?.amountOrigin)}`)
      .comment(data?.description )
      .build();

    return {
      debitedAccount: sourceAccount,
      accreditAccount: targetAccount,
      formValues,
      typeTransaction: EOwnTransferTypeTransaction.DEFAULT,
      transactionManagerDetail: data,
      transactionSelected: transaction,
      transactionResponse: {
        rate: 0,
        date: transaction?.dateTime,
        reference: transaction?.reference,
        description: data?.description,
        targetAccount: null,
        sourceAccount: null,
      }

    } as IOwnTransferState;
  }

  buildParametersToDonation(parameters: ITMThirdTransferParameters) {
    const { accountDebited, accountCredited, transaction } = parameters ?? {};
    const data = this.splitTransactionDetail.getTransactionDetailForSampleTransactions(transaction?.request.trimStart());

    const targetAccount = new DonationAccountBuilder()
      .code('')
      .product(accountCredited?.productType)
      .name(accountCredited?.name)
      .subProduct(accountCredited?.subProductType)
      .account(accountCredited?.account ?? '')
      .logo('')
      .currency(accountCredited?.currency)
      .build();

    const sourceAccount = new OwnTransferAccount()
      .account(accountDebited?.account ?? '')
      .agency( 0)
      .alias(transaction?.alias)
      .availableAmount(0)
      .cif( '')
      .consortium('')
      .currency(accountDebited?.currency)
      .mask(accountDebited?.mask)
      .name(accountDebited?.name)
      .product(Number(accountDebited?.productType))
      .status(accountDebited?.status)
      .subproduct(Number(accountDebited?.subProductType))
      .totalAmount('')
      .build();

    const formValues = new DonationFormValuesBuilder()
      .sourceAccount(data?.accountOrigin)
      .fundationAccount(data?.accountTarget)
      .amount(`${this.util.parseAmountStringToNumber(transaction?.amount ?? data?.amountOrigin)}`)
      .comment(data?.description)
      .build();

    return {
      debitedAccount: sourceAccount,
      fundationAccount: targetAccount,
      formValues,
      transactionManagerDetail: data,
      transactionSelected: transaction,
      fundationDetailAccount: accountCredited,
      transactionResponse: {
        dateTime: transaction?.dateTime,
        reference: transaction?.reference,
      },
    } as IDonationState;
  }

  buildParametersToACHTransaction(parameters: ITMThirdTransferParameters, achAccounts?: IAchAccount[]) {
    const { accountDebited, accountCredited, transaction } = parameters ?? {};
    const data = this.splitTransactionDetail.getTransactionDetailForACHRequest(transaction?.request);
    const targetAccountNumber = accountCredited?.account ?? data?.targetAccount;

    const targetAccount = new AchAccountBuilder()
      .type(data?.targetProduct ??  '00')
      .name(accountCredited?.name ?? '')
      .account(data?.targetAccount)
      .currency(data?.targetCurrency ?? environment.currency)
      .alias(transaction?.targetAlias ?? data?.targetAccountAlias ?? '')
      .bank(data.bankId)
      .bankName(data?.targetAccountBankName)
      .build();

    const sourceAccount = this.buildACHSourceAccount(data);
    sourceAccount.alias = transaction?.alias ?? data?.sourceAlias ?? '';
    sourceAccount.currency = accountDebited?.currency ?? data?.sourceCurrency ?? environment.currency;
    sourceAccount.product = Number(accountDebited?.productType ?? data?.sourceProduct ?? '00');

    const isSchedule = this.achUtils.buildIsTransactionSchedule(data?.transferenceDate, data?.transferenceHour);
    const date = this.achUtils.buildScheduleForUseInServiceProcess(data?.transferenceDateRaw, data?.transferenceHourRaw)


    const formValues = new ACHFormValuesBuilder()
      .accountDebited(data?.sourceAccount)
      .comment(data?.comment)
      .amount(`${this.util.parseAmountStringToNumber(transaction?.amount ?? data?.amount)}`)
      .date(isSchedule ? date?.date : null as any)
      .hour(isSchedule ? this.achUtils.buildHourForModifyFlow(data?.transferenceHour) : '')
      .schedule(isSchedule)
      .build();

    const associatedAccount = achAccounts ? achAccounts.find(account => account.account === targetAccountNumber) : undefined;

    return {
      sourceAccount,
      targetAccount,
      formValues,
      associatedAccount,
      transactionManagerDetail: data,
      transactionSelected: transaction,
      transactionResponse: {
        dateTime: transaction?.dateTime,
        reference: transaction?.reference,
      },
      typeTransaction: EACHTypeTransaction.DEFAULT
    } as IACHTransactionNavigateParametersState;
  }

  buildParametersToThirdPartyLoanPayment(parameters: ITMThirdPartyLoanPaymentParameters) {
    const { transaction, sourceAccount } = parameters ?? {};

    const transactionDetail =  this.splitTransactionDetail.getTransactionDetailForThirdPartyPaymentLoan(transaction?.request);
    const sourceAccountBuild = this.getSourceAccount(sourceAccount);
    const currentAlias = transactionDetail?.sourceAccountAlias === '' ? (sourceAccountBuild?.account ?? '').trim() : transactionDetail?.sourceAccountAlias

    const structure =  new ITPLPVoucherBuilder()
      .accountDebited(transactionDetail.sourceAccount)
      .accountProduct(Number(transactionDetail?.sourceProduct))
      .accountSubProduct(Number(transactionDetail?.sourceSubProduct))
      .aliasAccountDebited(this.removedZeros(currentAlias))
      .amount(transactionDetail?.sourceAmount)
      .comment((transactionDetail?.comment ?? 'UNDEFINED').trim())
      .currency(this.util.getISOCurrency((transactionDetail?.sourceCurrency ?? 'UNDEFINED').trim()))
      .description((transactionDetail?.comment ?? 'UNDEFINED').trim())
      .email((transactionDetail?.email ?? 'UNDEFINED').trim())
      .loanIdentifier(transactionDetail?.targetAccount)
      .loanProduct(transactionDetail?.targetProduct)
      .loanSubProduct(transactionDetail?.targetSubProduct)
      .nameAccountDebited(sourceAccount?.name)
      .nameLoan((transactionDetail?.nameLoan ?? 'UNDEFINED').trim())
      .notifyTo((transactionDetail?.email ?? '').trim() + (transactionDetail?.email2 ?? '').trim())
      .aliasLoan((transactionDetail?.aliasLoan ?? 'UNDEFINED').trim())
      .totalPayment('')
      .build();

    return {
      transactionDetail,
      sourceAccountBuild,
      structure,
      transactionSelected: transaction,
    };
  }

  buildParametersToBulkTransaction(transactionSelected: ITMTransaction) {
    return this.splitTransactionDetail.getTransactionDetailForBulkTransferRequest(transactionSelected?.request);
  }

  removedZeros(value: string) {
    return value.replace(/0+$/, '');
  }

  private getSourceAccount(account: ITransactionManagerAccountDetail) {
    return new OwnTransferAccount()
      .account(account?.account ?? '')
      .agency( 0)
      .availableAmount(0)
      .currency(account?.currency ?? '')
      .enabled(true)
      .mask(account?.mask ?? '')
      .name(account?.name ?? '')
      .product(Number(account?.productType ?? 0))
      .status(account?.status ?? '')
      .subproduct(Number(account?.subProductType ?? 0))
      .build();
  }

  private buildACHSourceAccount(transactionDetail: ITMRequestDetailACHTransaction) {
    return new OwnTransferAccount()
      .account(transactionDetail?.sourceAccount ?? '')
      .agency( 0)
      .availableAmount(0)
      .currency(transactionDetail?.sourceCurrency ?? '')
      .enabled(true)
      .name(transactionDetail?.sourceProductDescription ?? '')
      .product(Number(transactionDetail?.sourceProduct ?? 0))
      .subproduct(Number(transactionDetail?.sourceSubProduct ?? 0))
      .build();
  }
}
