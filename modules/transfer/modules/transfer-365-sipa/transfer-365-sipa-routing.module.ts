import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { S365HomeComponent } from './components/s365-home/s365-home.component';
import { S365VoucherComponent } from './components/s365-voucher/s365-voucher.component';
import { S365ConfirmationComponent } from './components/s365-confirmation/s365-confirmation.component';
import { GetSourceAccountResolver } from '../../../../resolvers/get-source-account.resolver';
import { ES365View } from './enum/view.enum';
import {
  AmS365AssociatedAccountResolver
} from '../../../accounts-management/modules/am-365-sipa/resolvers/am-s365-associated-account.resolver';
import { S365GetReasonResolver } from './resolvers/s365-get-reason.resolver';
import { AchUniLimitTrasnferUserResolver } from '../transfer-ach-uni/resolvers/ach-uni-limit-trasnfer-user.resolver';
import { GetAchBiesGeneralParametersResolver } from '../../../../resolvers/get-ach-bies-general-parameters.resolver';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import { ES365UrlCollection } from './enum/url-collection.enum';
import { S365TransferRouteProtected } from './enum/route-protected.enum';
import routeProtectedJson from './config/route-protected.json';
import { S365TermConditionsGuard } from './guards/s365-term-conditions.guard';
import { S365TermsComponent } from './components/s365-terms/s365-terms.component';
import { GetTermsConditionsInfoResolver } from './resolvers/get-terms-conditions-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: S365HomeComponent,
    data: {
      protectedParameter: S365TransferRouteProtected.TERMS_CONDITION,
      routeForTermsCondition: ES365UrlCollection.TERMS_CONDITION,
      navigateProtection: routeProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      targetAccountList: AmS365AssociatedAccountResolver,
      sourceAccountList: GetSourceAccountResolver,
      reason: S365GetReasonResolver,
      getLimitUser: AchUniLimitTrasnferUserResolver,
      settings: GetAchBiesGeneralParametersResolver,
      termsConditionInfo: GetTermsConditionsInfoResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
      S365TermConditionsGuard,
    ],
  },
  {
    path: 'confirmation',
    component: S365ConfirmationComponent,
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
    component: S365VoucherComponent,
    data: {
      view: ES365View.DEFAULT,
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
    component: S365TermsComponent,
    data: {
      navigateProtection: routeProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      termsConditionInfo: GetTermsConditionsInfoResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,

    ],
  },
  {
    path: 'st/detail',
    component: S365VoucherComponent,
    data: {
      view: ES365View.ST_DETAIL,
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
    component: S365VoucherComponent,
    data: {
      view: ES365View.ST_OPERATIONS,
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
export class Transfer365SipaRoutingModule { }
