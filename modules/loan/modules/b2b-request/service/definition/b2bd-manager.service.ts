import { Injectable } from '@angular/core';
import { B2bdPdfService } from './b2bd-pdf.service';
import { B2bdFormService } from './b2bd-form.service';
import { B2bdVoucherService } from './b2bd-voucher.service';
import { B2bRequestBuilder, IB2bRequest, IB2bRequestResponse } from '../../interfaces/b2b-request.interface';
import { B2bdModalService } from './b2bd-modal.service';
import { B2bdModalInterface } from '../../interfaces/b2bd-modal.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bdManagerService {

  constructor(
    private pdfLayoutService: B2bdPdfService,
    private formLayoutService: B2bdFormService,
    private voucherLayoutService: B2bdVoucherService,
    private modalLayoutService: B2bdModalService,
  ) { }

  buildPdfLayout(requestDetail: IB2bRequestResponse, currency: string) {
    return this.pdfLayoutService.buildPDfFile(requestDetail, currency);
  }

  buildVoucherLayout(requestDetail: IB2bRequestResponse, currency: string) {
    return this.voucherLayoutService.builderLayoutVoucher(requestDetail, currency);
  }

  buildFormLayout(currency: string) {
    return this.formLayoutService.builderFormLayout(currency);
  }

  buildModalLayout(startupParameters: B2bdModalInterface) {
    return this.modalLayoutService.builderModalLayout(startupParameters);
  }

  buildExecuteRequest(formValues: IB2bRequest) {
    return new B2bRequestBuilder()
      .amount(Number(formValues?.amount))
      .fixedTerm(formValues?.fixedTerm)
      .paymentMethod(formValues?.paymentMethod)
      .accountCharged(formValues?.accountCharged)
      .interestPaymentFrequency(formValues?.interestPaymentFrequency.trim())
      .capitalPaymentFrequency(formValues?.capitalPaymentFrequency.trim())
      .accountAccredit(formValues?.accountAccredit)
      .build();
  }
}
