import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonationRoutingModule } from './donation-routing.module';
import { DonationConfirmationComponent } from './components/donation-confirmation/donation-confirmation.component';
import { DonationVoucherComponent } from './components/donation-voucher/donation-voucher.component';
import { DonationHomeComponent } from './components/donation-home/donation-home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdfComponentsModule } from '@adf/components';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    DonationConfirmationComponent,
    DonationVoucherComponent,
    DonationHomeComponent
  ],
  imports: [
    CommonModule,
    DonationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
  ]
})
export class DonationModule { }
