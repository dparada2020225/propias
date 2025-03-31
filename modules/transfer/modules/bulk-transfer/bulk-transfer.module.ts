import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkTransferRoutingModule } from './bulk-transfer-routing.module';
import { BtValidationsModalComponent } from './components/bt-validations-modal/bt-validations-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdfComponentsModule } from '@adf/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BtUploadFileHelperModalComponent } from './components/bt-upload-file-helper-modal/bt-upload-file-helper-modal.component';
import { BtVoucherComponent } from './components/bt-voucher/bt-voucher.component';
import { BtProofVoucherModalComponent } from './components/bt-proof-voucher-modal/bt-proof-voucher-modal.component';
import { BtHomeComponent } from './components/bt-home/bt-home.component';
import { BtConfirmationComponent } from './components/bt-confirmation/bt-confirmation.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TransferRoutingModule } from '../../transfer-routing.module';


@NgModule({
  declarations: [
    BtValidationsModalComponent,
    BtUploadFileHelperModalComponent,
    BtVoucherComponent,
    BtProofVoucherModalComponent,
    BtHomeComponent,
    BtConfirmationComponent
  ],
  imports: [
    CommonModule,
    BulkTransferRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    AdfComponentsModule,
    TransferRoutingModule,
    NgbModule,
    NgxSpinnerModule,
    NgxDropzoneModule
  ]
})
export class BulkTransferModule { }
