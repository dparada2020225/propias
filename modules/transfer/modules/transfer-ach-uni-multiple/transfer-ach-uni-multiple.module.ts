import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferAchUniMultipleRoutingModule } from './transfer-ach-uni-multiple-routing.module';
import { TmAchUniHomeComponent } from './components/tm-ach-uni-home/tm-ach-uni-home.component';
import { TmAchUniConfirmationComponent } from './components/tm-ach-uni-confirmation/tm-ach-uni-confirmation.component';
import { TmAchUniVoucherComponent } from './components/tm-ach-uni-voucher/tm-ach-uni-voucher.component';
import { AdfComponentsModule } from '@adf/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TransferModule } from '../../transfer.module';
import { TmAchUniHelperComponent } from './components/tm-ach-uni-helper/tm-ach-uni-helper.component';
import { TmAchUniFooterComponent } from './components/tm-ach-uni-footer/tm-ach-uni-footer.component';
import { TmAchUniModalPdfComponent } from './components/tm-ach-uni-modal-pdf/tm-ach-uni-modal-pdf.component';
import { StAchUniOperationsComponent } from './components/st-ach-uni-operations/st-ach-uni-operations.component';


@NgModule({
  declarations: [
    TmAchUniHomeComponent,
    TmAchUniConfirmationComponent,
    TmAchUniVoucherComponent,
    TmAchUniHelperComponent,
    TmAchUniFooterComponent,
    TmAchUniModalPdfComponent,
    StAchUniOperationsComponent
  ],
  imports: [
    CommonModule,
    TransferAchUniMultipleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
    TransferModule
  ]
})
export class TransferAchUniMultipleModule { }
