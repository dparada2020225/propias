import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferAchUniRoutingModule } from './transfer-ach-uni-routing.module';
import { AchUniHomeComponent } from './components/ach-uni-home/ach-uni-home.component';
import { AchUniConfirmationComponent } from './components/ach-uni-confirmation/ach-uni-confirmation.component';
import { AchUniVoucherComponent } from './components/ach-uni-voucher/ach-uni-voucher.component';
import { AchUniTransactionComponent } from './components/ach-uni-transaction/ach-uni-transaction.component';
import { AdfComponentsModule } from '@adf/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CardTransferComponent } from './components/card-transfer/card-transfer.component';
import { AchUniTermsConditionsModalComponent } from './components/ach-uni-terms-conditions-modal/ach-uni-terms-conditions-modal.component';
import { AchUniTermsConditionsComponent } from './components/ach-uni-terms-conditions/ach-uni-terms-conditions.component';
import { TransferModule } from '../../transfer.module';


@NgModule({
  declarations: [
    AchUniHomeComponent,
    AchUniConfirmationComponent,
    AchUniVoucherComponent,
    AchUniTransactionComponent,
    CardTransferComponent,
    AchUniTermsConditionsModalComponent,
    AchUniTermsConditionsComponent
  ],
  imports: [
    CommonModule,
    TransferAchUniRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
    TransferModule
  ],
  exports:[AchUniTermsConditionsComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TransferAchUniModule { }
