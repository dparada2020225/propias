import { NgModule } from '@angular/core';
import { IntToMonthPipe } from '../../pipes/int-to-month.pipe';
import { AccountSelectorComponent } from './account-selector/account-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdfComponentsModule } from '@adf/components';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { CustomNumberPipe } from '../../pipes/custom-number.pipe';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { CustomDateLabelPipe } from '../../pipes/custom-date-label.pipe';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    AdfComponentsModule,
    NgxSpinnerModule
  ],
  declarations: [
    IntToMonthPipe,
    AccountSelectorComponent,
    CustomNumberPipe,
    CustomDatePipe,
    CustomDateLabelPipe
  ],
  exports: [
    IntToMonthPipe,
    AccountSelectorComponent,
    CustomNumberPipe,
    CustomDatePipe,
    CustomDateLabelPipe
  ]
})
export class SharedModule {

}
