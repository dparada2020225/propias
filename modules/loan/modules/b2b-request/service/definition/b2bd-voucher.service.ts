import { Injectable } from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import { IB2bRequestResponse } from '../../interfaces/b2b-request.interface';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class B2bdVoucherService {

  constructor(
    private formatService: AdfFormatService,
    private utils: UtilService,
  ) { }

  builderLayoutVoucher(requestDetail: IB2bRequestResponse, currency: string): IDataReading {
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeB2BNumber = new AttributeReadingBuilder()
      .label('b2b-no')
      .values([requestDetail?.b2bID ?? 'undefined'])
      .build();

    groupGrid.attributes.push(attributeB2BNumber);

    const attributeAmountDisbursed = new AttributeReadingBuilder()
      .label('amount-disbursed')
      .class('amount')
      .values([
        `${currency ?? undefined}`,
        `${this.formatService.formatAmount(+requestDetail?.amount ?? 0)}`,
      ])
      .build();

    groupGrid.attributes.push(attributeAmountDisbursed);

    const attributesExpenseValue = new AttributeReadingBuilder()
      .label('expense-value')
      .class('amount')
      .values([
        currency ?? 'undefined',
        `${this.formatService.formatAmount(+requestDetail?.expensesValue ?? 0)}`,
      ])
      .build();

    groupGrid.attributes.push(attributesExpenseValue);

    const attributeCommission = new AttributeReadingBuilder()
      .label('commission')
      .class('amount')
      .values([
        currency ?? 'undefined',
        `${this.formatService.formatAmount(+requestDetail?.commission ?? 0)}`,
      ])
      .build();

    groupGrid.attributes.push(attributeCommission);

    const attributesRate = new AttributeReadingBuilder()
      .label('rate')
      .values([`${this.utils.parsePercent(String(requestDetail?.rate))}`])
      .build();

    groupGrid.attributes.push(attributesRate);

    const attributeInterestFrequency = new AttributeReadingBuilder()
      .label('interest-frequency')
      .values([requestDetail?.interestPaymentFrequency ?? 'undefined'])
      .class('reading-text-uppercase')
      .build();

    groupGrid.attributes.push(attributeInterestFrequency);


    const attributesNextPaymentDate = new AttributeReadingBuilder()
      .label('next-payment-date')
      .values([this.formatService.getFormatDateTime(requestDetail?.nextPaymentDate).date])
      .build();

    groupGrid.attributes.push(attributesNextPaymentDate);


    const attributeCapitalFrequency = new AttributeReadingBuilder()
      .label('capital-frequency')
      .class('reading-text-uppercase')
      .values([requestDetail?.capitalPaymentFrequency ?? 'undefined'])
      .build();

    groupGrid.attributes.push(attributeCapitalFrequency);

    const attributeAmountPayable = new AttributeReadingBuilder()
      .label('amount-payable')
      .class('amount')
      .values([
        currency ?? 'undefined',
        `${this.formatService.formatAmount(+requestDetail?.paymentAmount ?? 0)}`,
      ])
      .build();

    groupGrid.attributes.push(attributeAmountPayable);

    const attributeDueDate = new AttributeReadingBuilder()
      .label('due-date')
      .values([this.formatService.getFormatDateTime(requestDetail?.dueDate).date])
      .build();

    groupGrid.attributes.push(attributeDueDate);
    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('b2b-request-title')
      .subtitle('disbursement-confirmation')
      .class('padding-side')
      .groupList(groupList)
      .build();

  }
}
