import { AdfFormatService } from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { IThirdTransfer } from '../../../../interface/transfer-data-interface';
import { IDataToTransactionExecute } from '../../interfaces/third-transfer-definition.interface';

@Injectable({
  providedIn: 'root',
})
export class ThirdTransferDefinitionService {
  constructor(private util: UtilService, private formatService: AdfFormatService, private tokenEncrypt: TokenizerAccountsService) {}

  buildDataToExecuteTransaction(properties: IDataToTransactionExecute): IThirdTransfer {
    const { formValues, sourceAccount, targetAccount } = properties ?? {};

    return {
      sourceAccount: this.tokenEncrypt.tokenizer(formValues.accountDebited) ?? '',
      sourceProduct: `${sourceAccount?.product ?? ''}`,
      sourceSubProduct: `${sourceAccount?.subproduct ?? ''}`,
      sourceCurrency: sourceAccount?.currency ?? '',
      sourceAlias: sourceAccount?.alias ?? '',
      targetAccount: this.tokenEncrypt.tokenizer(targetAccount?.account) ?? '',
      targetProduct: targetAccount?.type ?? String(targetAccount?.product) ?? '',
      targetSubProduct: `${targetAccount?.subProduct ?? targetAccount?.subproduct ?? ''}`,
      targetCurrency: targetAccount?.currency ?? '',
      targetAlias: targetAccount?.alias ?? '',
      amount: +formValues.amount,
      description: formValues.comment,
      notify: !!formValues.email,
      email: formValues.email,
    };
  }
}
