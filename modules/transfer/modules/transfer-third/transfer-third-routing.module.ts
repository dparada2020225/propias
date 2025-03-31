import {LoggedGuard, RequireSecurityProfileGuard} from '@adf/security';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuPermissionEvaluatorGuard} from 'src/app/guards/menu-permission-evaluator.guard';
import {NavigationProtectedGuard} from 'src/app/guards/navigation-protected.guard';
import {KeepAlive2Resolver} from 'src/app/resolvers/keep-alive2.resolver';
import {ScheduleServiceResolver} from 'src/app/resolvers/schedule-service.resolver';
import navigationProtectionForSignatureTracking
  from '../../../../../assets/data/navigation-protenction-signature-tracking.json';
import {MenuLicensesResolver} from '../../../../resolvers/menu-licenses.resolver';
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
import {TransferThirdHomeComponent} from './components/transfer-third-home/transfer-third-home.component';
import {WhatIsComponent} from './components/what-is/what-is.component';
import {EThirdTransferService} from './enums/third-transfer-menu-options-licenses.enum';
import {EThirdTransferViewMode} from './enums/third-transfer-navigate-parameters.enum';
import {AssociatedThirdAccountsResolver} from './resolvers/associated-third-accounts.resolver';
import {ThirdDebitAccountsResolver} from './resolvers/third-debit-accounts.resolver';
import {
  TransferThirdHomeCorporateImageComponent
} from "./components/transfer-third-home-corporate-image/transfer-third-home-corporate-image.component";

const routes: Routes = [
  {
    path: '',
    component: TransferThirdHomeComponent,
    data: {
      service: EThirdTransferService.THIRD,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedThirdAccounts: AssociatedThirdAccountsResolver,
      menuOptionsLicenses: MenuLicensesResolver,
      scheduleService: ScheduleServiceResolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, MenuPermissionEvaluatorGuard],
  },
  {
    path: 'home',
    component: TransferThirdHomeCorporateImageComponent,
    data: {
      service: EThirdTransferService.THIRD_SV,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedThirdAccounts: AssociatedThirdAccountsResolver,
      menuOptionsLicenses: MenuLicensesResolver,
      scheduleService: ScheduleServiceResolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, MenuPermissionEvaluatorGuard],
  },
  {
    path: 'what-is',
    component: WhatIsComponent,
    data: {
      service: EThirdTransferService.WHAT_IS,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      menuOptionsLicenses: MenuLicensesResolver,
      scheduleService: ScheduleServiceResolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, MenuPermissionEvaluatorGuard],
  },
  {
    path: 'confirmation',
    component: TtTransactionConfirmationComponent,
    data: {
      view: EThirdTransferViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'transaction',
    component: TtTransactionHomeComponent,
    data: {
      view: EThirdTransferViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      debitAccounts: ThirdDebitAccountsResolver,
      associatedThirdAccounts: AssociatedThirdAccountsResolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'voucher',
    component: TtTransactionVoucherComponent,
    data: {
      view: EThirdTransferViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'st-home',
    component: TtTransactionHomeComponent,
    data: {
      view: EThirdTransferViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      debitAccounts: ThirdDebitAccountsResolver,
      associatedThirdAccounts: AssociatedThirdAccountsResolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'st-confirmation',
    component: TtTransactionConfirmationComponent,
    data: {
      view: EThirdTransferViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'stm-voucher',
    component: TtTransactionVoucherComponent,
    data: {
      view: EThirdTransferViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'th-voucher',
    component: TtTransactionVoucherComponent,
    data: {
      view: EThirdTransferViewMode.TRANSACTION_HISTORY,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'st-voucher',
    component: TtTransactionVoucherComponent,
    data: {
      view: EThirdTransferViewMode.SIGNATURE_TRACKING_DETAIL,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'st-operation',
    component: TtTransactionVoucherComponent,
    data: {
      view: EThirdTransferViewMode.SIGNATURE_TRACKING_OPERATION,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'create',
    component: TtCreateHomeComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'create-confirm',
    component: TtCreateConfirmationComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'create-voucher',
    component: TtCreateVoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'update',
    component: TtUpdateHomeComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'update-voucher',
    component: TtUpdateVoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
  {
    path: 'delete',
    component: TtdDeleteComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard, NavigationProtectedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferThirdRoutingModule {
}
