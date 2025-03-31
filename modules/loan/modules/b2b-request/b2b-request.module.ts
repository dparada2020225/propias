import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { B2bRequestRoutingModule } from './b2b-request-routing.module';
import { B2bRequestHomeComponent } from './components/b2b-request-home/b2b-request-home.component';
import { B2bRequestVoucherComponent } from './components/b2b-request-voucher/b2b-request-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdfComponentsModule } from '@adf/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    B2bRequestHomeComponent,
    B2bRequestVoucherComponent
  ],
  imports: [
    CommonModule,
    B2bRequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
  ]
})
export class B2bRequestModule { }
