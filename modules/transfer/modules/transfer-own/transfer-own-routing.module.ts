import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import { ScheduleServiceResolver } from 'src/app/resolvers/schedule-service.resolver';
import { OwnHomeComponent } from './component/own-home/own-home.component';
import { EOwnTransferScheduleService, EOwnTransferViewMode } from './enum/own-transfer.enum';
import { OwnTransferCreditResolver } from './resolver/own-transfer-credit.resolver';
import { OwnTransferDebitResolver } from './resolver/own-transfer-debit.resolver';
import navigationProtectionForSignatureTracking from '../../../../../assets/data/navigation-protenction-signature-tracking.json';
import { OwnConfirmationComponent } from './component/own-confirmation/own-confirmation.component';
import { OwnVoucherComponent } from './component/own-voucher/own-voucher.component';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { EThirdTransferType } from '../transfer-third/enums/third-transfer.enum';

const routes: Routes = [
  {
    path: '',
    component: OwnHomeComponent,
    data: {
      typeTransfer: EThirdTransferType.SIMPLE,
      service: EOwnTransferScheduleService.OWN,
      view: EOwnTransferViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      creditAccounts: OwnTransferCreditResolver,
      debitAccounts: OwnTransferDebitResolver,
      scheduleService: ScheduleServiceResolver,
    },
    canActivate: [
      MenuPermissionEvaluatorGuard,
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'st-home',
    component: OwnHomeComponent,
    data: {
      typeTransfer: EThirdTransferType.SIMPLE,
      service: EOwnTransferScheduleService.OWN,
      view: EOwnTransferViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      creditAccounts: OwnTransferCreditResolver,
      debitAccounts: OwnTransferDebitResolver,
      scheduleService: ScheduleServiceResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'confirmation',
    component: OwnConfirmationComponent,
    data: {
      view: EOwnTransferViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'st-confirmation',
    component: OwnConfirmationComponent,
    data: {
      view: EOwnTransferViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'voucher',
    component: OwnVoucherComponent,
    data: {
      view: EOwnTransferViewMode.DEFAULT
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'stm-voucher',
    component: OwnVoucherComponent,
    data: {
      view: EOwnTransferViewMode.SIGNATURE_TRACKING_MODIFY,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'th-voucher',
    component: OwnVoucherComponent,
    data: {
      view: EOwnTransferViewMode.TRANSACTION_HISTORY,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'st-voucher',
    component: OwnVoucherComponent,
    data: {
      view: EOwnTransferViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'st-operation',
    component: OwnVoucherComponent,
    data: {
      view: EOwnTransferViewMode.SIGNATURE_TRACKING_OPERATION,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferOwnRoutingModule { }
