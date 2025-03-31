import { Injectable } from '@angular/core';
import { AtdTransferFormService } from './atd-transfer-form.service';
import {
  IATDConfirm, IATDPdf, IATDVoucher,
  IATEFormStartupParameters, IATEModalLayout
} from '../../../interfaces/ach-transfer-definition.inteface';
import { IAccount } from '../../../../../../../models/account.inteface';
import { AtdTransferConfirmService } from './atd-transfer-confirm.service';
import { AtdTransferVoucherService } from './atd-transfer-voucher.service';
import { AtdTransferPdfService } from './atd-transfer-pdf.service';
import { AtdTransferModalService } from './atd-transfer-modal.service';
import { AtdFormModalService } from './atd-form-modal.service';
import { UtilWorkFlowService } from '../../../../../../../service/common/util-work-flow.service';

@Injectable({
  providedIn: 'root'
})
export class AtdTransferManagerService {

  constructor(
    private formDefinition: AtdTransferFormService,
    private confirmationDefinition: AtdTransferConfirmService,
    private voucherDefinition: AtdTransferVoucherService,
    private pdfDefinition: AtdTransferPdfService,
    private modalDefinition: AtdTransferModalService,
    private formModalDefinition: AtdFormModalService,
    private utilWorkFlow: UtilWorkFlowService,
  ) { }

  buildFormLayout(startupParameters: IATEFormStartupParameters) {
    return this.formDefinition.buildAchTransferLayout(startupParameters);
  }

  buildModalFormLayout() {
    return this.formModalDefinition.buildFormModal();
  }

  buildLayoutAttribute(account: IAccount) {
    return this.utilWorkFlow.buildAccountResumeAttributeForSelectAccounts(account);
  }

  buildVoucherConfirmation(confirmProps: IATDConfirm, isFavoriteWidget: boolean = true) {
    return this.confirmationDefinition.buildVoucherConfirmationLayout(confirmProps, isFavoriteWidget);
  }

  buildVoucherDefinition(properties: IATDVoucher) {
    return this.voucherDefinition.buildVoucherConfirmationLayout(properties);
  }

  buildPDfDefinition(pdfProperties: IATDPdf) {
    return this.pdfDefinition.buildTransferPdf(pdfProperties);
  }

  buildModalDefinition(properties: IATEModalLayout) {
    return this.modalDefinition.buildTransferModalLayout(properties);
  }
}
