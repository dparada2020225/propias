import { Injectable } from '@angular/core';
import { IPrintData, PrintBuilder, PrintDataBuilder } from '../../../../interface/print-data-interface';
import { IS365ModalVoucherParameters } from '../../interfaces/voucher-definition.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { AdfFormatService } from '@adf/components';
import { TranslateService } from '@ngx-translate/core';
import { S368dVoucherService } from './s368d-voucher.service';

@Injectable({
  providedIn: 'root'
})
export class S368dPdfService {

  constructor(
    private utils: UtilService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
    private voucherDefinition: S368dVoucherService,
  ) {
  }

  buildTransferPdf(parameters: IS365ModalVoucherParameters) {
    const {
      sourceAccountSelected,
      targetAccountSelected,
      transactionResponse,
      formValues,
      scheduleFormValues,
      reasonSelected,
      commission,
      totalValue,
    } = parameters;
    const { amount, comment } = formValues;
    const attributes: IPrintData[] = [];

    const dateFormatted = this.adfFormat.getFormatDateTime(transactionResponse.dateTime);
    const sourceAccountProductName = this.utils.getLabelProduct(sourceAccountSelected.product);
    const sourceProductAmount = this.utils.formatAmountWithCurrency(`${amount}`);

    const rootAccount = new PrintDataBuilder()
      .label('root-account')
      .title(true)
      .build();
    attributes.push(rootAccount);

    const attributeDateOperated = new PrintDataBuilder()
      .label('operation-date')
      .value(dateFormatted.fullFormat)
      .build();
    attributes.push(attributeDateOperated);

    const attributeSourceAccountProduct = new PrintDataBuilder()
      .label('account_credit_type')
      .value(sourceAccountProductName)
      .build();
    attributes.push(attributeSourceAccountProduct);

    const attributeSourceAccountName = new PrintDataBuilder()
      .label('accountName')
      .value(sourceAccountSelected.name)
      .build();
    attributes.push(attributeSourceAccountName);

    const attributeSourceAccount = new PrintDataBuilder()
      .label('account-number')
      .value(sourceAccountSelected.account)
      .build();
    attributes.push(attributeSourceAccount);

    const attributeAmount = new PrintDataBuilder()
      .label('amount')
      .value(`${sourceProductAmount}`)
      .build();
    attributes.push(attributeAmount);

    const attributeCommission = new PrintDataBuilder()
      .label('sp365:label_commission2')
      .value(`${sourceAccountSelected.currency} ${commission}`)
      .build();
    attributes.push(attributeCommission);

    const attributeTotalToDebit = new PrintDataBuilder()
      .label('sp365:total_to_debit2')
      .value(`${totalValue}`)
      .build();
    attributes.push(attributeTotalToDebit);

    const destinationAccount = new PrintDataBuilder()
      .label('destination-account')
      .title(true)
      .build();
    attributes.push(destinationAccount);

    const attributeAccountName = new PrintDataBuilder()
      .label('ach_name_account')
      .value(targetAccountSelected.name)
      .build();
    attributes.push(attributeAccountName);

    const attributeTargetAccount = new PrintDataBuilder()
      .label('account-number')
      .value(targetAccountSelected.account)
      .build();
    attributes.push(attributeTargetAccount);

    const attributeBankName = new PrintDataBuilder()
      .label('target-bank')
      .value(targetAccountSelected.bankName)
      .build();
    attributes.push(attributeBankName);

    const attributeReason = new PrintDataBuilder()
      .label('target-bank')
      .value(reasonSelected.description)
      .build();
    attributes.push(attributeReason);

    const attributeComment = new PrintDataBuilder()
      .label('comment')
      .value(comment)
      .build();
    attributes.push(attributeComment);

    if (formValues.isSchedule) {
      const date = this.voucherDefinition.parseScheduleDate(scheduleFormValues.date);

      const attributeTransactionSchedule = new PrintDataBuilder()
        .label('sp365:label_schedule_transaction')
        .value(date)
        .build();
      attributes.push(attributeTransactionSchedule);
    }


    return new PrintBuilder()
      .items(attributes)
      .account({ ...targetAccountSelected, ...sourceAccountSelected, referenceNumber: transactionResponse?.reference, date: dateFormatted.date })
      .referenceNumber(`${transactionResponse.reference}`)
      .fileName(`${this.translate.instant('sp365:pdf_fileName')}${Date.now()}`)
      .title(this.translate.instant('s365:label_home'))
      .build();
  }
}
