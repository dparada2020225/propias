import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchRoutingModule } from './ach-routing.module';
import { AmAchHomeComponent } from './components/am-ach-home/am-ach-home.component';
import { AdfComponentsModule } from '@adf/components';
import { TranslateModule } from '@ngx-translate/core';
import { TransferModule } from '../../../transfer/transfer.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AmAchCreateComponent } from './components/create/am-ach-create/am-ach-create.component';
import { AmAchUpdateComponent } from './components/update/am-ach-update/am-ach-update.component';
import { AmAchUpdateConfirmationComponent } from './components/update/am-ach-update-confirmation/am-ach-update-confirmation.component';
import { AcAchDeleteComponent } from './components/delete/ac-ach-delete/ac-ach-delete.component';
import { AmAchCreateConfirmationComponent } from './components/create/am-ach-create-confirmation/am-ach-create-confirmation.component';
import { AmAchDetailAccountComponent } from './components/am-ach-detail-account/am-ach-detail-account.component';
import { AcAchDeleteConfirmationComponent } from './components/delete/ac-ach-delete-confirmation/ac-ach-delete-confirmation.component';
import { AmAchVoucherComponent } from './components/am-ach-voucher/am-ach-voucher.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AmAchHomeComponent,
    AmAchCreateComponent,
    AmAchUpdateComponent,
    AmAchUpdateConfirmationComponent,
    AcAchDeleteComponent,
    AmAchCreateConfirmationComponent,
    AmAchDetailAccountComponent,
    AcAchDeleteConfirmationComponent,
    AmAchVoucherComponent
  ],
  imports: [
    CommonModule,
    AchRoutingModule,
    AdfComponentsModule,
    TranslateModule,
    TransferModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ]
})
export class AchModule { }
