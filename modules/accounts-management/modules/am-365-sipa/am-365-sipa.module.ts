import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Am365SipaRoutingModule } from './am-365-sipa-routing.module';
import { AmS365HomeComponent } from './components/am-s365-home/am-s365-home.component';
import { AdfComponentsModule } from '@adf/components';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TransferModule } from '../../../transfer/transfer.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmS365AddComponent } from './components/add/am-s365-add/am-s365-add.component';
import { AmS365ConfirmComponent } from './components/add/am-s365-confirm/am-s365-confirm.component';
import { AmS365RemoveComponent } from './components/remove/am-s365-remove/am-s365-remove.component';
import { AmS365RemoveConfirmComponent } from './components/remove/am-s365-remove-confirm/am-s365-remove-confirm.component';
import { AmS365UpdateComponent } from './components/update/am-s365-update/am-s365-update.component';
import { AmS365UpdateConfirmComponent } from './components/update/am-s365-update-confirm/am-s365-update-confirm.component';
import { AmS365VoucherComponent } from './components/am-s365-voucher/am-s365-voucher.component';


@NgModule({
  declarations: [
    AmS365HomeComponent,
    AmS365AddComponent,
    AmS365ConfirmComponent,
    AmS365RemoveComponent,
    AmS365RemoveConfirmComponent,
    AmS365UpdateComponent,
    AmS365UpdateConfirmComponent,
    AmS365VoucherComponent
  ],
  imports: [
    CommonModule,
    Am365SipaRoutingModule,
    AdfComponentsModule,
    NgxSpinnerModule,
    TransferModule,
    TranslateModule
  ]
})
export class Am365SipaModule { }
