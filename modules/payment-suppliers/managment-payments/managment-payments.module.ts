import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagmentPaymentsRoutingModule } from './managment-payments-routing.module';
import { PsHomeComponent } from './components/ps-home/ps-home.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdfComponentsModule } from '@adf/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransferModule } from '../../transfer/transfer.module';
import { PsBatchManagerComponent } from './components/load/ps-batch-manager/ps-batch-manager.component';
import { AdfPSRadioButtonComponent } from './components/adf-radio-button/adf-radio-button.component';
import { PsFileManagerComponent } from './components/load/ps-file-manager/ps-file-manager.component';
import { PsPaymentConfirmationComponent } from './components/load/ps-payment-confirmation/ps-payment-confirmation.component';
import { PsFileVoucherComponent } from './components/load/ps-file-voucher/ps-file-voucher.component';
import { PsManualManagerComponent } from './components/load/ps-manual-manager/ps-manual-manager.component';
import { PsmTableComponent } from './components/load/psm-table/psm-table.component';
import { PsManualConfirmationComponent } from './components/load/ps-manual-confirmation/ps-manual-confirmation.component';
import { PsManualVoucherComponent } from './components/load/ps-manual-voucher/ps-manual-voucher.component';
import { PsPaymentManagerComponent } from './components/payment/ps-payment-manager/ps-payment-manager.component';
import { PsPaymentVoucherComponent } from './components/payment/ps-payment-voucher/ps-payment-voucher.component';
import { FooterPayLoteComponent } from './components/payment/footer-pay-lote/footer-pay-lote.component';
import { PSProofModalComponent } from './components/payment/ps-proof-modal/ps-proof-modal.component';
import { SpStVoucherComponent } from './components/payment/sp-st-voucher/sp-st-voucher.component';


@NgModule({
  declarations: [
    PsHomeComponent,
    PsBatchManagerComponent,
    AdfPSRadioButtonComponent,
    PsFileManagerComponent,
    PsPaymentConfirmationComponent,
    PsFileVoucherComponent,
    PsManualManagerComponent,
    PsmTableComponent,
    PsManualConfirmationComponent,
    PsManualVoucherComponent,
    PsPaymentManagerComponent,
    PsPaymentVoucherComponent,
    FooterPayLoteComponent,
    PSProofModalComponent,
    SpStVoucherComponent
  ],
  imports: [
    CommonModule,
    ManagmentPaymentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
    TransferModule,
    NgxDropzoneModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ManagmentPaymentsModule { }
