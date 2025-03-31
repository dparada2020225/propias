import { AdfFormatService } from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { IPrint, IPrintData, PrintBuilder } from '../../../../../../interface/print-data-interface';
import { IPdfLayout } from '../../../../interfaces/third-transfer.interface';
import { IAttributePdf } from 'src/app/models/build.interface';
import { TtdBaseTransferService } from '../base/ttd-base-transfer.service';

@Injectable({
  providedIn: 'root'
})
export class TtdTransferPdfService {

  constructor(
    private util: UtilService,
    private formatService: AdfFormatService,
    private translateService: TranslateService,
    private base: TtdBaseTransferService
  ) { }

  buildThirdTransferPdf(pdfProps: IPdfLayout): IPrint {
    const formValues = pdfProps?.formValues;
    const accountToCredit = pdfProps?.accountToCredit;
    const accountToDebited = pdfProps?.accountToDebited;
    const date = pdfProps?.date;
    const referenceNumber = pdfProps?.referenceNumber;
    const fileName = pdfProps?.fileName;
    const title = pdfProps?.title;

    const { amount, comment } = formValues;
    const attributes: IPrintData[] = [];

    const rootAccount: IAttributePdf = {
      label: 'root-account',
      title: true
    }

    const operationDate: IAttributePdf = {
      label: 'operation-date',
      value: `${date?.numberFormat} ${date?.hourSuffix}`
    }

    const typeAccount: IAttributePdf = {
      label: 'root-account-type',
      value: this.util.getLabelProduct(accountToDebited?.product)
    }

    const accountDebit: IAttributePdf = {
      label: 'account-debited',
      value: `${accountToDebited?.account} ${this.util.separatorValidation(accountToDebited?.account, accountToDebited?.name)} ${accountToDebited?.name}`
    }

    const amountDebit: IAttributePdf = {
      label: 'amount-debited',
      value: `${this.util.geCurrencSymbol(accountToDebited?.currency)}. ${this.formatService.formatAmount(amount)}`
    }

    const destinationAccount: IAttributePdf = {
      label: 'destination-account',
      title: true
    }

    const accountCredit: IAttributePdf = {
      label: 'credit_account',
      value: `${accountToCredit?.alias} ${this.util.separatorValidation(accountToCredit?.alias, accountToCredit?.account)} ${accountToCredit?.account}`
    }

    const typeCreditAccount: IAttributePdf = {
      label: 'root-account-type',
      value: this.util.getLabelProduct(accountToCredit?.type ? Number(accountToCredit?.type) : Number(accountToCredit?.product))
    }


    attributes.push(this.base.builderDataPdf(rootAccount));
    attributes.push(this.base.builderDataPdf(operationDate));
    attributes.push(this.base.builderDataPdf(typeAccount));
    attributes.push(this.base.builderDataPdf(accountDebit));
    attributes.push(this.base.builderDataPdf(amountDebit));
    attributes.push(this.base.builderDataPdf(destinationAccount));
    attributes.push(this.base.builderDataPdf(accountCredit));
    attributes.push(this.base.builderDataPdf(typeCreditAccount));

    if (comment) {
      const commentAttribute: IAttributePdf = {
        label: 'comment',
        value: comment
      }
      attributes.push(this.base.builderDataPdf(commentAttribute));
    }

    return new PrintBuilder()
      .items(attributes)
      .account({ ...accountToCredit, ...accountToDebited, referenceNumber, date })
      .referenceNumber(referenceNumber)
      .fileName(this.translateService.instant(fileName))
      .title(title)
      .build();
  }
}
