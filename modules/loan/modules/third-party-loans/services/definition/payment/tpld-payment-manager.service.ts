import { Injectable } from '@angular/core';
import { TpldPaymentFormService } from './tpld-payment-form.service';
import { TpldConfirmPaymentService } from './tpld-confirm-payment.service';
import { TpldPaymentDetailService } from './tpld-payment-detail.service';
import { IConsultDetailTPL } from '../../../interfaces/crud/crud-third-party-loans-interface';
import { TpldVoucherModalService } from './tpld-voucher-modal.service';
import { IVoucherPaymentTPL } from '../../../interfaces/payment-interface';
import { TpldVoucherPdfService } from './tpld-voucher-pdf.service';

@Injectable({
  providedIn: 'root'
})
export class TpldPaymentManagerService {

  constructor(
    private paymentFormDefinition: TpldPaymentFormService,
    private paymentConfirmDefinition: TpldConfirmPaymentService,
    private paymentDetailDefinition: TpldPaymentDetailService,
    private paymentVoucherModalDefinition: TpldVoucherModalService,
    private paymentVoucherPdfDefinition: TpldVoucherPdfService
  ) { }



  buildFormLayout() {
    return this.paymentFormDefinition.buildFormLayout();
  }

  buildPaymentConfirmScreenForm() {
    return this.paymentConfirmDefinition.builderConfirmPaymentLayout();
  }

  buildPaymentConfirmScreenReading(data: any, amountToDebit: string) {
    return this.paymentConfirmDefinition.builderLayoutConfirmation(data, amountToDebit);
  }

  buildPaymentDetailLayout(loanPaymentDetail: IConsultDetailTPL, identifier: string) {
    return this.paymentDetailDefinition.buildDetailPaymentDetail(loanPaymentDetail, identifier);
  }

  buildVoucherPaymentModal(dataVoucher: IVoucherPaymentTPL) {
    return this.paymentVoucherModalDefinition.builderLayoutVoucherModal(dataVoucher);
  }

  buildVoucherPaymentPDF(dataVoucher: IVoucherPaymentTPL) {
    return this.paymentVoucherPdfDefinition.buildOwnTransferPdf(dataVoucher);

  }


}
