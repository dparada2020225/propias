import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatementsRoutingModule } from './statements-routing.module';
import { CheckStatementComponent } from './views/check-statement/check-statement.component';
import { CheckStatementFilterModalComponent } from './views/check-statement-filter-modal/check-statement-filter-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdfComponentsModule } from '@adf/components';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module'
import { FooterModule } from '../footer/footer.module';
import { CheckStatementResultComponent } from './views/check-statement-result/check-statement-result.component';
import { CheckStatementDetailModalComponent } from './views/check-statement-detail-modal/check-statement-detail-modal.component';
import { CheckStatementDetailNotesModalComponent } from './views/check-statement-detail-notes-modal/check-statement-detail-notes-modal.component';

@NgModule({
  declarations: [
    CheckStatementComponent,
    CheckStatementFilterModalComponent,
    CheckStatementResultComponent,
    CheckStatementDetailModalComponent,
    CheckStatementDetailNotesModalComponent
  ],
  imports: [
    StatementsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    SharedModule,
    NgxSpinnerModule,
    FooterModule
]
})
export class StatementsModule { }
