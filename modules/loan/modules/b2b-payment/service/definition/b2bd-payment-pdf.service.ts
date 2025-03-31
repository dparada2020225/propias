import { Injectable } from '@angular/core';
import { IConsultPrintData, IPrintData, IPrintedData } from '../../../../../transfer/interface/print-data-interface';
import { AdfFormatService } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';
import { IB2BDPdfDefinitionParameters } from '../../interfaces/b2bd-pdf.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bdPaymentPdfService {

  constructor(
    private formatService: AdfFormatService,
    private utils: UtilService,
  ) { }

  buildPDfFile(pdfProps: IB2BDPdfDefinitionParameters): IPrintedData {
    const { paymentDetail, sourceAccount, currency, b2bDetail } = pdfProps ?? {}
    const { capital, interest, feciOther, amount, delinquentBalance } = paymentDetail.payment ?? {}

    const pdfAttributes: IPrintData[] = [];

    const attributeMainTitle: IPrintData = {
      label: 'general_information',
      title: true,
      value: '',
      secondColumn: false,
    };

    pdfAttributes.push(attributeMainTitle);

    const attributeBackToBack: IPrintData = {
      label: 'b2b-request-title',
      title: false,
      value: `${currency} ${paymentDetail?.account} / ${b2bDetail?.name}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeBackToBack);

    const attributeAccountDebited: IPrintData = {
      label: 'account_to_be_debited',
      title: false,
      value: `${this.utils.getLabelProduct(Number(sourceAccount?.product))} - ${currency} ${sourceAccount?.account} / ${sourceAccount?.name}`.toUpperCase(),
      secondColumn: false,
    };

    pdfAttributes.push(attributeAccountDebited);

    const attributeVoucher: IPrintData = {
      label: 'voucher',
      title: false,
      value: paymentDetail?.receipt,
      secondColumn: false,
    };

    pdfAttributes.push(attributeVoucher);

    const attributeSecondTitle: IPrintData = {
      label: 'payment_information',
      title: true,
      value: '',
      secondColumn: false,
    };

    pdfAttributes.push(attributeSecondTitle);

    const attributeCapital: IPrintData = {
      label: 'capital',
      title: false,
      value: `${currency}     ${this.formatService.formatAmount(Number(capital))}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeCapital);

    const attributeInterest: IPrintData = {
      label: 'interest',
      title: false,
      value: `${currency}     ${this.formatService.formatAmount(Number(interest))}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributeInterest);

    const attributeFCEI: IConsultPrintData = {
      label: 'fci',
      title: false,
      value: `${currency}     ${this.formatService.formatAmount(Number(feciOther))}`,
      secondColumn: false,
      maxWidth: 75,
    };

    pdfAttributes.push(attributeFCEI);

    const attributeSurcharge: IConsultPrintData = {
      label: 'surcharge',
      title: false,
      value: `${currency}     ${this.formatService.formatAmount(Number(delinquentBalance))}`,
      secondColumn: false,
      customBottom: 2,
    };

    pdfAttributes.push(attributeSurcharge);

    const attributePayment: IPrintData = {
      label: 'balance_paid',
      title: false,
      value: `${currency}     ${this.formatService.formatAmount(Number(amount))}`,
      secondColumn: false,
    };

    pdfAttributes.push(attributePayment);

    return {
      data: [...pdfAttributes],
      reference: +paymentDetail?.reference ?? 'undefined',
    };
  }
}
