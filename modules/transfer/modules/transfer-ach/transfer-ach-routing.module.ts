import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import { AchConfirmationComponent } from './components/transaction/ach-confirmation/ach-confirmation.component';
import { AchFormComponent } from './components/transaction/ach-form/ach-form.component';
import { AchVoucherComponent } from './components/transaction/ach-voucher/ach-voucher.component';
import { EAchScheduleServices, EACHTransactionViewMode } from './enum/transfer-ach.enum';
import { AchHomeComponent } from './components/ach-home/ach-home.component';
import { TransferAchResolver } from './resolvers/transfer-ach.resolver';
import { ScheduleServiceResolver } from '../../../../resolvers/schedule-service.resolver';
import { AchConfigurationResolver } from './resolvers/configuration.resolver';
import { CommissionMessagesResolver } from './resolvers/commission-message.resolver';
import { AchSourceAccountsResolver } from './resolvers/ach-source-accounts.resolver';
import navigationProtectionForSignatureTracking from '../../../../../assets/data/navigation-protenction-signature-tracking.json';
import { AchCreateFormComponent } from './components/crud/create/ach-create-form/ach-create-form.component';
import { AchCreateVoucherComponent } from './components/crud/create/ach-create-voucher/ach-create-voucher.component';
import { AchCreateConfirmComponent } from './components/crud/create/ach-create-confirm/ach-create-confirm.component';
import { AchDeleteComponent } from './components/crud/delete/ach-delete/ach-delete.component';
import { AchUpdateFormComponent } from './components/crud/update/ach-update-form/ach-update-form.component';
import { AchUpdateVoucherComponent } from './components/crud/update/ach-update-voucher/ach-update-voucher.component';
import { AchUpdateConfirmComponent } from './components/crud/update/ach-update-confirm/ach-update-confirm.component';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { MenuLicensesResolver } from '../../../../resolvers/menu-licenses.resolver';

const routes: Routes = [
  {
    path: '',
    component: AchHomeComponent,
    data: {
      service: EAchScheduleServices.ACH,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccounts: TransferAchResolver,
      scheduleService: ScheduleServiceResolver,
      menuOptionsLicenses: MenuLicensesResolver,
      commissionMessages: CommissionMessagesResolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard, MenuPermissionEvaluatorGuard],
  },
  {
    path: 'transfer-form',
    component: AchFormComponent,
    data: {
      view: EACHTransactionViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      sourceAccounts: AchSourceAccountsResolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'voucher',
    component: AchVoucherComponent,
    data: {
      view: EACHTransactionViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'confirmation',
    component: AchConfirmationComponent,
    data: {
      view: EACHTransactionViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      settings: AchConfigurationResolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'st-home',
    component: AchFormComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      sourceAccounts: AchSourceAccountsResolver,
      associatedAccounts: TransferAchResolver,
    },
    data: {
      view: EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'stm-voucher',
    component: AchVoucherComponent,
    data: {
      view: EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'st-confirmation',
    component: AchConfirmationComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    data: {
      view: EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'st-operation',
    component: AchVoucherComponent,
    data: {
      view: EACHTransactionViewMode.SIGNATURE_TRACKING_OPERATION,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      settings: AchConfigurationResolver,
      associatedAccounts: TransferAchResolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'st-voucher',
    component: AchVoucherComponent,
    data: {
      view: EACHTransactionViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccounts: TransferAchResolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'th-voucher',
    component: AchVoucherComponent,
    data: {
      view: EACHTransactionViewMode.TRANSACTION_HISTORY,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccounts: TransferAchResolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'create',
    component: AchCreateFormComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      settings: AchConfigurationResolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'create-voucher',
    component: AchCreateVoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'create-confirm',
    component: AchCreateConfirmComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'delete',
    component: AchDeleteComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'update',
    component: AchUpdateFormComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'update-voucher',
    component: AchUpdateVoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'update-confirm',
    component: AchUpdateConfirmComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferAchRoutingModule {}
