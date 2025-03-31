import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionHistoryRoutingModule } from './transaction-history-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransferRoutingModule } from '../../../transfer/transfer-routing.module';
import { AdfComponentsModule } from '@adf/components';
import { TranslateModule } from '@ngx-translate/core';
import { ThHomeComponent } from './components/th-home/th-home.component';


@NgModule({
  declarations: [
    ThHomeComponent
  ],
  imports: [
    CommonModule,
    TransactionHistoryRoutingModule,
    TranslateModule,
    AdfComponentsModule,
    TransferRoutingModule,
    NgbModule,
    NgxSpinnerModule,
  ]
})
export class TransactionHistoryModule { }
