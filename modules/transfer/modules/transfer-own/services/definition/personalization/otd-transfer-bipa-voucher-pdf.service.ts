import { AdfFormatService } from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IAttributePdf } from 'src/app/models/build.interface';
import { IUserDataModalPdf } from 'src/app/models/util-work-flow.interface';
import { IPrint, IPrintData, PrintBuilder } from 'src/app/modules/transfer/interface/print-data-interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IOTDVoucherPdf } from '../../../interfaces/own-transfer-definition.interface';
import { OtdTransferBasePdfService } from '../base/otd-transfer-base-pdf.service';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferBipaVoucherPdfService {

    constructor(
      private formatService: AdfFormatService,
      private utilWorkFlow: UtilWorkFlowService,
      private util: UtilService,
      private translateService: TranslateService,
      private basePdf: OtdTransferBasePdfService
    ) {}
  
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
        title: true,
        label: 'account-debited',
        value: null!,
      };
  
      attributes.push(this.basePdf.builderAttributes(rootAccount));
  
      const operationDate: IAttributePdf = {
        label: 'operation-date',
        value: `${date?.standard} ${date?.hour}`,
      };
  
      attributes.push(this.basePdf.builderAttributes(operationDate));
  
      const typeAccount: IAttributePdf = {
        label: 'root-account-type',
        value: this.util.getLabelProduct(accountToDebited?.product),
      };
  
      attributes.push(this.basePdf.builderAttributes(typeAccount));
  
      const userDataDebited: IUserDataModalPdf = {
        account: accountToDebited?.account,
        name: accountToDebited?.name,
      };
  
      const userDebited = this.utilWorkFlow.getUserDataModalPdf(userDataDebited);
  
      const accountDebit: IAttributePdf = {
        label: 'name_account_bp',
        value: userDebited,
      };
  
      attributes.push(this.basePdf.builderAttributes(accountDebit));
  
      const amountDebit: IAttributePdf = {
        label: 'amount',
        value: `${this.util.geCurrencSymbol(accountToDebited?.currency ?? '')}. ${this.formatService.formatAmount(amount ?? '')}`,
      };
  
      attributes.push(this.basePdf.builderAttributes(amountDebit));
  
      const destinationAccount: IAttributePdf = {
        label: 'account_credited',
        title: true,
        value: null!,
      };
  
      attributes.push(this.basePdf.builderAttributes(destinationAccount));
  
      const typeCreditAccount: IAttributePdf = {
        label: 'root-account-type',
        value: this.util.getLabelProduct(accountToCredit?.product),
      };
  
      attributes.push(this.basePdf.builderAttributes(typeCreditAccount));
  
      const userDataCredit: IUserDataModalPdf = {
        account: accountToCredit?.account,
        name: accountToCredit?.name,
      };
  
      const userCredit = this.utilWorkFlow.getUserDataModalPdf(userDataCredit);
  
      const accountCredit: IAttributePdf = {
        label: 'credited-account',
        value: userCredit,
      };
  
      attributes.push(this.basePdf.builderAttributes(accountCredit));
  
      if (comment) {
        const commentAttributePdvBISVProfile: IAttributePdf = {
          label: 'comment',
          value: comment ?? '',
        };
        attributes.push(this.basePdf.builderAttributes(commentAttributePdvBISVProfile));
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
