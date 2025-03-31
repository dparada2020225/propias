import { Injectable } from '@angular/core';
import {
  ITMACH365TransferParameters,
  ITMAchSipaTransferParameters, ITMThirdPartyLoanPaymentParameters,
  ITransactionManagerAccountDetail
} from '../../../interfaces/transaction-manger.interface';
import {
  AchAccountBuilder,
} from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { OwnTransferAccount } from '../../../../transfer/modules/transfer-own/interfaces/own-transfer.interface';
import { EACHTypeTransaction } from '../../../../transfer/modules/transfer-ach/enum/transfer-ach.enum';
import {
  S365FormValueBuilder,
  S365ScheduleFormValues
} from '../../../../transfer/modules/transfer-365-sipa/interfaces/form.interface';
import { UtilService } from '../../../../../service/common/util.service';
import { StBisvSplitTransactionManagerService } from './st-bisv-split-transaction-manager.service';
import { EProductFromCode } from '../../../../../enums/product.enum';

@Injectable({
  providedIn: 'root'
})
export class TmdBisvConfirmationVoucherManagerService {

  constructor(
    private splitTransactionDetail: StBisvSplitTransactionManagerService,
    private util: UtilService,
  ) { }

  buildParametersToACHBiesTransaction(parameters: ITMACH365TransferParameters) {
    const { transaction } = parameters;
    const transactionDetail = this.splitTransactionDetail.getTransactionDetailForACHInBiesProfile(transaction?.request);
    const sourceAccountSelected = new OwnTransferAccount()
      .account(transactionDetail.sourceAccount)
      .alias(transaction?.alias)
      .currency(transactionDetail.sourceCurrency)
      .enabled(true)
      .name(transactionDetail.sourceAccountDescription)
      .product(Number(transactionDetail.sourceProduct))
      .subproduct(Number(transactionDetail.sourceSubProduct))
      .build();

    const targetAccountSelected = new OwnTransferAccount()
      .account(transactionDetail.targetAccount)
      .alias(transaction?.targetAlias ?? '')
      .currency(transactionDetail.targetCurrency)
      .enabled(true)
      .name(transactionDetail.targetAccountName)
      .product(Number(transactionDetail.targetProduct))
      .subproduct(Number(0))
      .build();

    const formValues = {
      originAccount: transactionDetail.sourceAccount,
      amount: transactionDetail.sourceAmountParsed,
      bank: transactionDetail.codeBank,
      destinationAccount: transactionDetail.targetAccount,
      purpose: transactionDetail.proposalCode,
      comment: transactionDetail.comment,
      commission: transactionDetail.UniCommissionParsed,
    }

    return {
      sourceAccount: sourceAccountSelected,
      transactionManagerDetail: transactionDetail,
      title: '',
      subtitle: '',
      transactionSelected: transaction,
      formValues,
      dateTime: transaction?.dateTime,
      reference: transaction?.reference,
      targetAccount: targetAccountSelected,
      commission: transactionDetail.UniCommissionParsed,
      bank: {
        code: transactionDetail.codeBank,
        description: transactionDetail.targetBankName,
      },
      purpose: {
        code: transactionDetail.proposalCode,
        description: '',
      },
      bankSettingSelected: {
        name: transactionDetail.targetBankName,
      }
    };
  }

  buildParametersToACH365Transaction(parameters: ITMACH365TransferParameters) {
    const { transaction } = parameters;
    const transactionDetail = this.splitTransactionDetail.getTransactionDetailForACHInBiesProfile(transaction?.request);


    const sourceAccountSelected = new OwnTransferAccount()
      .account(transactionDetail.sourceAccount)
      .alias(transaction?.alias)
      .currency(transactionDetail.sourceCurrency)
      .enabled(true)
      .name(transactionDetail.sourceAccountDescription)
      .product(Number(transactionDetail.sourceProduct))
      .subproduct(Number(transactionDetail.sourceSubProduct))
      .build();

    const targetAccountSelected = new AchAccountBuilder()
      .name(transactionDetail.targetAccountName)
      .account(transactionDetail.targetAccount)
      .currency(transactionDetail.targetCurrency)
      .alias(transaction.targetAlias ?? '')
      .type(EProductFromCode[transactionDetail.targetProduct])
      .bank(0)
      .bankName(transactionDetail.targetBankName)
      .build();

    const formValues = {
      comment: transactionDetail.comment,
      amount: transactionDetail.sourceAmountParsed,
    }

    return {
      sourceAccountSelected,
      targetAccountSelected,
      transactionManagerDetail: transactionDetail,
      transactionSelected: transaction,
      formValues,
      transactionResponse: {
        dateTime: transaction?.dateTime,
        reference: transaction?.reference,
      },
      typeTransaction: EACHTypeTransaction.DEFAULT,
      bankSelected: {
        code: transactionDetail.codeBank,
        description: transactionDetail.targetBankName,
      }
    };
  }

  buildParametersToACHMovil365Transaction(parameters: ITMACH365TransferParameters) {
    const { transaction, useFormValues } = parameters;
    const transactionDetail = this.splitTransactionDetail.getTransactionDetailForACHInBiesProfile(transaction?.request);

    const sourceAccountSelected = new OwnTransferAccount()
      .account(transactionDetail.sourceAccount)
      .alias(transaction?.alias)
      .currency(transactionDetail.sourceCurrency)
      .enabled(true)
      .name(transactionDetail.sourceAccountDescription)
      .product(Number(transactionDetail.sourceProduct))
      .subproduct(Number(transactionDetail.sourceSubProduct))
      .build();
    return {
      transactionDetail,
      transactionSelected: transaction,
      bankSettingSelected: {
        code: transactionDetail.codeBank,
        description: transactionDetail.targetBankName,
      },
      sourceAccountSelected: sourceAccountSelected,
      beneficiarySelected: {
        name: transactionDetail.targetAccountName,
        alias: transaction.targetAlias ?? '',
        account: transactionDetail.targetAccount,
        email: transactionDetail.targetEmail,
        bankName: transactionDetail.targetBankName,
      },
      formValues: useFormValues ? {
        comment: transactionDetail.comment,
        amount: transactionDetail.sourceAmountParsed,
        email: transactionDetail.targetEmail,
      } : undefined,
    };
  }

  buildParametersToACHSipaTransaction(parameters: ITMAchSipaTransferParameters) {
    const { transaction } = parameters ?? {};
    const transactionDetail = this.splitTransactionDetail.getTransactionDetailForSipaInBiesProfile(transaction?.request);

    const sourceAccountSelected = new OwnTransferAccount()
      .account(transactionDetail.sourceAccount)
      .alias(transaction?.alias)
      .currency(transactionDetail.sourceCurrency)
      .enabled(true)
      .name(transactionDetail.sourceAccount)
      .product(Number(transactionDetail.sourceProduct))
      .subproduct(Number(transactionDetail.sourceSubProduct))
      .build();

    const targetAccountSelected = new AchAccountBuilder()
      .name(transactionDetail.targetAccount)
      .account(transactionDetail.targetAccount)
      .currency(transactionDetail.targetCurrency)
      .alias(transaction.targetAlias ?? '')
      .bank(0)
      .bankName(transactionDetail.bankCode)
      .build();

    const reasonSelected = {
      name: '',
      value: ''
    }

    const commission_example = this.util.parseNumberAsFloatFixed(1.13);
    const totalAmount = this.util.parseAmountStringToNumber(transactionDetail.sourceAmountParsed);
    const totalValue = `${transactionDetail.targetCurrency} ${totalAmount + Number(commission_example)}`;

    const formValues = new S365FormValueBuilder()
      .sourceAccount(transactionDetail.sourceAccount)
      .targetAccount(transactionDetail.targetAccount)
      .comment(transactionDetail.comment)
      .amount(totalAmount + '')
      .reason('')
      .build();

    const scheduleFormValues = new S365ScheduleFormValues()
      .date('')
      .build();


    return {
      sourceAccountSelected,
      targetAccountSelected,
      formValues,
      scheduleFormValues,
      reasonSelected,
      totalValue,
      commission: commission_example,
      transactionManagerDetail: transactionDetail,
      transactionSelected: transaction,
      transactionResponse: {
        dateTime: transaction.dateTime,
        reference: transaction.reference,
      },
      typeTransaction: EACHTypeTransaction.DEFAULT
    };
  }



  buildParametersToPaymentOfPayroll(parameters: ITMThirdPartyLoanPaymentParameters) {
    const { transaction, sourceAccount } = parameters;
    const sourceAccountBuild = this.getSourceAccount(sourceAccount);
    const transactionDetail = this.splitTransactionDetail.getDetailTransactionPaymentOfPayroll(transaction?.request);

    sourceAccountBuild.alias = transactionDetail?.alias === '' ? (sourceAccountBuild?.account ?? '').trim() : transactionDetail?.alias

    return {
      transactionSelected: transaction,
      sourceAccount: sourceAccountBuild,
      transactionDetail,
    }
  }

  buildParametersToAchMultipleUni(parameters: ITMThirdPartyLoanPaymentParameters) {
    const { sourceAccount } = parameters;
    const sourceAccountBuild = this.getSourceAccount(sourceAccount);


    return {
      sourceAccount: sourceAccountBuild,
    }
  }

  private getSourceAccount(account: ITransactionManagerAccountDetail) {
    return new OwnTransferAccount()
      .account(account?.account ?? '')
      .currency(account?.currency ?? '')
      .enabled(true)
      .mask(account?.mask ?? '')
      .name(account?.name ?? '')
      .product(Number(account?.productType ?? 0))
      .status(account?.status ?? '')
      .subproduct(Number(account?.subProductType ?? 0))
      .build();
  }
}
