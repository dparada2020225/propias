import { Injectable } from '@angular/core';
import { B2bdPaymentConfirmationService } from './b2bd-payment-confirmation.service';
import { B2bdPaymentFormService } from './b2bd-payment-form.service';
import { B2bdPaymentModalService } from './b2bd-payment-modal.service';
import { B2bdPaymentPdfService } from './b2bd-payment-pdf.service';
import { B2bdPaymentTableService } from './b2bd-payment-table.service';
import { B2bdPaymentVoucherService } from './b2bd-payment-voucher.service';
import { IB2BDPaymentVoucherDefinitionParameters } from '../../interfaces/b2bd-payment-voucher.interface';
import { IB2BDPaymentConfirmationDefinitionParameters } from '../../interfaces/b2bd-payment-confirmation.interface';
import { IB2BDPaymentBuildFormParameters } from '../../interfaces/b2bd-payment-form.interface';
import { IPaymentAccount } from '../../interfaces/b2b-payment.interface';
import { IB2BDModalDefinitionParameters } from '../../interfaces/b2bd-payment-modal.interface';
import { IB2BDPdfDefinitionParameters } from '../../interfaces/b2bd-pdf.interface';
import { B2bdPaymentDefinitionService } from './b2bd-payment-definition.service';
import { IB2bPaymentParametersToExecuteTransaction } from '../../interfaces/b2b-payment-state.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bdPaymentManagerDefinitionService {

  constructor(
    private confirmationDefinition: B2bdPaymentConfirmationService,
    private formDefinition: B2bdPaymentFormService,
    private modalDefinition: B2bdPaymentModalService,
    private pdfDefinition: B2bdPaymentPdfService,
    private tableDefinition: B2bdPaymentTableService,
    private voucherDefinition: B2bdPaymentVoucherService,
    private paymentDefinition: B2bdPaymentDefinitionService,
  ) { }

  buildPdfLayout(pdfProps: IB2BDPdfDefinitionParameters) {
    return this.pdfDefinition.buildPDfFile(pdfProps);
  }

  buildModalLayout(modalLayoutProps: IB2BDModalDefinitionParameters) {
    return this.modalDefinition.builderModalLayout(modalLayoutProps);
  }

  buildTableLayout(accounts: IPaymentAccount[], currency: string) {
    return this.tableDefinition.tableLayout(accounts, currency);
  }

  buildFormLayout(transferLayoutProps: IB2BDPaymentBuildFormParameters) {
    return this.formDefinition.buildFormLayout(transferLayoutProps);
  }

  buildConfirmationLayout(sampleVoucherProps: IB2BDPaymentConfirmationDefinitionParameters) {
    return this.confirmationDefinition.builderConfirmationLayout(sampleVoucherProps);
  }

  buildVoucherLayout(confirmationVoucherProps: IB2BDPaymentVoucherDefinitionParameters) {
    return this.voucherDefinition.builderVoucherLayout(confirmationVoucherProps);
  }

  buildDataToExecuteTransaction(values: IB2bPaymentParametersToExecuteTransaction) {
    return this.paymentDefinition.buildPaymentExecutionData(values);
  }
}

