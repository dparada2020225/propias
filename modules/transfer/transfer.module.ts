import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferRoutingModule } from './transfer-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TranslateModule } from '@ngx-translate/core';
import { AdfTransferFooterComponent } from './components/adf-transfer-footer/adf-transfer-footer.component';
import { AdfFavoritesManagementComponent } from './components/adf-favorites-management/adf-favorites-management.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AdfTransferFooterComponent,
    AdfFavoritesManagementComponent,
  ],
  exports: [
    AdfTransferFooterComponent,
    AdfFavoritesManagementComponent
  ],
  imports: [
    CommonModule,
    TransferRoutingModule,
    NgxDropzoneModule,
    TranslateModule,
    NgxSpinnerModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TransferModule { }
