import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { B2bConsultationHomeComponent } from './components/b2b-consultation-home/b2b-consultation-home.component';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { ScheduleServiceResolver } from '../../../../resolvers/schedule-service.resolver';
import { EB2bConsultationService } from './enum/b2b-consultation-service.enum';
import { B2bConsultationListAccountsResolver } from './resolver/b2b-consultation-list-accounts.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';

const routes: Routes = [
  {
    path: '',
    component: B2bConsultationHomeComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      scheduleService: ScheduleServiceResolver,
      b2bAccountList: B2bConsultationListAccountsResolver,
    },
    data: {
      service: EB2bConsultationService.CONSULTATION,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B2bConsultationRoutingModule { }
