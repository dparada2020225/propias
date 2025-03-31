import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferAchRoutingModule } from './transfer-ach-routing.module';
import { AchHomeComponent } from './components/ach-home/ach-home.component';
import { AchConfirmationComponent } from './components/transaction/ach-confirmation/ach-confirmation.component';
import { AchFormComponent } from './components/transaction/ach-form/ach-form.component';
import { AchVoucherComponent } from './components/transaction/ach-voucher/ach-voucher.component';
import { AchCreateConfirmComponent } from './components/crud/create/ach-create-confirm/ach-create-confirm.component';
import { AchCreateFormComponent } from './components/crud/create/ach-create-form/ach-create-form.component';
import { AchCreateVoucherComponent } from './components/crud/create/ach-create-voucher/ach-create-voucher.component';
import { AchUpdateConfirmComponent } from './components/crud/update/ach-update-confirm/ach-update-confirm.component';
import { AchUpdateFormComponent } from './components/crud/update/ach-update-form/ach-update-form.component';
import { AchUpdateVoucherComponent } from './components/crud/update/ach-update-voucher/ach-update-voucher.component';
import { AchDeleteComponent } from './components/crud/delete/ach-delete/ach-delete.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdfComponentsModule } from '@adf/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AchHomeComponent,
    AchConfirmationComponent,
    AchFormComponent,
    AchVoucherComponent,
    AchCreateConfirmComponent,
    AchCreateFormComponent,
    AchCreateVoucherComponent,
    AchUpdateConfirmComponent,
    AchUpdateFormComponent,
    AchUpdateVoucherComponent,
    AchDeleteComponent
  ],
  imports: [
    CommonModule,
    TransferAchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
  ]
})
export class TransferAchModule { }
