import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignatureTrackingRoutingModule } from './signature-tracking-routing.module';
import { DetailTransactionComponent } from './components/detail-transaction/detail-transaction.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdfComponentsModule } from '@adf/components';
import { TransferRoutingModule } from 'src/app/modules/transfer/transfer-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StSignaturesComponent } from './components/st-signatures/st-signatures.component';
import { StHomeComponent } from './components/st-home/st-home.component';


@NgModule({
  declarations: [
    DetailTransactionComponent,
    StSignaturesComponent,
    StHomeComponent,
  ],
  imports: [
    CommonModule,
    SignatureTrackingRoutingModule,
    TranslateModule,
    AdfComponentsModule,
    TransferRoutingModule,
    NgbModule,
    NgxSpinnerModule,
  ]
})
export class SignatureTrackingModule { }
