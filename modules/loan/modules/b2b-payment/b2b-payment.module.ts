import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { B2bPaymentRoutingModule } from './b2b-payment-routing.module';
import { B2bPaymentHomeComponent } from './components/b2b-payment-home/b2b-payment-home.component';
import {
  B2bPaymentConfirmationComponent
} from './components/b2b-payment-confirmation/b2b-payment-confirmation.component';
import { B2bPaymentFormComponent } from './components/b2b-payment-form/b2b-payment-form.component';
import { B2bPaymentVoucherComponent } from './components/b2b-payment-voucher/b2b-payment-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdfComponentsModule } from '@adf/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    B2bPaymentHomeComponent,
    B2bPaymentConfirmationComponent,
    B2bPaymentFormComponent,
    B2bPaymentVoucherComponent,
  ],
  imports: [
    CommonModule,
    B2bPaymentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
  ]
})
export class B2bPaymentModule { }
