import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferOwnRoutingModule } from './transfer-own-routing.module';
import { OwnHomeComponent } from './component/own-home/own-home.component';
import { OwnConfirmationComponent } from './component/own-confirmation/own-confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdfComponentsModule } from '@adf/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OwnVoucherComponent } from './component/own-voucher/own-voucher.component';


@NgModule({
  declarations: [
    OwnHomeComponent,
    OwnConfirmationComponent,
    OwnVoucherComponent
  ],
  imports: [
    CommonModule,
    TransferOwnRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
  ]
})
export class TransferOwnModule { }
