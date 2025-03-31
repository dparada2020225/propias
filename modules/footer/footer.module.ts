import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFooterComponent } from './views/transaction-footer/transaction-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdfComponentsModule } from '@adf/components';



@NgModule({
  declarations: [
    TransactionFooterComponent
  ],
  exports: [
    TransactionFooterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AdfComponentsModule
  ]
})
export class FooterModule { }
