import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { B2bConsultationRoutingModule } from './b2b-consultation-routing.module';
import { B2bConsultationHomeComponent } from './components/b2b-consultation-home/b2b-consultation-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdfComponentsModule } from '@adf/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    B2bConsultationHomeComponent
  ],
  imports: [
    CommonModule,
    B2bConsultationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule,
    SharedModule
  ]
})
export class B2bConsultationModule { }
