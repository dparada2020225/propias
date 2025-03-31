import { IAttributeReading } from '@adf/components';
import { Injectable } from '@angular/core';
import { IBasicAttributeVC } from 'src/app/models/build.interface';
import { UtilDefinitionService } from 'src/app/service/common/util-definition.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { IExecuteOwnTransfer, IOwnTransferExecuteProperties } from '../../../interfaces/own-transfer.interface';

@Injectable({
  providedIn: 'root',
})
export class OtdTransferBaseVoucherService {
  constructor(private tokenizerEncrypt: TokenizerAccountsService, private utilDefinitionService: UtilDefinitionService) {}

  buildData(data: IBasicAttributeVC): IAttributeReading {
    return this.utilDefinitionService.buildDataReadingBuilder(data);
  }

  buildAccountToExecuteTransfer(properties: IOwnTransferExecuteProperties): IExecuteOwnTransfer {
    const accountToCredit = properties?.accountToCredit;
    const accountToDebit = properties?.accountToDebit;
    const formValues = properties?.formValues;

    return {
      sourceAccount: this.tokenizerEncrypt.tokenizer(formValues?.accountDebited),
      sourceProduct: '' + accountToDebit?.product,
      sourceSubProduct: '' + accountToDebit?.subproduct,
      sourceCurrency: accountToDebit?.currency!,
      sourceAlias: accountToDebit?.alias!,
      targetAccount: this.tokenizerEncrypt.tokenizer(formValues?.accountCredit),
      targetProduct: '' + accountToCredit?.product,
      targetSubProduct: '' + accountToCredit?.subproduct,
      targetCurrency: accountToCredit?.currency!,
      targetAlias: accountToCredit?.alias!,
      amount: +formValues?.amount,
      notify: false,
      description: formValues?.comment ?? '',
      email: null!,
    };
  }
}
