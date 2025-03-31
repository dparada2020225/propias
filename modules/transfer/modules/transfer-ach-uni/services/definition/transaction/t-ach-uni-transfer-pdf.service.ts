import { AdfFormatService } from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPrintData, PrintBuilder, PrintDataBuilder } from 'src/app/modules/transfer/interface/print-data-interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IAchUniDPdf } from '../../../interfaces/ach-uni-definition';
import { IUserDataModalPdf } from 'src/app/models/util-work-flow.interface';
import { EProductFromCode } from 'src/app/enums/product.enum';

@Injectable({
  providedIn: 'root'
})
export class TAchUniTransferPdfService {
  constructor(
    private util: UtilService,
    private utilWorkflow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService
  ) { }

  buildTransferPdf(pdfProperties: IAchUniDPdf) {
    const { dateTime, fileName, title, formValues, sourceAccount, targetAccount, bank, commission, reference } = pdfProperties ?? {};
    const attributes: IPrintData[] = [];
    const date = this.adfFormat.getFormatDateTime(pdfProperties.dateTime);

    const rootAccount = new PrintDataBuilder()
      .label('ach-uni:voucher-source-account-debit')
      .title(true)
      .build();
    attributes.push(rootAccount);

    const operationDate = new PrintDataBuilder()
      .label('ach-uni:voucher-date-operation')
      .value(this.adfFormat.getFormatDateTime(dateTime).numberFormat)
      .build();
    attributes.push(operationDate);

    const typeAccount = new PrintDataBuilder()
      .label('ach-uni:voucher-source-account-type')
      .value(this.util.getLabelProduct(Number(sourceAccount?.product ?? '00')).toUpperCase())
      .build();
    attributes.push(typeAccount);


    const accountDebitName = new PrintDataBuilder()
      .label('ach-uni:voucher-source-account-name')
      .value(sourceAccount?.name.toUpperCase())
      .build();
    attributes.push(accountDebitName);

    const accountDebitNumber = new PrintDataBuilder()
      .label('ach-uni:voucher-source-account-no')
      .value(sourceAccount?.account)
      .build();
    attributes.push(accountDebitNumber);

    const amountDebit = new PrintDataBuilder()
      .label('ach-uni:voucher-ammount')
      .value(`${'USD'} ${this.adfFormat.formatAmount(formValues?.amount ?? 0)}`)
      .build();
    attributes.push(amountDebit);

    const destinationAccount = new PrintDataBuilder()
      .label('ach-uni:voucher-target-account')
      .title(true)
      .build();
    attributes.push(destinationAccount);

    const codeProduct = Number(this.getCodeFromAccountType(targetAccount?.type));

    const attributeTypeAccountCredit = new PrintDataBuilder()
    .label('ach-uni:voucher-target-account-type')
    .value(`${this.util.getLabelProduct(codeProduct).toUpperCase()}`)
    .build();
    attributes.push(attributeTypeAccountCredit);

    const targetAccountName = new PrintDataBuilder()
      .label('ach-uni:voucher-target-account-name')
      .value(targetAccount?.name ?? targetAccount?.alias)
      .build();
    attributes.push(targetAccountName);

    const targetAccountNumber = new PrintDataBuilder()
      .label('ach-uni:voucher-target-account-no')
      .value(targetAccount?.account)
      .build();
    attributes.push(targetAccountNumber);

    const typeCreditAccount = new PrintDataBuilder()
      .label('ach-uni:voucher-bank')
      .value(bank?.description)
      .build();
    attributes.push(typeCreditAccount);

    const comission = new PrintDataBuilder()
      .label('ach-uni:voucher-commission')
      .value(`${'USD'} ${this.adfFormat.formatAmount(commission ?? 0)}`)
      .build();
    attributes.push(comission);

    if (formValues?.comment !== '') {
      const commentAttribute = new PrintDataBuilder()
        .label('ach-uni:voucher-comment')
        .value(formValues?.comment ?? '')
        .build();
      attributes.push(commentAttribute);
    }

    const amounCredit = new PrintDataBuilder()
      .label('ach-uni:voucher-ammount')
      .value(`${'USD'} ${this.adfFormat.formatAmount(formValues?.amount ?? 0)}`)
      .build();
    attributes.push(amounCredit);

    return new PrintBuilder()
      .items(attributes)
      .account({ ...targetAccount, ...sourceAccount, referenceNumber: reference, date })
      .referenceNumber(`${reference ?? 'undefined'}`)
      .fileName(fileName ?? 'undefined')
      .title(this.translate.instant(title ?? 'undefined'))
      .build();
  }

  getCodeFromAccountType(type: string | undefined): string | null {
    if (type === undefined) {
      return null;
    }
    const entries = Object.entries(EProductFromCode) as [string, string][];
    const entry = entries.find(([, value]) => value === type);
    return entry ? entry[0] : null;
  }
}
