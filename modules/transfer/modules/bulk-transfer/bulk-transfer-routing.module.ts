import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import { ScheduleServiceResolver } from 'src/app/resolvers/schedule-service.resolver';
import { BtConfirmationComponent } from './components/bt-confirmation/bt-confirmation.component';
import { BtVoucherComponent } from './components/bt-voucher/bt-voucher.component';
import { BtHomeComponent } from './components/bt-home/bt-home.component';
import { EBTScheduleService, EBViewMode } from './enum/bt-view.enum';
import navigationProtectionForSignatureTracking from "./../../../../../assets/data/navigation-protenction-signature-tracking.json";
import { TransferAchResolver } from '../transfer-ach/resolvers/transfer-ach.resolver';
import { AchConfigurationResolver } from '../transfer-ach/resolvers/configuration.resolver';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { AchSourceAccountsResolver } from '../transfer-ach/resolvers/ach-source-accounts.resolver';

const routes: Routes = [
  {
    path: '',
    component: BtHomeComponent,
    data: {
      service: EBTScheduleService.BULK_TRANSFER,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      sourceAccounts: AchSourceAccountsResolver,
      associatedAccounts: TransferAchResolver,
      scheduleService: ScheduleServiceResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
      MenuPermissionEvaluatorGuard,
    ]
  },
  {
    path: 'confirmation',
    component: BtConfirmationComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccounts: TransferAchResolver,
      settings: AchConfigurationResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ]
  },
  {
    path: 'voucher',
    component: BtVoucherComponent,
    data: {
      view: EBViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ]
  },
  {
    path: 'st-voucher',
    component: BtVoucherComponent,
    data: {
      view: EBViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccounts: TransferAchResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ]
  },
  {
    path: 'th-voucher',
    component: BtVoucherComponent,
    data: {
      view: EBViewMode.HISTORY_TRANSACTION,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccounts: TransferAchResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ]
  },
  {
    path: 'st-operation',
    component: BtVoucherComponent,
    data: {
      view: EBViewMode.SIGNATURE_TRACKING_OPERATION,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      settings: AchConfigurationResolver,
      associatedAccounts: TransferAchResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkTransferRoutingModule { }
