import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanRoutingModule } from './loan-routing.module';
import { AdfComponentsModule } from '@adf/components';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoanRoutingModule,
    AdfComponentsModule,
    TranslateModule,
    SharedModule,
    FormsModule,
    NgxSpinnerModule
  ]
})
export class LoanModule { }
