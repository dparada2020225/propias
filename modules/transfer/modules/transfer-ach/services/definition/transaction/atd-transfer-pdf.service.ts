import { Injectable } from '@angular/core';
import { IATDPdf } from '../../../interfaces/ach-transfer-definition.inteface';
import { IUserDataModalPdf } from '../../../../../../../models/util-work-flow.interface';
import { AdfFormatService } from '@adf/components';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IPrintData, PrintBuilder, PrintDataBuilder } from '../../../../../interface/print-data-interface';

@Injectable({
  providedIn: 'root'
})
export class AtdTransferPdfService {

  constructor(
    private util: UtilService,
    private utilWorkflow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService
  ) { }

  buildTransferPdf(pdfProperties: IATDPdf) {
    const { transactionResponse, fileName, title, formValues, sourceAccount, targetAccount } = pdfProperties ?? {};
    const attributes: IPrintData[] = [];
    const date = this.adfFormat.getFormatDateTime(transactionResponse?.dateTime)


    const rootAccount = new PrintDataBuilder()
      .label('root-account')
      .title(true)
      .build();
    attributes.push(rootAccount);

    const operationDate = new PrintDataBuilder()
      .label('operation-date')
      .value(this.adfFormat.getFormatDateTime(transactionResponse?.dateTime).numberFormat)
      .build();
    attributes.push(operationDate);

    const typeAccount = new PrintDataBuilder()
      .label('root-account-type')
      .value(this.util.getLabelProduct(Number(sourceAccount?.product ?? '00')))
      .build();
    attributes.push(typeAccount);

    const userDataDebited: IUserDataModalPdf = {
      account: sourceAccount?.account ?? 'undefined',
      name: sourceAccount?.alias ?? 'undefined'
    };

    const accountDebit = new PrintDataBuilder()
      .label('account-debited')
      .value(this.utilWorkflow.getUserDataModalPdf(userDataDebited))
      .build();
    attributes.push(accountDebit);

    const amountDebit = new PrintDataBuilder()
      .label('amount-debited')
      .value(`${this.util.geCurrencSymbol(sourceAccount?.currency ?? 'undefined')}. ${this.adfFormat.formatAmount(formValues?.amount ?? 0)}`)
      .build();
    attributes.push(amountDebit);

    const destinationAccount = new PrintDataBuilder()
      .label('destination-account')
      .title(true)
      .build();
    attributes.push(destinationAccount);



    const targetAccountName = new PrintDataBuilder()
      .label('ach_name_account')
      .value(targetAccount?.name ?? targetAccount?.alias)
      .build();
    attributes.push(targetAccountName);

    const targetAccountNumber = new PrintDataBuilder()
      .label('credit_account')
      .value(targetAccount?.account)
      .build();
    attributes.push(targetAccountNumber);

    const typeCreditAccount = new PrintDataBuilder()
      .label('target-bank')
      .value(targetAccount?.bankName)
      .build();
    attributes.push(typeCreditAccount);

    if (formValues?.comment !== '') {
      const commentAttribute = new PrintDataBuilder()
        .label('comment')
        .value(formValues?.comment ?? '')
        .build();
      attributes.push(commentAttribute);
    }

    return new PrintBuilder()
      .items(attributes)
      .account({ ...targetAccount, ...sourceAccount, referenceNumber: transactionResponse?.reference, date })
      .referenceNumber(`${transactionResponse?.reference ?? 'undefined'}`)
      .fileName(fileName ?? 'undefined')
      .title(this.translate.instant(title ?? 'undefined'))
      .build();
  }
}
