import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { T365HomeComponent } from './components/t365-home/t365-home.component';
import { T365ConfirmationComponent } from './components/t365-confirmation/t365-confirmation.component';
import { T365VoucherComponent } from './components/t365-voucher/t365-voucher.component';
import { GetSourceAccountResolver } from '../../../../resolvers/get-source-account.resolver';
import { ET365View } from './enum/view.enum';
import { GetAchBiesGeneralParametersResolver } from '../../../../resolvers/get-ach-bies-general-parameters.resolver';
import { TransferAchResolver } from '../transfer-ach/resolvers/transfer-ach.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { T365TermsConditionComponent } from './components/t365-terms-condition/t365-terms-condition.component';
import { AchUniLimitTrasnferUserResolver } from '../transfer-ach-uni/resolvers/ach-uni-limit-trasnfer-user.resolver';
import {
  AchUniTransferLimitClientCurrencyResolver
} from '../transfer-ach-uni/resolvers/ach-uni-transfer-limit-client-currency.resolver';
import routeProtectedJson from './config/route-protected.json';

const routes: Routes = [
  {
    path: '',
    component: T365HomeComponent,
    data: {
      service: 'ach-transf',
      navigateProtection: routeProtectedJson,
      customPathToFind: '365',
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      targetAccountList: TransferAchResolver,
      sourceAccountList: GetSourceAccountResolver,
      settings: GetAchBiesGeneralParametersResolver,
      getLimitUser: AchUniLimitTrasnferUserResolver,
      getLimitCurrencyTypeClient: AchUniTransferLimitClientCurrencyResolver,
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
    component: T365ConfirmationComponent,
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
    path: 'terms-condition',
    component: T365TermsConditionComponent,
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
    component: T365VoucherComponent,
    data: {
      view: ET365View.DEFAULT,
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
    path: 'st/detail',
    component: T365VoucherComponent,
    data: {
      view: ET365View.ST_DETAIL,
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
    path: 'st/operation',
    component: T365VoucherComponent,
    data: {
      view: ET365View.ST_OPERATION,
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
export class Transfer365RoutingModule { }
