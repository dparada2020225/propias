import { Injectable } from '@angular/core';
import { AdfFormatService } from '@adf/components';
import { TranslateService } from '@ngx-translate/core';
import { IOTDVoucherPdf } from '../../../interfaces/own-transfer-definition.interface';
import { IPrint, IPrintData, PrintBuilder } from '../../../../../interface/print-data-interface';
import { IUserDataModalPdf } from '../../../../../../../models/util-work-flow.interface';
import { OtdTransferBasePdfService } from '../base/otd-transfer-base-pdf.service';
import { IAttributePdf } from 'src/app/models/build.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferBanpaisVoucherPdfService {

  constructor(
    private formatService: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private util: UtilService,
    private translateService: TranslateService,
    private base: OtdTransferBasePdfService
  ) { }

  buildOwnTransferPdf(voucherPdf: IOTDVoucherPdf): IPrint {
    const accountToDebited = voucherPdf?.accountToDebited;
    const accountToCredit = voucherPdf?.accountToCredit;
    const formValues = voucherPdf?.formValues;
    const date = voucherPdf?.date;
    const reference = voucherPdf?.reference;
    const title = voucherPdf?.title;
    const fileName = voucherPdf?.fileName;

    const amount = formValues?.amount;
    const comment = formValues?.comment;
    const attributes: IPrintData[] = [];

    const rootAccount: IAttributePdf = {
      label:'root-account',
      title:true,
      value: null!
    }

    attributes.push(this.base.builderAttributes(rootAccount));


    const operationDate: IAttributePdf = {
      label: 'operation-date',
      value: `${date?.numberFormat ?? ''}`
    }

    attributes.push(this.base.builderAttributes(operationDate));

    const typeAccount: IAttributePdf = {
      label: 'root-account-type',
      value: this.util.getLabelProduct(accountToDebited?.product)
    }

    attributes.push(this.base.builderAttributes(typeAccount));

    const userDataDebited: IUserDataModalPdf = {
      account: accountToDebited?.account,
      name: accountToDebited?.name
    };

    const userDebited = this.utilWorkFlow.getUserDataModalPdf(userDataDebited);

    const accountDebit: IAttributePdf = {
      label: 'account-debited',
      value: userDebited
    }

    attributes.push(this.base.builderAttributes(accountDebit));

    const amountDebit: IAttributePdf = {
      label: 'amount-debited',
      value: `${this.util.geCurrencSymbol(accountToDebited?.currency ?? '')}. ${this.formatService.formatAmount(amount ?? '')}`
    }

    attributes.push(this.base.builderAttributes(amountDebit));

    const destinationAccount: IAttributePdf = {
      label: 'destination-account',
      title: true,
      value: null!
    }

    attributes.push(this.base.builderAttributes(destinationAccount));

    const userDataCredit: IUserDataModalPdf = {
      account: accountToCredit?.account,
      name: accountToCredit?.name
    };

    const userCredit = this.utilWorkFlow.getUserDataModalPdf(userDataCredit);

    const accountCredit: IAttributePdf = {
      label: 'credited-account',
      value: userCredit
    }

    attributes.push(this.base.builderAttributes(accountCredit));

    const typeCreditAccount: IAttributePdf = {
      label:'root-account-type',
      value: this.util.getLabelProduct(accountToCredit?.product)
    }

    attributes.push(this.base.builderAttributes(typeCreditAccount));


    if (comment) {
      const commentAttributePdfBPProfile: IAttributePdf = {
        label: 'comment',
        value: `${comment ?? ''}`
      }

      attributes.push(this.base.builderAttributes(commentAttributePdfBPProfile));
    }

    return new PrintBuilder()
      .items(attributes)
      .account({ ...accountToCredit, ...accountToDebited, referenceNumber: reference, date })
      .referenceNumber(`${reference ?? ''}`)
      .fileName(this.translateService.instant(fileName ?? 'undefined'))
      .title(title)
      .build();
  }

}
