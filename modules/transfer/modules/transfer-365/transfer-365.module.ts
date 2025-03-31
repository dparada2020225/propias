import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Transfer365RoutingModule } from './transfer-365-routing.module';
import { T365HomeComponent } from './components/t365-home/t365-home.component';
import { T365ConfirmationComponent } from './components/t365-confirmation/t365-confirmation.component';
import { T365VoucherComponent } from './components/t365-voucher/t365-voucher.component';
import { AdfComponentsModule } from '@adf/components';
import { TranslateModule } from '@ngx-translate/core';
import { TransferModule } from '../../transfer.module';
import { T365TermsConditionComponent } from './components/t365-terms-condition/t365-terms-condition.component';


@NgModule({
  declarations: [
    T365HomeComponent,
    T365ConfirmationComponent,
    T365VoucherComponent,
    T365TermsConditionComponent
  ],
  imports: [
    CommonModule,
    Transfer365RoutingModule,
    AdfComponentsModule,
    TranslateModule,
    TransferModule
  ]
})
export class Transfer365Module { }
