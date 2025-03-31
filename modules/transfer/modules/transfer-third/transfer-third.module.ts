import {AdfComponentsModule} from '@adf/components';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {NgxSpinnerModule} from 'ngx-spinner';
import {
  TtCreateConfirmationComponent
} from './components/crud/create/tt-create-confirmation/tt-create-confirmation.component';
import {TtCreateHomeComponent} from './components/crud/create/tt-create-home/tt-create-home.component';
import {TtCreateVoucherComponent} from './components/crud/create/tt-create-voucher/tt-create-voucher.component';
import {TtdDeleteComponent} from './components/crud/delete/ttd-delete/ttd-delete.component';
import {TtUpdateHomeComponent} from './components/crud/update/tt-update-home/tt-update-home.component';
import {TtUpdateVoucherComponent} from './components/crud/update/tt-update-voucher/tt-update-voucher.component';
import {
  TtTransactionConfirmationComponent
} from './components/transaction/tt-transaction-confirmation/tt-transaction-confirmation.component';
import {TtTransactionHomeComponent} from './components/transaction/tt-transaction-home/tt-transaction-home.component';
import {
  TtTransactionVoucherComponent
} from './components/transaction/tt-transaction-voucher/tt-transaction-voucher.component';
import {
  AddAccountsModalComponent
} from './components/transfer-third-home-corporate-image/onboarding-news/modals/add-accounts-modal/add-accounts-modal.component';
import {
  KnowFavoritesModalComponent
} from './components/transfer-third-home-corporate-image/onboarding-news/modals/know-favorites-modal/know-favorites-modal.component';
import {
  NewFunctionModalComponent
} from './components/transfer-third-home-corporate-image/onboarding-news/modals/new-function-modal/new-function-modal.component';
import {
  OnboardingNewsComponent
} from './components/transfer-third-home-corporate-image/onboarding-news/onboarding-news.component';
import {TransferThirdHomeComponent} from './components/transfer-third-home/transfer-third-home.component';
import {TransferThirdRoutingModule} from './transfer-third-routing.module';
import {WhatIsComponent} from "./components/what-is/what-is.component";
import {InformationComponent} from "./components/what-is/information/information.component";
import {FrequentQuestionComponent} from "./components/what-is/frequent-question/frequent-question.component";
import {
  TransferThirdHomeCorporateImageComponent
} from './components/transfer-third-home-corporate-image/transfer-third-home-corporate-image.component';
import {
  TargetAccountPreviewComponent
} from './components/transaction/tt-transaction-home/target-credit-account-preview/target-account-preview.component';
import {
  TargetDebitAccountPreviewComponent
} from './components/transaction/tt-transaction-home/target-debit-account-preview/target-debit-account-preview.component';
import {FavoritesComponent} from './components/favorites/favorites.component';

@NgModule({
  declarations: [
    TransferThirdHomeComponent,
    TtTransactionHomeComponent,
    TtTransactionConfirmationComponent,
    TtTransactionVoucherComponent,
    TtCreateHomeComponent,
    TtCreateConfirmationComponent,
    TtCreateVoucherComponent,
    TtUpdateHomeComponent,
    TtUpdateVoucherComponent,
    TtdDeleteComponent,
    NewFunctionModalComponent,
    KnowFavoritesModalComponent,
    AddAccountsModalComponent,
    OnboardingNewsComponent,
    WhatIsComponent,
    InformationComponent,
    FrequentQuestionComponent,
    TransferThirdHomeCorporateImageComponent,
    TargetAccountPreviewComponent,
    TargetDebitAccountPreviewComponent,
    FavoritesComponent
  ],
  imports: [
    CommonModule,
    TransferThirdRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdfComponentsModule,
    NgbModule,
    NgxSpinnerModule
  ],
  exports: [
    FavoritesComponent
  ]
})
export class TransferThirdModule {
}
