import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { B2bPaymentHomeComponent } from './components/b2b-payment-home/b2b-payment-home.component';
import { EB2bPaymentService, EB2bPaymentView } from './enum/b2b-payment-view.enum';
import { B2bPaymentVoucherComponent } from './components/b2b-payment-voucher/b2b-payment-voucher.component';
import { B2bPaymentFormComponent } from './components/b2b-payment-form/b2b-payment-form.component';
import {
  B2bPaymentConfirmationComponent
} from './components/b2b-payment-confirmation/b2b-payment-confirmation.component';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import { B2bPaymentLoanAccountsResolver } from './resolvers/b2b-payment-loan-accounts.resolver';
import { B2bPaymentSourceAccountsResolver } from './resolvers/b2b-payment-source-accounts.resolver';
import { ScheduleServiceResolver } from '../../../../resolvers/schedule-service.resolver';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import { MenuPermissionEvaluatorGuard } from 'src/app/guards/menu-permission-evaluator.guard';

const routes: Routes = [
  {
    path: '',
    component: B2bPaymentHomeComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      b2bAccountList: B2bPaymentLoanAccountsResolver,
      scheduleService: ScheduleServiceResolver,
    },
    data: {
      view: EB2bPaymentView.DEFAULT,
      service: EB2bPaymentService.PAYMENT,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
      NavigationProtectedGuard,
    ]
  },
  {
    path: 'form',
    component: B2bPaymentFormComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      sourceAccounts: B2bPaymentSourceAccountsResolver,
    },
    data: {
      view: EB2bPaymentView.DEFAULT,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ]
  },
  {
    path: 'confirmation',
    component: B2bPaymentConfirmationComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    data: {
      view: EB2bPaymentView.DEFAULT,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ]
  },
  {
    path: 'voucher',
    component: B2bPaymentVoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    data: {
      view: EB2bPaymentView.DEFAULT,
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
export class B2bPaymentRoutingModule { }
