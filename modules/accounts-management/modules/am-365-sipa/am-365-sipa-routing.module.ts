import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmS365HomeComponent } from './components/am-s365-home/am-s365-home.component';
import { AmS365AssociatedAccountResolver } from './resolvers/am-s365-associated-account.resolver';
import { MenuLicensesResolver } from '../../../../resolvers/menu-licenses.resolver';
import { AmS365AddComponent } from './components/add/am-s365-add/am-s365-add.component';
import { AmS365ConfirmComponent } from './components/add/am-s365-confirm/am-s365-confirm.component';
import { AmS365VoucherComponent } from './components/am-s365-voucher/am-s365-voucher.component';
import { EAMS365View } from './enum/view.enum';
import { AmS365UpdateComponent } from './components/update/am-s365-update/am-s365-update.component';
import {
  AmS365UpdateConfirmComponent
} from './components/update/am-s365-update-confirm/am-s365-update-confirm.component';
import { AmS365RemoveComponent } from './components/remove/am-s365-remove/am-s365-remove.component';
import {
  AmS365RemoveConfirmComponent
} from './components/remove/am-s365-remove-confirm/am-s365-remove-confirm.component';
import { AmS365ListOfCountriesResolver } from './resolvers/am-s365-countries.resolver';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import routesProtectedJson from './config/route-protected.json';
import { S365GetTermAndConditionsResolver } from '../../resolvers/s365-get-term-and-conditions.resolver';
import { TERM_CONDITIONS_SIPA } from './enum/general.enum';

const routes: Routes = [
  {
    path: '',
    component: AmS365HomeComponent,
    data: {
      service: 'ach-transf',
      serviceType: TERM_CONDITIONS_SIPA,
      navigateProtection: routesProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccountList: AmS365AssociatedAccountResolver,
      menuOptionsLicenses: MenuLicensesResolver,
      termsAndCondition: S365GetTermAndConditionsResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
    ],
  },
  {
    path: 'add',
    component: AmS365AddComponent,
    data: {
      navigateProtection: routesProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      banks: AmS365ListOfCountriesResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'add/confirmation',
    component: AmS365ConfirmComponent,
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
    path: 'add/voucher',
    component: AmS365VoucherComponent,
    data: {
      view: EAMS365View.ADD,
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
    component: AmS365UpdateComponent,
    data: {
      navigateProtection: routesProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      banks: AmS365ListOfCountriesResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],

  },
  {
    path: 'update/confirmation',
    component: AmS365UpdateConfirmComponent,
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
    component: AmS365VoucherComponent,
    data: {
      view: EAMS365View.UPDATE,
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
    path: 'remove',
    component: AmS365RemoveComponent,
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
    path: 'remove/confirmation',
    component: AmS365RemoveConfirmComponent,
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
    path: 'remove/voucher',
    component: AmS365VoucherComponent,
    data: {
      view: EAMS365View.REMOVE,
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
export class Am365SipaRoutingModule { }
