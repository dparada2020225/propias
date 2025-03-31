import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import { DonationHomeComponent } from './components/donation-home/donation-home.component';
import { EDonationSchduleService, EDonationViewMode } from './enum/donation.enum';
import { FundationAccountsResolver } from './resolver/fundation-accounts.resolver';
import { DebitAccountsResolver } from './resolver/source-accounts.resolver';
import { ScheduleServiceResolver } from '../../../../resolvers/schedule-service.resolver';
import { DonationVoucherComponent } from './components/donation-voucher/donation-voucher.component';
import { DonationConfirmationComponent } from './components/donation-confirmation/donation-confirmation.component';
import navigationProtectionForSignatureTracking from '../../../../../assets/data/navigation-protenction-signature-tracking.json';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';


const routes: Routes = [
  {
    path: '',
    component: DonationHomeComponent,
    data: {
      service: EDonationSchduleService.DONATION,
      view: EDonationViewMode.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      debitAccounts: DebitAccountsResolver,
      fundationAccounts: FundationAccountsResolver,
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
    path: 'voucher',
    component: DonationVoucherComponent,
    data: {
      view: EDonationViewMode.DEFAULT,
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
    path: 'confirmation',
    component: DonationConfirmationComponent,
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
    path: 'st-home',
    component: DonationHomeComponent,
    data: {
      service: EDonationSchduleService.DONATION,
      view: EDonationViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      debitAccounts: DebitAccountsResolver,
      fundationAccounts: FundationAccountsResolver,
      scheduleService: ScheduleServiceResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ]
  },
  {
    path: 'st-confirmation',
    component: DonationConfirmationComponent,
    data: {
      view: EDonationViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
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
    path: 'stm-voucher',
    component: DonationVoucherComponent,
    data: {
      view: EDonationViewMode.SIGNATURE_TRACKING,
      navigateProtection: navigationProtectionForSignatureTracking,
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
    path: 'th-voucher',
    data: {
      view: EDonationViewMode.TRANSACTION_HISTORY,
    },
    component: DonationVoucherComponent,
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
    data: {
      view: EDonationViewMode.SIGNATURE_TRACKING_DETAIL,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    component: DonationVoucherComponent,
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
    path: 'st-operation',
    data: {
      view: EDonationViewMode.SIGNATURE_TRACKING_OPERATION,
      navigateProtection: navigationProtectionForSignatureTracking,
    },
    component: DonationVoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
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
export class DonationRoutingModule { }
