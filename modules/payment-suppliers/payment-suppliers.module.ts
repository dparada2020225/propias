import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentSuppliersRoutingModule } from './payment-suppliers-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PaymentSuppliersRoutingModule,
    NgxDropzoneModule,
    TranslateModule,
    NgxSpinnerModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PaymentSuppliersModule { }
