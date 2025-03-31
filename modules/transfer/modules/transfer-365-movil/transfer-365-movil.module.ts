import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Transfer365MovilRoutingModule } from './transfer-365-movil-routing.module';
import { M365HomeComponent } from './components/m365-home/m365-home.component';
import { M365ConfirmationComponent } from './components/m365-confirmation/m365-confirmation.component';
import { M365VoucherComponent } from './components/m365-voucher/m365-voucher.component';
import { AdfComponentsModule } from '@adf/components';
import { TransferModule } from '../../transfer.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { M365TermsConditionComponent } from './components/m365-terms-condition/m365-terms-condition.component';


@NgModule({
  declarations: [
    M365HomeComponent,
    M365ConfirmationComponent,
    M365VoucherComponent,
    M365TermsConditionComponent
  ],
  imports: [
    CommonModule,
    Transfer365MovilRoutingModule,
    AdfComponentsModule,
    TransferModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class Transfer365MovilModule { }
