import { Injectable } from '@angular/core';
import { IPrintData, PrintBuilder, PrintDataBuilder } from '../../../../interface/print-data-interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { AdfFormatService } from '@adf/components';
import { TranslateService } from '@ngx-translate/core';
import { I365ModalLayoutParameters } from '../../interfaces/voucher-definition.interface';
import { Product } from '../../../../../../enums/product.enum';
import { Ttr365UtilsService } from '../../../../services/utils/ttr-365-utils.service';

@Injectable({
  providedIn: 'root'
})
export class T365dPdfService {

  constructor(
    private util: UtilService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
    private util365: Ttr365UtilsService,
  ) { }

  buildTransferPdf(parameters: I365ModalLayoutParameters) {
    const {
      transactionResponse,
      formValues,
      targetAccountSelected,
      sourceAccountSelected,
      bankSelected
    } = parameters ?? {};
    const { comment, amount} = formValues;
    const attributes: IPrintData[] = [];



    const dateFormatted = this.adfFormat.getFormatDateTime(transactionResponse?.dateTime ?? '');
    const { standardWithHour } = this.util365.getDateOperation(dateFormatted);

    const sourceAccountProduct = this.util.getLabelProduct(sourceAccountSelected.product).toUpperCase();
    const targetAccountProduct = this.util.getLabelProduct(Number(Product[targetAccountSelected.type])).toUpperCase();

    const rootAccount = new PrintDataBuilder()
      .label('account-debited')
      .title(true)
      .build();
    attributes.push(rootAccount);

    const attributeDateOperated = new PrintDataBuilder()
      .label('operation-date')
      .value(standardWithHour)
      .build();
    attributes.push(attributeDateOperated);

    const attributeSourceAccountProduct = new PrintDataBuilder()
      .label('account_credit_type')
      .value(sourceAccountProduct)
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
      .value(`${sourceAccountSelected.currency} ${this.util.formatAmount(amount)}`)
      .build();
    attributes.push(attributeAmount);

    const destinationAccount = new PrintDataBuilder()
      .label('ach-uni:label-account-target')
      .title(true)
      .build();
    attributes.push(destinationAccount);

    const attributeTargetProductName = new PrintDataBuilder()
      .label('account_credit_type')
      .value(targetAccountProduct)
      .build();
    attributes.push(attributeTargetProductName);

    const attributeAccountName = new PrintDataBuilder()
      .label('accountName')
      .value(targetAccountSelected.name)
      .build();
    attributes.push(attributeAccountName);

    const attributeTargetAccount = new PrintDataBuilder()
      .label('account-number')
      .value(targetAccountSelected.account)
      .build();
    attributes.push(attributeTargetAccount);

    const attributeBankName = new PrintDataBuilder()
      .label('ach:bisv:label_bank')
      .value(bankSelected.description)
      .build();
    attributes.push(attributeBankName);

    const attributeComment = new PrintDataBuilder()
      .label('comment')
      .value(comment)
      .build();
    attributes.push(attributeComment);

    return new PrintBuilder()
      .items(attributes)
      .account({ ...targetAccountSelected, ...sourceAccountSelected, referenceNumber: transactionResponse?.reference ?? '', date: dateFormatted.date })
      .referenceNumber(`${transactionResponse?.reference ?? ''}`)
      .fileName(`${this.translate.instant('ach:bisv:file_name_pdf')}${Date.now()}`)
      .title(this.translate.instant('ach:bisv:label_365t_voucher_title'))
      .build();
  }
}
