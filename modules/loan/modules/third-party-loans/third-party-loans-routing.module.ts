import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import stNavigateProtectedRoute from '../../../../../assets/data/signature-tracking-protected-navigation.json';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { ConsultThirdPartyLoansComponent } from './components/crud/create/consult-loans/consult-third-party-loans.component';
import { CreateThirdPartyLoansComponent } from './components/crud/create/create-third-party-loans/create-tpl.component';
import { UpdateTplComponent } from './components/crud/update/update-home/update-tpl.component';
import { UpdateTplConfirmComponent } from './components/crud/update/update-tpl-confirm/update-tpl-confirm.component';
import { PaymentOwnThirdPartyLoansComponent } from './components/home-all-loans/payment-own-third-party-loans.component';
import { PaymentsThirdPartyLoansComponent } from './components/home-third-party-loans/payments-third-party-loans.component';
import { ConfirmationPaymentTPLComponent } from './components/payment/payment-voucher/confirmation-payment-tpl.component';
import { TplPaymentFormComponent } from './components/payment/tpl-payment-form/tpl-payment-form.component';
import { TplPaymentVoucherComponent } from './components/payment/tpl-payment-voucher/tpl-payment-voucher.component';
import { TplConfirmationScreenComponent } from './components/tpl-confirmation-screen/tpl-confirmation-screen.component';
import { TPLPTypeView } from './enum/payment.interface';
import { DebitLoansNumbers } from './resolvers/debit-loans-numbers.resolver';
import { ThirdPartyLoansAccountsResolver } from './resolvers/loan-account-numbers.resolver';
import { OwnLoanAccountsResolver } from './resolvers/own-loan-accounts.resolver';
import { MenuLicensesResolver } from '../../../../resolvers/menu-licenses.resolver';
import { EServiceCodeTPL } from './enum/service-code-tpl.enum';

const routes: Routes = [
  {
    path: '',
    component: PaymentsThirdPartyLoansComponent,
    resolve: {
      associatedThirdAccounts: ThirdPartyLoansAccountsResolver,
      keepAlive2Resolver: KeepAlive2Resolver,
      menuOptions: MenuLicensesResolver
    },
    data: {
      service: EServiceCodeTPL.THIRD_PARTY_LOANS,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
      MenuPermissionEvaluatorGuard,
    ],
  },
  {
    path: 'all',
    component: PaymentOwnThirdPartyLoansComponent,
    resolve: {
      associatedThirdAccounts: ThirdPartyLoansAccountsResolver,
      associatedOwnLoansAccounts: OwnLoanAccountsResolver,
      keepAlive2Resolver: KeepAlive2Resolver,
      menuOptionsTPL: MenuLicensesResolver,
    },
    data: {
      service: EServiceCodeTPL.THIRD_PARTY_LOANS,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
      MenuPermissionEvaluatorGuard,
    ],
  },
  {
    path: 'consult',
    component: ConsultThirdPartyLoansComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard

    ],
  },
  {
    path: 'create',
    component: CreateThirdPartyLoansComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard

    ],
  },
  {
    path: 'confirmation',
    component: TplConfirmationScreenComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard

    ]
  },
  {
    path: 'update',
    component: UpdateTplComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,

    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard

    ]
  },
  {
    path: 'update-confirmation',
    component: UpdateTplConfirmComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ]
  },
  {
    path: 'payment',
    component: TplPaymentFormComponent,
    data: {
      view: TPLPTypeView.DEFAULT,
    },
    resolve: {
      debitLoansNumbers: DebitLoansNumbers,
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ]
  },
  {
    path: 'payment-voucher',
    component: ConfirmationPaymentTPLComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard

    ],
  },
  {
    path: 'voucher',
    component: TplPaymentVoucherComponent,
    data: {
      view: TPLPTypeView.DEFAULT,
      navigateProtection: stNavigateProtectedRoute,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'std-voucher',
    component: TplPaymentVoucherComponent,
    data: {
      view: TPLPTypeView.ST_DETAIL_TRANSACTION,
      navigateProtection: stNavigateProtectedRoute,

    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'th-voucher',
    component: TplPaymentVoucherComponent,
    data: {
      view: TPLPTypeView.TRANSACTION_HISTORY,
      navigateProtection: stNavigateProtectedRoute,

    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'operations',
    component: TplPaymentVoucherComponent,
    data: {
      view: TPLPTypeView.ST_OPERATIONS,
      navigateProtection: stNavigateProtectedRoute,

    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'stm-confirmation',
    component: TplPaymentVoucherComponent,
    data: {
      view: TPLPTypeView.ST_CONFIRM_TRANSACTION,
      navigateProtection: stNavigateProtectedRoute,

    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'stm-voucher',
    component: TplPaymentVoucherComponent,
    data: {
      view: TPLPTypeView.ST_MODIFY_TRANSACTIONS,
      navigateProtection: stNavigateProtectedRoute,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'st-payment',
    component: TplPaymentFormComponent,
    data: {
      view: TPLPTypeView.ST_MODIFY_TRANSACTIONS,
      navigateProtection: stNavigateProtectedRoute,
    },
    resolve: {
      debitLoansNumbers: DebitLoansNumbers
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThirdPartyLoansRoutingModule { }
