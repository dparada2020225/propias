import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MangerPayrollRoutingModule } from './manger-payroll-routing.module';
import { PmpHomeComponent } from './components/pmp-home/pmp-home.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AdfComponentsModule } from '@adf/components';
import { TranslateModule } from '@ngx-translate/core';
import { PmpLoadHomeComponent } from './components/load/pmp-load-home/pmp-load-home.component';
import { PmpUploadComponent } from './components/load/pmp-upload/pmp-upload.component';
import { SpplConfirmationComponent } from './components/load/pmpl-confirmation/sppl-confirmation.component';
import { PmplVoucherComponent } from './components/load/pmpl-voucher/pmpl-voucher.component';
import { AdfRadioButtonComponent } from './components/adf-radio-button/adf-radio-button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PmpManualHomeComponent } from './components/load/pmp-manual-home/pmp-manual-home.component';
import { SppmTableComponent } from './components/pmp-table/sppm-table.component';
import { PmppConfirmationComponent } from './components/payment/pmpp-confirmation/pmpp-confirmation.component';
import { PmppVoucherComponent } from './components/payment/pmpp-voucher/pmpp-voucher.component';
import { PmppProofModalComponent } from './components/payment/pmpp-proof-modal/pmpp-proof-modal.component';
import { PmppPaymentComponent } from './components/payment/pmpp-home/pmpp-payment.component';


@NgModule({
  declarations: [
    PmpHomeComponent,
    PmpLoadHomeComponent,
    PmpUploadComponent,
    SpplConfirmationComponent,
    PmplVoucherComponent,
    AdfRadioButtonComponent,
    PmpManualHomeComponent,
    SppmTableComponent,
    PmppConfirmationComponent,
    PmppVoucherComponent,
    PmppProofModalComponent,
    PmppPaymentComponent
  ],
  imports: [
    CommonModule,
    MangerPayrollRoutingModule,
    NgxDropzoneModule,
    AdfComponentsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class ManagerPayrollModule { }
