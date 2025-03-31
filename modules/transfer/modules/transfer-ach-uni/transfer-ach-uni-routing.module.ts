import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AchUniHomeComponent } from './components/ach-uni-home/ach-uni-home.component';
import { AchUniTransactionComponent } from './components/ach-uni-transaction/ach-uni-transaction.component';
import { AchUniConfirmationComponent } from './components/ach-uni-confirmation/ach-uni-confirmation.component';
import { AchUniVoucherComponent } from './components/ach-uni-voucher/ach-uni-voucher.component';
import { GetSourceAccountResolver } from '../../../../resolvers/get-source-account.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import { EAchScheduleServices } from '../transfer-ach/enum/transfer-ach.enum';
import { TransferAchResolver } from '../transfer-ach/resolvers/transfer-ach.resolver';
import { AchUniTransactionViewMode } from './enums/AchUniTransactionViewMode.enum';
import { GetListTargetAccountsAchUniResolver } from './resolvers/get-list-target-accounts-ach-uni.resolver';
import { GetListPurposeAchUniResolver } from './resolvers/get-list-purpose-ach-uni.resolver';
import { GetCommissionCalculationAchUniResolver } from './resolvers/get-commission-calculation-ach-uni.resolver';
import { AchUniLimitTrasnferUserResolver } from './resolvers/ach-uni-limit-trasnfer-user.resolver';
import { AchUniTransferLimitClientCurrencyResolver } from './resolvers/ach-uni-transfer-limit-client-currency.resolver';
import { AchUniTermsConditionsComponent } from './components/ach-uni-terms-conditions/ach-uni-terms-conditions.component';
import { EACHUNIView } from './enums/view.enum';
import { VerifyTermsConditionsGuard } from '../transfer-ach-uni-multiple/guards/verify-terms-conditions.guard';

const routes: Routes = [
  {
    path: '',
    component: AchUniHomeComponent,
    data: {
      view: AchUniTransactionViewMode.DEFAULT,
    },
    resolve: {},
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'terms-conditions',
    component: AchUniTermsConditionsComponent,
    data: {
      view: AchUniTransactionViewMode.TERMS_CONDITIONS,
    },
    resolve: {},
    canActivate: [
      NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'transaction',
    component: AchUniTransactionComponent,
    data: {
      view: AchUniTransactionViewMode.TRANSACTION,
      service: EAchScheduleServices.ACH_TRANSFER
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      sourceAccountList: GetSourceAccountResolver,
      targetAccountList: TransferAchResolver,
      getBankList: GetListTargetAccountsAchUniResolver,
      getPurposeList: GetListPurposeAchUniResolver,
      getCommissionCalculation: GetCommissionCalculationAchUniResolver,
      getLimitUser: AchUniLimitTrasnferUserResolver,
      getLimitCurrencyTypeClient: AchUniTransferLimitClientCurrencyResolver
    },
    canActivate: [
      NavigationProtectedGuard,
      LoggedGuard,
      RequireSecurityProfileGuard
    ],
    canDeactivate: [VerifyTermsConditionsGuard]
  },
  {
    path: 'confirmation',
    component: AchUniConfirmationComponent,
    data: {
      view: AchUniTransactionViewMode.CONFIRMATION,
    },
    resolve:{
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      NavigationProtectedGuard,
      LoggedGuard,
      RequireSecurityProfileGuard
      ]
  },
  {
    path: 'voucher',
    data: {
      view: EACHUNIView.DEFAULT_CONFIRMATION
    },
    component: AchUniVoucherComponent,
  },
  {
    path: 'st-detail',
    data: {
      view: EACHUNIView.ST_DETAIL
    },
    component: AchUniVoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      getPurposeList: GetListPurposeAchUniResolver,
    },
  },
  {
    path: 'st-operation',
    data: {
      view: EACHUNIView.ST_OPERATION
    },
    component: AchUniVoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      getPurposeList: GetListPurposeAchUniResolver,
    },
  },
  {
    path: 'st/transaction',
    component: AchUniTransactionComponent,
    data: {
      view: AchUniTransactionViewMode.SIGNATURE_TRACKING_MODIFY,
      service: EAchScheduleServices.ACH_TRANSFER
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      sourceAccountList: GetSourceAccountResolver,
      targetAccountList: TransferAchResolver,
      getBankList: GetListTargetAccountsAchUniResolver,
      getPurposeList: GetListPurposeAchUniResolver,
      getCommissionCalculation: GetCommissionCalculationAchUniResolver,
      getLimitUser: AchUniLimitTrasnferUserResolver,
      getLimitCurrencyTypeClient: AchUniTransferLimitClientCurrencyResolver
    },
    canActivate: [
      NavigationProtectedGuard,
      LoggedGuard,
      RequireSecurityProfileGuard
    ],
  },
  {
    path: 'st/confirmation',
    component: AchUniConfirmationComponent,
    data: {
      view: AchUniTransactionViewMode.SIGNATURE_TRACKING_MODIFY,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      NavigationProtectedGuard,
      LoggedGuard,
      RequireSecurityProfileGuard
    ]
  },
  {
    path: 'st/voucher',
    data: {
      view: AchUniTransactionViewMode.SIGNATURE_TRACKING_MODIFY,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    component: AchUniVoucherComponent,
    canActivate: [
      NavigationProtectedGuard,
      LoggedGuard,
      RequireSecurityProfileGuard
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferAchUniRoutingModule { }
