import { Injectable } from '@angular/core';

import { AdfFormatService } from '@adf/components';
import { IBTPdfBulk, IDetailFile } from '../../../models/bulk-transfer.interface';
import { IUserDataModalPdf } from '../../../../../../../models/util-work-flow.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IPrintData, PrintBuilder, PrintDataBuilder } from '../../../../../interface/print-data-interface';

@Injectable({
  providedIn: 'root'
})
export class BtdPdfService {

  constructor(
    private util: UtilService,
    private utilWorkflow: UtilWorkFlowService,
    private formatService: AdfFormatService,
  ) { }

  buildTransferPdf(pdfProperties: IBTPdfBulk, creditedAccounts: IDetailFile[]){
    const { dateTime, reference, sourceAccount, currentFile } = pdfProperties ?? {};
    const { heading } = currentFile ?? {};

    const attributes: IPrintData[] = [];

    const rootAccount = new PrintDataBuilder()
      .label('root-account')
      .title(true)
      .build();
    attributes.push(rootAccount);

    const operationDate = new PrintDataBuilder()
      .label('operation-date')
      .value(`${dateTime?.numberFormat} ${dateTime?.hourSuffix}`)
      .build();
    attributes.push(operationDate);

    const typeAccount = new PrintDataBuilder()
      .label('type_account')
      .value(`${''}`)
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

    const amountDebitAttribute = new PrintDataBuilder()
      .label('amount-debited')
      .value(`${this.util.geCurrencSymbol(sourceAccount?.currency ?? '')}. ${this.formatService.formatAmount(heading?.totalAmount)}`)
      .build();
    attributes.push(amountDebitAttribute);


    const amountCreditsAttribute = new PrintDataBuilder()
      .label('amount_credits')
      .value(`${heading.credits ?? 0}`)
      .build();
    attributes.push(amountCreditsAttribute);

    const currencyDebitAttribute = new PrintDataBuilder()
      .label('currency')
      .value(this.util.getLabelCurrency(sourceAccount?.currency) ?? 'undefined')
      .build();
    attributes.push(currencyDebitAttribute);


    return new PrintBuilder()
      .items(attributes)
      .account({ ...sourceAccount, ...creditedAccounts, referenceNumber: reference })
      .referenceNumber(`${reference ?? 'undefined'}`)
      .fileName(pdfProperties.fileName ?? 'undefined')
      .title(pdfProperties.title ?? 'undefined')
      .build();

  }
}
