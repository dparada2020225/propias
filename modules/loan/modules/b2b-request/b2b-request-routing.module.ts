import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { B2bRequestHomeComponent } from './components/b2b-request-home/b2b-request-home.component';
import { EB2bRequestView } from './enum/b2b-request-view.enum';
import { B2bRequestConfigurationResolver } from './resolver/b2b-request-configuration.resolver';
import { B2bRequestFixedDeadlinesResolver } from './resolver/b2b-request-fixed-deadlines.resolver';
import { B2bRequestTargetAccountsResolver } from './resolver/b2b-request-target-accounts.resolver';
import { ScheduleServiceResolver } from '../../../../resolvers/schedule-service.resolver';
import { EB2bRequestService } from './enum/b2b-request-service.enum';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import { B2bRequestVoucherComponent } from './components/b2b-request-voucher/b2b-request-voucher.component';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { MenuPermissionEvaluatorGuard } from 'src/app/guards/menu-permission-evaluator.guard';
import { B2bPaymentSourceAccountsResolver } from '../b2b-payment/resolvers/b2b-payment-source-accounts.resolver';

const routes: Routes = [
  {
    path: '',
    data: {
      view: EB2bRequestView.DEFAULT,
      service: EB2bRequestService.REQUEST,
    },
    component: B2bRequestHomeComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      configuration: B2bRequestConfigurationResolver,
      fixedDeadlines: B2bRequestFixedDeadlinesResolver,
      sourceAccounts: B2bPaymentSourceAccountsResolver,
      targetAccounts: B2bRequestTargetAccountsResolver,
      scheduleService: ScheduleServiceResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
      MenuPermissionEvaluatorGuard
    ]
  },
  {
    path: 'voucher',
    component: B2bRequestVoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    data: {
      view: EB2bRequestView.DEFAULT,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B2bRequestRoutingModule { }
