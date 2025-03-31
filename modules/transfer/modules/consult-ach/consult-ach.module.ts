import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultAchRoutingModule } from './consult-ach-routing.module';
import { ConsultAchHomeComponent } from './components/consult-ach-home/consult-ach-home.component';
import { ConsultAchDetailTransactionComponent } from './components/consult-ach-detail-transaction/consult-ach-detail-transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdfComponentsModule } from '@adf/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [ConsultAchHomeComponent, ConsultAchDetailTransactionComponent],
  imports: [
    CommonModule,
    ConsultAchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
  ]
})
export class ConsultAchModule { }
