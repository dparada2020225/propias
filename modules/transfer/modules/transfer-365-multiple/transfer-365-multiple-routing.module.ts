import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tm365HomeComponent } from './components/tm365-home/tm365-home.component';
import { Tm365ConfirmationComponent } from './components/tm365-confirmation/tm365-confirmation.component';
import { Tm365VoucherComponent } from './components/tm365-voucher/tm365-voucher.component';
import { GetSourceAccountResolver } from '../../../../resolvers/get-source-account.resolver';
import { ETM365View } from './enum/view.enum';
import { GetAchBiesGeneralParametersResolver } from '../../../../resolvers/get-ach-bies-general-parameters.resolver';
import routeProtectedJson from './config/route-protected.json';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';

const routes: Routes = [
  {
    path: '',
    component: Tm365HomeComponent,
    data: {
      navigateProtection: routeProtectedJson,
      service: 'ach-transf'
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      sourceAccountList: GetSourceAccountResolver,
      settings: GetAchBiesGeneralParametersResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'confirmation',
    component: Tm365ConfirmationComponent,
    data: {
      navigateProtection: routeProtectedJson,
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
    component: Tm365VoucherComponent,
    data: {
      view: ETM365View.DEFAULT,
      navigateProtection: routeProtectedJson,
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
export class Transfer365MultipleRoutingModule { }
