import { Injectable } from '@angular/core';
import { IPrintData, IPrintedData } from '../../../../../transfer/interface/print-data-interface';
import { IB2bRequestResponse } from '../../interfaces/b2b-request.interface';
import { AdfFormatService } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class B2bdPdfService {

  constructor(
    private formatService: AdfFormatService,
    private utils: UtilService,
  ) { }

  buildPDfFile(requestDetail: IB2bRequestResponse, currency: string): IPrintedData {
    const pdfAttributes: IPrintData[] = [];

    const attributeMainTitle: IPrintData = {
      label: 'information-general',
      title: true,
      value: '',
      secondColumn: false,
    };

    pdfAttributes.push(attributeMainTitle);

    const attributeB2BNumber: IPrintData = {
      label: 'b2b-number',
      title: false,
      value: `${requestDetail?.b2bID ?? 'undefined'}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeB2BNumber);

    const attributeExpensiveValue: IPrintData = {
      label: 'expense-value',
      title: false,
      value: `${currency ?? 'undefined'} ${this.formatService.formatAmount(
        +requestDetail.expensesValue ?? 0
      )}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeExpensiveValue);

    const attributeRate: IPrintData = {
      label: 'rate',
      title: false,
      value: `${this.utils.parsePercent(String(requestDetail.rate))}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeRate);

    const attributeNextPaymentDate: IPrintData = {
      label: 'next-payment-date',
      title: false,
      value: `${this.formatService.getFormatDateTime(requestDetail.nextPaymentDate).date ?? 'undefined'}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeNextPaymentDate);

    const attributeAmountPayable: IPrintData = {
      label: 'amount-payable',
      title: false,
      value: `${currency ?? 'undefined'} ${this.formatService.formatAmount(
        +requestDetail.paymentAmount ?? 0
      )}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeAmountPayable);

    const attributeAmountDisbursed: IPrintData = {
      label: 'amount-disbursed',
      title: false,
      value: `${currency ?? 'undefined'} ${this.formatService.formatAmount(
        +requestDetail.amount ?? 0
      )}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeAmountDisbursed);

    const attributeCommission: IPrintData = {
      label: 'commission',
      title: false,
      value: `${currency ?? 'undefined'} ${this.formatService.formatAmount(
        +requestDetail.commission ?? 0
      )}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeCommission);

    const attributeDueDate: IPrintData = {
      label: 'due-date',
      title: false,
      value: `${this.formatService.getFormatDateTime(requestDetail.dueDate).date ?? 'undefined'}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeDueDate);

    const attributeInterestFrequency: IPrintData = {
      label: 'interest-frequency',
      title: false,
      value: `${requestDetail?.interestPaymentFrequency ?? 'undefined'}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeInterestFrequency);

    const attributeCapitalFrequency: IPrintData = {
      label: 'capital-frequency',
      title: false,
      value: `${requestDetail?.capitalPaymentFrequency ?? 'undefined'}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeCapitalFrequency);

    return {
      data: [...pdfAttributes],
      reference: +requestDetail?.reference ?? 'undefined',
    };
  }
}
