import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestmentsRoutingModule } from './investments-routing.module';
import { ProjectionsComponent } from './components/projections/projections.component';
import { TermDepositComponent } from './components/term-deposit/term-deposit.component';
import { FooterModule } from '../footer/footer.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';
import { AdfComponentsModule } from '@adf/components';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ProjectionsComponent,
    TermDepositComponent
  ],
  imports: [
    CommonModule,
    InvestmentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    SharedModule,
    NgxSpinnerModule,
    FooterModule,
  ]
})
export class InvestmentsModule { }
