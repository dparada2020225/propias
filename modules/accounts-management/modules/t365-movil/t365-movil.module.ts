import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { T365MovilRoutingModule } from './t365-movil-routing.module';
import { AmM365HomeComponent } from './components/am-m365-home/am-m365-home.component';
import { AmM365DetailAccountComponent } from './components/am-m365-detail-account/am-m365-detail-account.component';
import { AmM365VoucherComponent } from './components/am-m365-voucher/am-m365-voucher.component';
import { AmM365CreateComponent } from './components/create/am-m365-create/am-m365-create.component';
import { AmM365ConfirmationComponent } from './components/create/am-m365-confirmation/am-m365-confirmation.component';
import { AmM365DeleteComponent } from './components/delete/am-m365-delete/am-m365-delete.component';
import { AmM365DeleteConfirmationComponent } from './components/delete/am-m365-delete-confirmation/am-m365-delete-confirmation.component';
import { AmM365UpdateComponent } from './components/update/am-m365-update/am-m365-update.component';
import { AmM365UpdateConfirmationComponent } from './components/update/am-m365-update-confirmation/am-m365-update-confirmation.component';
import { AdfComponentsModule } from '@adf/components';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TransferModule } from '../../../transfer/transfer.module';
import { TranslateModule } from '@ngx-translate/core';
import { TransferThirdModule } from '../../../transfer/modules/transfer-third/transfer-third.module';


@NgModule({
  declarations: [
    AmM365HomeComponent,
    AmM365DetailAccountComponent,
    AmM365VoucherComponent,
    AmM365CreateComponent,
    AmM365ConfirmationComponent,
    AmM365DeleteComponent,
    AmM365DeleteConfirmationComponent,
    AmM365UpdateComponent,
    AmM365UpdateConfirmationComponent,
  ],
  imports: [
    CommonModule,
    T365MovilRoutingModule,
    AdfComponentsModule,
    NgxSpinnerModule,
    TransferModule,
    TranslateModule,
    TransferThirdModule
  ]
})
export class T365MovilModule { }
