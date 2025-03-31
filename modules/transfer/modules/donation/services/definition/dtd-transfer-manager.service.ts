import { IConfirmationModal, IDataLayoutSelect, IDataReading, ILayout } from '@adf/components';
import { Injectable } from '@angular/core';
import { IDonationDataExecute, IDTDConfirmationRequest, IDTDFormRequest, IDTDModal, IDTDPdf, IDTDVoucherSample } from '../../interfaces/donation-definition.interface';
import { IPrint } from '../../../../interface/print-data-interface';
import { DtdTransferConfirmService } from './dtd-transfer-confirm.service';
import { DtdTransferFormService } from './dtd-transfer-form.service';
import { DtdTransferPdfService } from './dtd-transfer-pdf.service';
import { DtdTransferVoucherModalService } from './dtd-transfer-voucher-modal.service';
import { DtdTransferVoucherService } from './dtd-transfer-voucher.service';
import { IAccount } from '../../../../../../models/account.inteface';
import { IDonationAccount } from '../../interfaces/donation-account.interface';
import { IDonationExecute } from '../../interfaces/donation-execute.interface';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';

@Injectable({
  providedIn: 'root'
})
export class DtdTransferManagerService {

  constructor(
    private transferForm: DtdTransferFormService,
    private transferConfirm: DtdTransferConfirmService,
    private transferVoucher: DtdTransferVoucherService,
    private transferVoucherModal: DtdTransferVoucherModalService,
    private transferPdf: DtdTransferPdfService,
    private utilWorkFlow: UtilWorkFlowService,
  ) { }

  builderDonationLayoutStep1(form: IDTDFormRequest): ILayout {
    return this.transferForm.builderDonationLayout(form);
  }

  buildDebitedAccountSelectAttributesStep1(account: IAccount): IDataLayoutSelect[] {
    return this.utilWorkFlow.buildAccountResumeAttributeForSelectAccounts(account);
  }

  buildFundationAccountSelectAttributesStep1(account: IDonationAccount): IDataLayoutSelect[] {
    return this.transferForm.buildLayoutSelectFundationAccount(account);
  }

  builderLayoutVoucherStep2(voucher: IDTDVoucherSample, isSignatureTrackingUpdate?: boolean): IDataReading {
    return this.transferVoucher.builderLayoutVoucher(voucher, isSignatureTrackingUpdate);
  }

  buildAccountToExecuteDonationStep3(properties: IDonationDataExecute): IDonationExecute {
    return this.transferVoucher.buildAccountToExecuteDonation(properties);
  }

  builderLayoutConfirmationStep3(voucher: IDTDConfirmationRequest): IDataReading {
    return this.transferConfirm.builderLayoutConfirmation(voucher);
  }

  builderLayoutVoucherModalStep4(voucherModal: IDTDModal): IConfirmationModal {
    return this.transferVoucherModal.builderLayoutVoucherModal(voucherModal);
  }

  buildDonationTransferPdfStep5(voucherPdf: IDTDPdf): IPrint {
    return this.transferPdf.buildDonationTransferPdf(voucherPdf);
  }
}
