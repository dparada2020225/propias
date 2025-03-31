import { AdfFormatService, AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../../service/common/util.service';
import { IConsultDetailTPL } from '../../../interfaces/crud/crud-third-party-loans-interface';

@Injectable({
  providedIn: 'root'
})
export class TpldPaymentDetailService {

  constructor(
    private util: UtilService,
    private formatService: AdfFormatService,
  ) { }

  buildDetailPaymentDetail(loanPaymentDetail: IConsultDetailTPL, identifier: string) {
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-list',
      attributes: []
    };


    const attributeNumberLoan = new AttributeReadingBuilder()
      .label('no_loans')
      .values([identifier ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeNumberLoan);

    const attributeNameOfLoan = new AttributeReadingBuilder()
      .label('name_loans')
      .values([loanPaymentDetail?.loanName ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeNameOfLoan);

    const attributeTypeLoan = new AttributeReadingBuilder()
      .label('type_of_loan')
      .class('disabled-label')
      .values([loanPaymentDetail?.type ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeTypeLoan);

    const attributeState = new AttributeReadingBuilder()
      .label('state')
      .class('disabled-label')
      .values([loanPaymentDetail?.status ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeState);


    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency_loans')
      .values([loanPaymentDetail?.currency ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeCurrency);

    const dateTime = this.formatService.getFormatDateTime(loanPaymentDetail?.feeDate ?? 'UNDEFINED')
    const attributeDatePayment = new AttributeReadingBuilder()
      .label('date_paymentTPL')
      .values([dateTime?.standard ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeDatePayment);

    const valueTotalPayment = this.util.parseAmountStringToNumber(loanPaymentDetail?.totalPayment ?? '');

    const attributeTotalPayment = new AttributeReadingBuilder()
      .label('total_to_pay')
      .values([`${this.util.getCurrencySymbolToIso(loanPaymentDetail?.currencyCode ?? 'UNDEFINED')} ${this.formatService.formatAmount(valueTotalPayment ?? '')}`])
      .build();
    groupGrid.attributes.push(attributeTotalPayment);


    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
