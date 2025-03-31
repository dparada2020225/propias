import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmT365mHomeComponent } from './components/am-t365m-home/am-t365m-home.component';
import { GetSourceAccountResolver } from '../../../../resolvers/get-source-account.resolver';
import { GetAffiliationResolver } from './resolvers/get-affiliation.resolver';
import { ET365MView } from './enum/view.enum';
import { AmT365mVoucherComponent } from './components/am-m365-voucher/am-t365m-voucher.component';
import { AmM365AddComponent } from './components/affiliate/am-m365-add.component';
import { AmM365DisaffiliateComponent } from './components/disaffiliate/am-m365-disaffiliate.component';
import { AmM365UpdateComponent } from './components/update/am-m365-update.component';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import routesProtectedJson from './config/route-protected.json';

const routes: Routes = [
  {
    path: '',
    component: AmT365mHomeComponent,
    data: {
      navigateProtection: routesProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      sourceAccountList: GetSourceAccountResolver,
      affiliation: GetAffiliationResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
    ],
  },
  {
    path: 'affiliate',
    component: AmM365AddComponent,
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
    path: 'affiliate/voucher',
    component: AmT365mVoucherComponent,
    data: {
      view: ET365MView.AFFILIATE,
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
    path: 'disaffiliate',
    component: AmM365DisaffiliateComponent,
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
    path: 'disaffiliate/voucher',
    component: AmT365mVoucherComponent,
    data: {
      view: ET365MView.DISAFFILIATE,
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
    path: 'update',
    component: AmM365UpdateComponent,
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
    path: 'update/voucher',
    component: AmT365mVoucherComponent,
    data: {
      view: ET365MView.UPDATE,
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
export class T365MembershipRoutingModule { }
