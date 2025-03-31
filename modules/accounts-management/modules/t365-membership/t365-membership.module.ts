import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { T365MembershipRoutingModule } from './t365-membership-routing.module';
import { AmT365mHomeComponent } from './components/am-t365m-home/am-t365m-home.component';
import { AdfComponentsModule } from '@adf/components';
import { TranslateModule } from '@ngx-translate/core';
import { TransferModule } from '../../../transfer/transfer.module';
import { AmT365mVoucherComponent } from './components/am-m365-voucher/am-t365m-voucher.component';
import { AmM365AddComponent } from './components/affiliate/am-m365-add.component';
import { AmM365DisaffiliateComponent } from './components/disaffiliate/am-m365-disaffiliate.component';
import { AmM365UpdateComponent } from './components/update/am-m365-update.component';


@NgModule({
  declarations: [
    AmT365mHomeComponent,
    AmT365mVoucherComponent,
    AmM365AddComponent,
    AmM365DisaffiliateComponent,
    AmM365UpdateComponent,
  ],
  imports: [
    CommonModule,
    T365MembershipRoutingModule,
    AdfComponentsModule,
    TranslateModule,
    TransferModule
  ]
})
export class T365MembershipModule { }
