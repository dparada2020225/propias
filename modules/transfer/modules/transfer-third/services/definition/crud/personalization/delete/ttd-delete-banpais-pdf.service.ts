import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { IPrintData, PrintBuilder } from '../../../../../../../interface/print-data-interface';
import { IThirdTransferPdf } from '../../../../../interfaces/third-crud.interface';
import { IAttributePdf } from 'src/app/models/build.interface';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class TTDDeletePdfService {

  constructor(
    private util: UtilService,
    private base: TtdBaseCrudService
  ) { }

  buildDeletePDF(pdfProperties: IThirdTransferPdf) {

    const title = pdfProperties?.title;
    const account = pdfProperties?.account;
    const fileName = pdfProperties?.fileName;
    const referenceNumber = pdfProperties?.referenceNumber;

    const attributes: IPrintData[] = [];

    const numberAccount: IAttributePdf = {
      label: 'no_account',
      title: true,
      value: account?.account,
    };

    const alias: IAttributePdf = {
      label: 'alias',
      value: account?.alias,
    };

    const typeAccount: IAttributePdf = {
      label: 'root-account-type',
      value: `${this.util.getLabelProduct(account?.product ?? 0)}`,
    };

    const emailAttribute: IAttributePdf = {
      label: 'email',
      value: `${account?.email}`,
    };

    const currency: IAttributePdf = {
      label: 'ach-currency',
      value: this.util.getLabelCurrency(account?.currency),
    };

    const name: IAttributePdf = {
      label: 'name',
      value: account?.name
    };

    attributes.push(this.base.builderPdfAttributes(numberAccount));
    attributes.push(this.base.builderPdfAttributes(alias));
    attributes.push(this.base.builderPdfAttributes(typeAccount));
    attributes.push(this.base.builderPdfAttributes(emailAttribute));
    attributes.push(this.base.builderPdfAttributes(currency));
    attributes.push(this.base.builderPdfAttributes(name));

    return new PrintBuilder()
      .items(attributes)
      .account({ ...account, referenceNumber })
      .referenceNumber(referenceNumber)
      .fileName(fileName)
      .title(title)
      .build();
  }
}
