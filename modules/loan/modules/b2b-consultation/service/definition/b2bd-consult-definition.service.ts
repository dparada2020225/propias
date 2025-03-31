import { AdfFormatService } from '@adf/components';
import { Injectable } from '@angular/core';
import { IConsultPrintData, IPrintData } from 'src/app/modules/transfer/interface/print-data-interface';
import { UtilService } from 'src/app/service/common/util.service';
import { IB2bConsultationDetail } from '../../interfaces/b2b-consultation.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bdConsultDefinitionService {

  constructor(
    private adfFormatService: AdfFormatService,
    private utilService: UtilService,
  ) { }

  capitalize(value: string) {
    if (!value) {
      return 'undefined'
    }

    return `${value[0].toUpperCase()}${value.substring(1).toLowerCase()}`;
  }

  buildPDfFile(accountB2B: IB2bConsultationDetail, currency: string) {
    const pdfAttributes: IConsultPrintData[] = [];

    const attributeMainTitle: IConsultPrintData = {
      label: 'information-general',
      title: true,
      value: '',
      secondColumn: false,
    };

    pdfAttributes.push(attributeMainTitle);

    const attributeName: IConsultPrintData = {
      label: 'b2b-name',
      title: false,
      value: `${accountB2B?.name}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeName);

    const attributeB2BNumber: IConsultPrintData = {
      label: 'b2b-number',
      title: false,
      value: `${accountB2B?.b2bID}`,
      secondColumn: false,

    };
    pdfAttributes.push(attributeB2BNumber);

    const attributeLine: IPrintData = {
      label: '',
      title: true,
      value: '',
      secondColumn: false,
    };
    pdfAttributes.push(attributeLine);

    const attributeProduct: IConsultPrintData = {
      label: 'product',
      title: false,
      value: (`${accountB2B?.product}`).toUpperCase(),
      secondColumn: false,
    };
    pdfAttributes.push(attributeProduct);

    const attributeStatus: IConsultPrintData = {
      label: 'status_type',
      title: false,
      value: this.capitalize(accountB2B?.status),
      secondColumn: false,
    };
    pdfAttributes.push(attributeStatus);


    const attributeSubstate: IConsultPrintData = {
      label: 'substate',
      title: false,
      value: this.capitalize(accountB2B?.subStatus),
      secondColumn: true,
    };
    pdfAttributes.push(attributeSubstate);

    const attributeCurrency: IConsultPrintData = {
      label: 'b2b-currency',
      title: false,
      value: this.utilService.getLabelCurrency(`${currency}`),
      secondColumn: false,
    };
    pdfAttributes.push(attributeCurrency);

    const attributeAmountAwareded: IConsultPrintData = {
      label: 'amount-awarded',
      title: false,
      value: `${currency} ${this.adfFormatService.formatAmount(Number(accountB2B?.amountGranted))}`,
      secondColumn: true,
    };
    pdfAttributes.push(attributeAmountAwareded);


    const attributeTerm: IConsultPrintData = {
      label: 'term',
      title: false,
      value: (`${accountB2B?.term}`).toLowerCase(),
      secondColumn: false,
    };
    pdfAttributes.push(attributeTerm);

    const attributeNominalRate: IConsultPrintData = {
      label: 'nominal-rate',
      title: false,
      value: `${this.utilService.parsePercent(String(accountB2B?.nominalRate))}`,
      secondColumn: true,
    };
    pdfAttributes.push(attributeNominalRate);

    const attributeWarranty: IConsultPrintData = {
      label: 'warranty',
      title: false,
      value: `${accountB2B?.warranty}`,
      secondColumn: false,
      delimiter: '50'
    };
    pdfAttributes.push(attributeWarranty);


    const attributeRateEffective: IConsultPrintData = {
      label: 'rate-effective',
      title: false,
      value: ` ${this.utilService.parsePercent(String(accountB2B?.effectiveRate))}`,
      secondColumn: true,
    };
    pdfAttributes.push(attributeRateEffective);

    const attributeConcession: IConsultPrintData = {
      label: 'concession',
      title: false,
      value: `${this.adfFormatService.getFormatDateTime(accountB2B?.concession).standard}`,
      secondColumn: false,
      customBottom: 10
    };
    pdfAttributes.push(attributeConcession);

    const attributePaymentDate: IConsultPrintData = {
      label: 'next-payment-date',
      title: false,
      value: ` ${this.adfFormatService.getFormatDateTime(accountB2B?.nextPaymentDate).standard}`,
      secondColumn: true,
      customBottom: 5
    };
    pdfAttributes.push(attributePaymentDate);

    const attributeExpiration: IConsultPrintData = {
      label: 'expiration',
      title: false,
      value: `${this.adfFormatService.getFormatDateTime(accountB2B?.dueDate).standard}`,
      secondColumn: false,
    };
    pdfAttributes.push(attributeExpiration);


    const attributeSecondTitle: IConsultPrintData = {
      label: 'balance-information',
      title: true,
      value: '',
      secondColumn: false,
    };
    pdfAttributes.push(attributeSecondTitle);

    const attributeCapitalToDate: IConsultPrintData = {
      label: 'capitalToDate',
      title: false,
      value: `${currency} ${this.adfFormatService.formatAmount(Number(accountB2B?.balance.capitalToDate))}`,
      secondColumn: false,
    };
    pdfAttributes.push(attributeCapitalToDate);

    const attributeValueNextInstallment: IConsultPrintData = {
      label: 'nextInstallmentValue',
      title: false,
      value: `${currency} ${this.adfFormatService.formatAmount(Number(accountB2B?.balance.nexInstallmentValue))}`,
      secondColumn: true,
    };
    pdfAttributes.push(attributeValueNextInstallment);

    const attributeInsterest: IConsultPrintData = {
      label: 'interest',
      title: false,
      value: `${currency} ${this.adfFormatService.formatAmount(Number(accountB2B?.balance.interest))}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeInsterest);

    const attributeMarginToRotate: IConsultPrintData = {
      label: 'marginTurning',
      title: false,
      value: `${currency} ${this.adfFormatService.formatAmount(Number(accountB2B?.balance.marginTurning))}`,
      secondColumn: true,
    };
    pdfAttributes.push(attributeMarginToRotate);

    const attributeAdditionalCharges: IConsultPrintData = {
      label: 'additionalCharger',
      title: false,
      value: `${currency} ${this.adfFormatService.formatAmount(Number(accountB2B?.balance.additionalCharger))}`,
      secondColumn: false,
    };
    pdfAttributes.push(attributeAdditionalCharges);

    const attributeTotalCancellationBalance: IConsultPrintData = {
      label: 'totalCancellationBalance',
      title: false,
      value: `${currency} ${this.adfFormatService.formatAmount(Number(accountB2B?.balance.totalCancellationBalance))}`,
      secondColumn: true,
    };
    pdfAttributes.push(attributeTotalCancellationBalance);

    const attributeSurcharge: IConsultPrintData = {
      label: 'surcharge',
      title: false,
      value: `${currency} ${this.adfFormatService.formatAmount(Number(accountB2B?.balance.delinquentBalance ?? 0))}`,
      secondColumn: false,
    };
    pdfAttributes.push(attributeSurcharge);

    const attributeTotalBalance: IConsultPrintData = {
      label: 'totalBalance',
      title: false,
      value: `${currency} ${this.adfFormatService.formatAmount(Number(accountB2B?.balance.totalBalance ?? 0))}`,
      secondColumn: false,
    };
    pdfAttributes.push(attributeTotalBalance);

    return [...pdfAttributes];
  }
}
