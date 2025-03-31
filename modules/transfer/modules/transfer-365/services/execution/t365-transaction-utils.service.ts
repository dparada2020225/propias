import { Injectable } from '@angular/core';
import { ACHTransactionBuilder,
} from '../../../transfer-ach/interfaces/ach-transaction.interface';
import { Product } from '../../../../../../enums/product.enum';
import { ACCOUNT_CLIENT_TYPE } from '../../../transfer-ach/enum/ach-crud-control-name.enum';
import { EACHStatusAccount } from '../../../transfer-ach/enum/transfer-ach.enum';
import { EFormatRegister, EPaymentType } from '../../../../../../enums/payment-type.enum';
import { I365TransactionParameters } from '../../interfaces/transaction.interface';
import {
  T365SourceAccountBuilder,
  T365TargetAccountBuilder,
  T365TransactionBuilder
} from '../../interfaces/transaction-builder.interface';
import { IACHCurrencies, IACHSettings, IDataToSettingsACH } from '../../../transfer-ach/interfaces/settings.interface';
import { IAchAccount, V3IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { IACHBiesGeneralParameterBank } from '../../../../../../models/ach-general-parameters.interface';

@Injectable({
  providedIn: 'root'
})
export class T365TransactionUtilsService {

  constructor(
    private utils: UtilService,
  ) { }

  dataToExecuteTransaction(parameters: I365TransactionParameters) {
    const {
      formValues,
      targetAccountSelected,
      sourceAccountSelected,
      bankSelected,
      userInfo
    } = parameters;

    const { comment, amount } = formValues;
    const dataFromSettings = this.getDataToListOfBanks(bankSelected, targetAccountSelected);

    const sourceAccount = new T365SourceAccountBuilder()
      .account(sourceAccountSelected.account)
      .accountProduct(sourceAccountSelected.product)
      .accountSubProduct(sourceAccountSelected.subproduct)
      .currency(sourceAccountSelected.currency)
      .alias(sourceAccountSelected.alias)
      .name(sourceAccountSelected.name)
      .email(userInfo.email)
      .build();

    const targetAccount = new T365TargetAccountBuilder()
      .amount(String(this.utils.parseAmountStringToNumber(amount)))
      .bankCode(targetAccountSelected.bank)
      .product(Product[targetAccountSelected.type])
      .account(targetAccountSelected.account)
      .currency(targetAccountSelected.currency)
      .identification(targetAccountSelected.documentNumber)
      .accountName(targetAccountSelected.name)
      .bankName(targetAccountSelected.bankName)
      .dateCreated(targetAccountSelected.creationDate.slice(0, 8))
      .userCreated(targetAccountSelected.userOfCreation)
      .dateModified(targetAccountSelected.modificationDate.slice(0, 8))
      .userModified(targetAccountSelected.userOfModification)
      .email(targetAccountSelected.email)
      .bankId(dataFromSettings.routeCode)
      .internalProduct(dataFromSettings?.internalProduct)
      .descriptionProduct(targetAccountSelected.type)
      .codeProposal('')
      .codeTypeOperation('')
      .descriptionTypeOperation('')
      .codeTypeOriginalOperation('')
      .codeTypePayment('')
      .descriptionTypePayment('')
      .commission('')
      .status(EACHStatusAccount[targetAccountSelected?.status || 'UNKNOWN'])
      .build();


    return new T365TransactionBuilder()
      .cif(userInfo.customerCode)
      .paymentType(EPaymentType.ACH_TRANSFER)
      .formatRegister(EFormatRegister.ACH_TRANSFER)
      .currency(sourceAccountSelected.currency)
      .description(comment)
      .source(sourceAccount)
      .target(targetAccount)
      .omitASTransaction(false)
      .build();
  }

  private getDataToListOfBanks(bankSelected: IACHBiesGeneralParameterBank, targetAccountSelected: V3IAchAccount): IDataToSettingsACH {


    return {
      internalProduct: '',
      routeCode: '',
    };
  }
}
