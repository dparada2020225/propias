import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Transfer365SipaRoutingModule } from './transfer-365-sipa-routing.module';
import { S365HomeComponent } from './components/s365-home/s365-home.component';
import { S365ConfirmationComponent } from './components/s365-confirmation/s365-confirmation.component';
import { S365VoucherComponent } from './components/s365-voucher/s365-voucher.component';
import { AdfComponentsModule } from '@adf/components';
import { TransferModule } from '../../transfer.module';
import { TranslateModule } from '@ngx-translate/core';
import { S365TermsComponent } from './components/s365-terms/s365-terms.component';


@NgModule({
  declarations: [
    S365HomeComponent,
    S365ConfirmationComponent,
    S365VoucherComponent,
    S365TermsComponent,
  ],
  imports: [
    CommonModule,
    Transfer365SipaRoutingModule,
    AdfComponentsModule,
    TransferModule,
    TranslateModule
  ]
})
export class Transfer365SipaModule { }
