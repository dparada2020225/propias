import { Injectable } from '@angular/core';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { TAchUniTransferFormService } from './t-ach-uni-transfer-form.service';
import { TAchUniTransferConfirmService } from './t-ach-uni-transfer-confirm.service';
import { TAchUniTransferVoucherService } from './t-ach-uni-transfer-voucher.service';
import { TAchUniTransferPdfService } from './t-ach-uni-transfer-pdf.service';
import { TAchUniTransferModalService } from './t-ach-uni-transfer-modal.service';
import { AchUniFormStartupParameters, IAchUniDPdf, IAchUniDVoucher, IAchUniModalLayout } from '../../../interfaces/ach-uni-definition';
import { IAccount } from 'src/app/models/account.inteface';
import { DataLayoutSelectBuilder, IDataLayoutSelect } from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';
import { EProductFromCode } from 'src/app/enums/product.enum';
import { AchUniConfirmationData } from '../../../interfaces/ach-uni-confirmation-data';

@Injectable({
  providedIn: 'root'
})
export class TAchUniTransferManagerService {

  constructor(
    private formDefinition: TAchUniTransferFormService,
    private confirmationDefinition: TAchUniTransferConfirmService,
    private voucherDefinition: TAchUniTransferVoucherService,
    private pdfDefinition: TAchUniTransferPdfService,
    private modalDefinition: TAchUniTransferModalService,
    private utilWorkFlow: UtilWorkFlowService,
    private util: UtilService,
  ) { }

  buildFormLayout(startupParameters: AchUniFormStartupParameters) {
    return this.formDefinition.buildAchTransferLayout(startupParameters);
  }

  buildLayoutAttribute(account: IAccount) {
    return this.utilWorkFlow.buildAccountResumeAttributeForSelectAccounts(account);
  }

  buildLayoutAttributeDestinationAccount(account: IAccount) {
    return this.buildAccountResumeAttributeForSelectAccounts(account);
  }

  buildAccountResumeAttributeForSelectAccounts(account: IAccount): IDataLayoutSelect[] {
    const accountDebitSelectedOptions: IDataLayoutSelect[] = [];
    const codeProduct = Number(this.getCodeFromAccountType(account.type));

    const typeProductOption = new DataLayoutSelectBuilder()
      .label('ach-uni:transfer-target-account-type-form')
      .value(`${this.util.getLabelProduct(codeProduct)}`)
      .build();

  accountDebitSelectedOptions.push(typeProductOption);
    return accountDebitSelectedOptions;
  }

  getCodeFromAccountType(type: string | undefined): string | null {

    if (type === undefined) {
      return null;
    }
    const entries = Object.entries(EProductFromCode) as [string, string][];
    const entry = entries.find(([, value]) => value === type);
    return entry ? entry[0] : null;
  }

  buildVoucherConfirmation(confirmProps: AchUniConfirmationData) {
    return this.confirmationDefinition.buildVoucherConfirmationLayout(confirmProps);
  }

  buildVoucherDefinition(properties: IAchUniDVoucher) {
    return this.voucherDefinition.buildVoucherConfirmationLayout(properties);
  }

  buildPDfDefinition(pdfProperties: IAchUniDPdf) {
    return this.pdfDefinition.buildTransferPdf(pdfProperties);
  }

  buildModalDefinition(properties: IAchUniModalLayout) {
    return this.modalDefinition.buildTransferModalLayout(properties);
  }


  // buildVoucherDefinition(properties: IAchUniDVoucher) {
  //   return this.voucherDefinition.buildVoucherConfirmationLayout(properties);
  // }

  // buildPDfDefinition(pdfProperties: IATDPdf) {
  //   return this.pdfDefinition.buildTransferPdf(pdfProperties);
  // }

  // buildModalDefinition(properties: IATEModalLayout) {
  //   return this.modalDefinition.buildTransferModalLayout(properties);
  // }
}
