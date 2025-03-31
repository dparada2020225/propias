import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import { ScheduleServiceResolver } from 'src/app/resolvers/schedule-service.resolver';
import { ThHomeComponent } from './components/th-home/th-home.component';
import { ETHScheduleService, ETransactionHistoryViews } from './enums/transaction-history.enum';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';

const routes: Routes = [
  {
    path: '',
    component: ThHomeComponent,
    data: {
      view: ETransactionHistoryViews.HOME,
      service: ETHScheduleService.HISTORY,

    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      scheduleService: ScheduleServiceResolver,
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
    component: ThHomeComponent,
    data: {
      view: ETransactionHistoryViews.CONSULT
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionHistoryRoutingModule { }
