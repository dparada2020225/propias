import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThirdPartyLoansRoutingModule } from './third-party-loans-routing.module';
import { AdfComponentsModule } from '@adf/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConsultThirdPartyLoansComponent } from './components/crud/create/consult-loans/consult-third-party-loans.component';
import { CreateThirdPartyLoansComponent } from './components/crud/create/create-third-party-loans/create-tpl.component';
import { UpdateTplConfirmComponent } from './components/crud/update/update-tpl-confirm/update-tpl-confirm.component';
import { UpdateTplComponent } from './components/crud/update/update-home/update-tpl.component';
import { PaymentOwnThirdPartyLoansComponent } from './components/home-all-loans/payment-own-third-party-loans.component';
import { PaymentsThirdPartyLoansComponent } from './components/home-third-party-loans/payments-third-party-loans.component';
import { ConfirmationPaymentTPLComponent } from './components/payment/payment-voucher/confirmation-payment-tpl.component';
import { TplPaymentFormComponent } from './components/payment/tpl-payment-form/tpl-payment-form.component';
import { TplPaymentVoucherComponent } from './components/payment/tpl-payment-voucher/tpl-payment-voucher.component';
import { TplConfirmationScreenComponent } from './components/tpl-confirmation-screen/tpl-confirmation-screen.component';


@NgModule({
  declarations: [
    PaymentsThirdPartyLoansComponent,
    PaymentOwnThirdPartyLoansComponent,
    CreateThirdPartyLoansComponent,
    ConsultThirdPartyLoansComponent,
    UpdateTplComponent,
    ConfirmationPaymentTPLComponent,
    TplConfirmationScreenComponent,
    TplPaymentFormComponent,
    UpdateTplConfirmComponent,
    TplPaymentVoucherComponent,
  ],
  imports: [
    CommonModule,
    ThirdPartyLoansRoutingModule,
    AdfComponentsModule,
    TranslateModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class ThirdPartyLoansModule { }
