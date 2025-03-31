import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { M365HomeComponent } from './components/m365-home/m365-home.component';
import { M365ConfirmationComponent } from './components/m365-confirmation/m365-confirmation.component';
import { M365VoucherComponent } from './components/m365-voucher/m365-voucher.component';
import { GetSourceAccountResolver } from '../../../../resolvers/get-source-account.resolver';
import { MT365View } from './enum/view.enum';
import {
  Am365TargetAccountResolver
} from '../../../accounts-management/modules/t365-movil/resolvers/am-365-target-account.resolver';
import { GetAchBiesGeneralParametersResolver } from '../../../../resolvers/get-ach-bies-general-parameters.resolver';
import routeProtectedJson from './config/route-protected.json';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import { M365TermsConditionComponent } from './components/m365-terms-condition/m365-terms-condition.component';
import { AchUniLimitTrasnferUserResolver } from '../transfer-ach-uni/resolvers/ach-uni-limit-trasnfer-user.resolver';

const routes: Routes = [
  {
    path: '',
    component: M365HomeComponent,
    data: {
      navigateProtection: routeProtectedJson,
      customPathToFind: '365',
      view: MT365View.DEFAULT,
    },
    resolve: {
      sourceAccountList: GetSourceAccountResolver,
      settings: GetAchBiesGeneralParametersResolver,
      beneficiaryRegistered: Am365TargetAccountResolver,
      getLimitUser: AchUniLimitTrasnferUserResolver,
      keepAlive2Resolver: KeepAlive2Resolver,
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
    component: M365ConfirmationComponent,
    data: {
      navigateProtection: routeProtectedJson,
      view: MT365View.DEFAULT,
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
    component: M365VoucherComponent,
    data: {
      view: MT365View.DEFAULT,
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
    component: M365VoucherComponent,
    data: {
      view: MT365View.ST_DETAIL,
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
    component: M365VoucherComponent,
    data: {
      view: MT365View.ST_OPERATION,
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
    component: M365TermsConditionComponent,
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
    path: 'st/modify',
    component: M365HomeComponent,
    data: {
      navigateProtection: routeProtectedJson,
      view: MT365View.ST_MODIFY,
    },
    resolve: {
      sourceAccountList: GetSourceAccountResolver,
      settings: GetAchBiesGeneralParametersResolver,
      beneficiaryRegistered: Am365TargetAccountResolver,
      getLimitUser: AchUniLimitTrasnferUserResolver,
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'st/confirmation',
    component: M365ConfirmationComponent,
    data: {
      navigateProtection: routeProtectedJson,
      view: MT365View.ST_MODIFY,
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
    path: 'st/voucher',
    component: M365VoucherComponent,
    data: {
      view: MT365View.ST_MODIFY,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Transfer365MovilRoutingModule { }
