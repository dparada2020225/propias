import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectionsComponent } from './components/projections/projections.component';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { SecurityNavigationResolver } from '../../resolvers/security-navigation.resolver';
import { TermDepositComponent } from './components/term-deposit/term-deposit.component';

const routes: Routes = [
  {
    path: 'projections',
    component: ProjectionsComponent,
    canActivate: [PermissionsGuard],
    resolve: {
      securityResolver: SecurityNavigationResolver
    }
  },
  {
    path: 'fixed-term-detail',
    component: TermDepositComponent,
    canActivate: [PermissionsGuard],
    resolve: {
      securityResolver: SecurityNavigationResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentsRoutingModule { }
