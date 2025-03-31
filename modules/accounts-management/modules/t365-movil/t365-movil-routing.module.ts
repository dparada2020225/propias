import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmM365HomeComponent } from './components/am-m365-home/am-m365-home.component';
import { AmM365CreateComponent } from './components/create/am-m365-create/am-m365-create.component';
import { AmM365ConfirmationComponent } from './components/create/am-m365-confirmation/am-m365-confirmation.component';
import { AmM365DeleteComponent } from './components/delete/am-m365-delete/am-m365-delete.component';
import {
  AmM365DeleteConfirmationComponent
} from './components/delete/am-m365-delete-confirmation/am-m365-delete-confirmation.component';
import { AmM365UpdateComponent } from './components/update/am-m365-update/am-m365-update.component';
import {
  AmM365UpdateConfirmationComponent
} from './components/update/am-m365-update-confirmation/am-m365-update-confirmation.component';
import { Am365TargetAccountResolver } from './resolvers/am-365-target-account.resolver';
import { MenuLicensesResolver } from '../../../../resolvers/menu-licenses.resolver';
import { GetAchBiesGeneralParametersResolver } from '../../../../resolvers/get-ach-bies-general-parameters.resolver';
import { AMT365View } from './enum/view.enum';
import { AmM365VoucherComponent } from './components/am-m365-voucher/am-m365-voucher.component';
import { AmM365DetailAccountComponent } from './components/am-m365-detail-account/am-m365-detail-account.component';
import routesProtectedJson from './config/route-protected.json';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import { ACH_SERVICE_CODE } from '../../interfaces/am-account-list.interface';

const routes: Routes = [
  {
    path: '',
    component: AmM365HomeComponent,
    data: {
      service: ACH_SERVICE_CODE,
      navigateProtection: routesProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccounts: Am365TargetAccountResolver,
      menuOptionsLicenses: MenuLicensesResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
    ],
  },
  {
    path: 'detail',
    component: AmM365DetailAccountComponent,
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
    path: 'create',
    component: AmM365CreateComponent,
    data: {
      navigateProtection: routesProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      generalParameters: GetAchBiesGeneralParametersResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'create/confirmation',
    component: AmM365ConfirmationComponent,
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
    path: 'create/voucher',
    component: AmM365VoucherComponent,
    data: {
      navigateProtection: routesProtectedJson,
      view: AMT365View.CREATE,
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
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      generalParameters: GetAchBiesGeneralParametersResolver,
    },
    data: {
      navigateProtection: routesProtectedJson,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'update/confirmation',
    component: AmM365UpdateConfirmationComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    data: {
      navigateProtection: routesProtectedJson,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'update/voucher',
    component: AmM365VoucherComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    data: {
      view: AMT365View.UPDATE,
      navigateProtection: routesProtectedJson,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'delete',
    component: AmM365DeleteComponent,
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
    path: 'delete/confirmation',
    component: AmM365DeleteConfirmationComponent,
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
    path: 'delete/voucher',
    component: AmM365VoucherComponent,
    data: {
      view: AMT365View.DELETE,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T365MovilRoutingModule { }
