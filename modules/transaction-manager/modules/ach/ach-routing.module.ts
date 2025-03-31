import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TmAchHomeComponent } from './components/tm-ach-home/tm-ach-home.component';
import { TmAchLookUpComponent } from './components/tm-ach-look-up/tm-ach-look-up.component';
import { ETMConsultACHView } from './enum/view.enum';
import { TmAchConsultResolver } from './resolvers/tm-ach-consult.resolver';
import {
  TmAchTransactionDetailComponent
} from './components/tm-ach-transaction-detail/tm-ach-transaction-detail.component';
import { TmAchSignatoryComponent } from './components/tm-ach-signatory/tm-ach-signatory.component';
import { TmAchLoteComponent } from './components/tm-ach-lote/tm-ach-lote.component';
import { GetAchBiesGeneralParametersResolver } from '../../../../resolvers/get-ach-bies-general-parameters.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import routesProtectedJson from './config/route-protected.json';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';

const routes: Routes = [
  {
    path: '',
    component: TmAchHomeComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
    ],
  },
  {
    path: 'consult/atomic',
    component: TmAchLookUpComponent,
    data: {
      view: ETMConsultACHView.ATOMIC,
      navigateProtection: routesProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      transactionList: TmAchConsultResolver,
      generalParameters: GetAchBiesGeneralParametersResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'consult/multiple',
    component: TmAchLookUpComponent,
    data: {
      view: ETMConsultACHView.MULTIPLE,
      navigateProtection: routesProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      transactionList: TmAchConsultResolver,
      generalParameters: GetAchBiesGeneralParametersResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'detail',
    component: TmAchTransactionDetailComponent,
    data: {
      navigateProtection: routesProtectedJson,
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
    path: 'signatures',
    component: TmAchSignatoryComponent,
    data: {
      navigateProtection: routesProtectedJson,
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
    path: 'lote',
    component: TmAchLoteComponent,
    data: {
      navigateProtection: routesProtectedJson,
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
export class AchRoutingModule { }
