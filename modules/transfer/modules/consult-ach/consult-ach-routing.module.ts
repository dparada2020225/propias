import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultAchHomeComponent } from './components/consult-ach-home/consult-ach-home.component';
import { ConsultAchDetailTransactionComponent } from './components/consult-ach-detail-transaction/consult-ach-detail-transaction.component';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import {NavigationProtectedGuard} from "../../../../guards/navigation-protected.guard";
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';

const routes: Routes = [
  {
    path: '',
    component: ConsultAchHomeComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'detail',
    component: ConsultAchDetailTransactionComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultAchRoutingModule { }
