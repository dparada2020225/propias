import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Transfer365MultipleRoutingModule } from './transfer-365-multiple-routing.module';
import { Tm365HomeComponent } from './components/tm365-home/tm365-home.component';
import { Tm365ConfirmationComponent } from './components/tm365-confirmation/tm365-confirmation.component';
import { Tm365VoucherComponent } from './components/tm365-voucher/tm365-voucher.component';
import { Tm365ModalHelperComponent } from './components/tm365-modal-helper/tm365-modal-helper.component';
import { Tm365ProofModalComponent } from './components/tm365-proof-modal/tm365-proof-modal.component';
import { AdfComponentsModule } from '@adf/components';
import { TransferModule } from '../../transfer.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Tm365FooterComponent } from './components/tm365-footer/tm365-footer.component';


@NgModule({
  declarations: [
    Tm365HomeComponent,
    Tm365ConfirmationComponent,
    Tm365VoucherComponent,
    Tm365ModalHelperComponent,
    Tm365ProofModalComponent,
    Tm365FooterComponent
  ],
  exports: [
    Tm365FooterComponent
  ],
  imports: [
    CommonModule,
    Transfer365MultipleRoutingModule,
    AdfComponentsModule,
    TransferModule,
    TranslateModule,
    NgxSpinnerModule
  ]
})
export class Transfer365MultipleModule { }
