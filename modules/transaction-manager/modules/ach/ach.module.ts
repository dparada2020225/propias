import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchRoutingModule } from './ach-routing.module';
import { TmAchHomeComponent } from './components/tm-ach-home/tm-ach-home.component';
import { AdfComponentsModule } from '@adf/components';
import { TransferModule } from '../../../transfer/transfer.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TmAchLookUpComponent } from './components/tm-ach-look-up/tm-ach-look-up.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TmAchTransactionDetailComponent } from './components/tm-ach-transaction-detail/tm-ach-transaction-detail.component';
import { TmAchSignatoryComponent } from './components/tm-ach-signatory/tm-ach-signatory.component';
import { TmAchLoteComponent } from './components/tm-ach-lote/tm-ach-lote.component';
import {
  Transfer365MultipleModule
} from '../../../transfer/modules/transfer-365-multiple/transfer-365-multiple.module';
import { TmAch365ProofModalLoteComponent } from './components/tm-ach365-proof-modal-lote/tm-ach365-proof-modal-lote.component';
import { TmAchModalSignaturesComponent } from './components/tm-ach-modal-signatures/tm-ach-modal-signatures.component';


@NgModule({
  declarations: [
    TmAchHomeComponent,
    TmAchLookUpComponent,
    TmAchTransactionDetailComponent,
    TmAchSignatoryComponent,
    TmAchLoteComponent,
    TmAch365ProofModalLoteComponent,
    TmAchModalSignaturesComponent
  ],
  imports: [
    CommonModule,
    AchRoutingModule,
    AdfComponentsModule,
    TransferModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxSpinnerModule,
    Transfer365MultipleModule
  ]
})
export class AchModule { }
