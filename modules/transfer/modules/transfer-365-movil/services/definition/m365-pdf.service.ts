import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { AdfFormatService } from '@adf/components';
import { TranslateService } from '@ngx-translate/core';
import { IPrintData, PrintBuilder, PrintDataBuilder } from '../../../../interface/print-data-interface';
import { M365ModalLayoutParameters } from '../../interfaces/voucher.interface';
import { IFormValuesForEnteredOption } from '../../interfaces/form.interface';
import { Ttr365UtilsService } from '../../../../services/utils/ttr-365-utils.service';

@Injectable({
  providedIn: 'root'
})
export class M365PdfService {
  constructor(
    private util: UtilService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
    private util365: Ttr365UtilsService,
  ) { }

  buildTransferPdf(parameters: M365ModalLayoutParameters) {
    const {
      transactionResponse,
      formValues,
      beneficiarySelected,
      sourceAccountSelected,
      bankSettingSelected
    } = parameters ?? {};
    const { comment, amount, numberPhone } = formValues;
    const { nameBeneficiary } = formValues as IFormValuesForEnteredOption ?? {};

    const attributes: IPrintData[] = [];

    const dateFormatted = this.adfFormat.getFormatDateTime(transactionResponse?.dateTime ?? '');
    const { standardWithHour } = this.util365.getDateOperation(dateFormatted);
    const sourceAccountProduct = this.util.getLabelProduct(sourceAccountSelected.product).toUpperCase();

    const attributeM365PdfGroupSource = new PrintDataBuilder()
      .label('account-debited')
      .title(true)
      .build();
    attributes.push(attributeM365PdfGroupSource);

    const attributeM365PdfDateOperated = new PrintDataBuilder()
      .label('operation-date')
      .value(standardWithHour)
      .build();
    attributes.push(attributeM365PdfDateOperated);

    const attributeM365PdfSourceProductName = new PrintDataBuilder()
      .label('account_credit_type')
      .value(sourceAccountProduct)
      .build();
    attributes.push(attributeM365PdfSourceProductName);

    const attributeM365PdfSourceAccountName = new PrintDataBuilder()
      .label('accountName')
      .value(sourceAccountSelected.name)
      .build();
    attributes.push(attributeM365PdfSourceAccountName);

    const attributeM365PdfSourceAccountNumber = new PrintDataBuilder()
      .label('account-number')
      .value(sourceAccountSelected.account)
      .build();
    attributes.push(attributeM365PdfSourceAccountNumber);

    const attributeM365PdfAmount = new PrintDataBuilder()
      .label('amount')
      .value(`${sourceAccountSelected.currency} ${this.util.formatAmount(amount)}`)
      .build();
    attributes.push(attributeM365PdfAmount);

    const attributeM365PdfTargetGroup = new PrintDataBuilder()
      .label('credited-account')
      .title(true)
      .build();
    attributes.push(attributeM365PdfTargetGroup);

    const attributeM365PdfTargetProduct = new PrintDataBuilder()
      .label('account_credit_type')
      .value('02')
      .build();
    attributes.push(attributeM365PdfTargetProduct);

    const attributeM365PdfTargetAccountName = new PrintDataBuilder()
      .label('accountName')
      .value(beneficiarySelected?.name ?? nameBeneficiary ?? '')
      .build();
    attributes.push(attributeM365PdfTargetAccountName);

    const attributeM365PdfNumberPhone = new PrintDataBuilder()
      .label('m365:label_number_phone')
      .value(beneficiarySelected?.account ?? numberPhone ?? '')
      .build();
    attributes.push(attributeM365PdfNumberPhone);

    const attributeM365PdfBankName = new PrintDataBuilder()
      .label('ach:bisv:label_bank')
      .value(bankSettingSelected.description)
      .build();
    attributes.push(attributeM365PdfBankName);

    const attributeComment = new PrintDataBuilder()
      .label('comment')
      .value(comment)
      .build();
    attributes.push(attributeComment);

    const attributeM365PdfAmountTarget = new PrintDataBuilder()
      .label('amount')
      .value(`${sourceAccountSelected.currency} ${this.util.formatAmount(amount)}`)
      .build();
    attributes.push(attributeM365PdfAmountTarget);

    return new PrintBuilder()
      .items(attributes)
      .account({ ...beneficiarySelected, ...sourceAccountSelected, referenceNumber: transactionResponse?.reference ?? '', date: dateFormatted.date })
      .referenceNumber(`${transactionResponse?.reference ?? ''}`)
      .fileName(`${this.translate.instant('ach:bisv:file_name_pdf')}${Date.now()}`)
      .title(this.translate.instant('ach:bisv:label_365t_voucher_title'))
      .build();
  }
}
