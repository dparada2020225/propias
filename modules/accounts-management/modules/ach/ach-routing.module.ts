import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmAchHomeComponent } from './components/am-ach-home/am-ach-home.component';
import {
  T365TargetAccountResolver
} from '../../../transfer/modules/transfer-365/resolvers/t365-target-account.resolver';
import { MenuLicensesResolver } from '../../../../resolvers/menu-licenses.resolver';
import { AmAchDetailAccountComponent } from './components/am-ach-detail-account/am-ach-detail-account.component';
import { AmAchCreateComponent } from './components/create/am-ach-create/am-ach-create.component';
import {
  AmAchCreateConfirmationComponent
} from './components/create/am-ach-create-confirmation/am-ach-create-confirmation.component';
import { AmAchUpdateComponent } from './components/update/am-ach-update/am-ach-update.component';
import {
  AmAchUpdateConfirmationComponent
} from './components/update/am-ach-update-confirmation/am-ach-update-confirmation.component';
import { AcAchDeleteComponent } from './components/delete/ac-ach-delete/ac-ach-delete.component';
import {
  AcAchDeleteConfirmationComponent
} from './components/delete/ac-ach-delete-confirmation/ac-ach-delete-confirmation.component';
import { GetAchBiesGeneralParametersResolver } from '../../../../resolvers/get-ach-bies-general-parameters.resolver';
import { AmAchVoucherComponent } from './components/am-ach-voucher/am-ach-voucher.component';
import { EAMACHView } from './enum/view.enum';
import { EAchScheduleServices } from 'src/app/modules/transfer/modules/transfer-ach/enum/transfer-ach.enum';
import {
  GetListPurposeAchUniResolver
} from '../../../transfer/modules/transfer-ach-uni/resolvers/get-list-purpose-ach-uni.resolver';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { NavigationProtectedGuard } from '../../../../guards/navigation-protected.guard';
import routeProtectedJson from './config/route-protected.json';


const routes: Routes = [
  {
    path: '',
    component: AmAchHomeComponent,
    data: {
      service: EAchScheduleServices.ACH,
      navigateProtection: routeProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccounts: T365TargetAccountResolver,
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
    component: AmAchDetailAccountComponent,
    data: {
      navigateProtection: routeProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      getPurposeList: GetListPurposeAchUniResolver,
      generalParameters: GetAchBiesGeneralParametersResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'create',
    component: AmAchCreateComponent,
    data: {
      navigateProtection: routeProtectedJson,
    },
    resolve: {
      generalParameters: GetAchBiesGeneralParametersResolver,
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'create/confirmation',
    component: AmAchCreateConfirmationComponent,
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
    path: 'create/voucher',
    component: AmAchVoucherComponent,
    data: {
      view: EAMACHView.CREATE,
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
    path: 'update',
    component: AmAchUpdateComponent,
    data: {
      navigateProtection: routeProtectedJson,
    },
    resolve: {
      generalParameters: GetAchBiesGeneralParametersResolver,
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'update/confirmation',
    component: AmAchUpdateConfirmationComponent,
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
    path: 'update/voucher',
    component: AmAchVoucherComponent,
    data: {
      view: EAMACHView.UPDATE,
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
    path: 'delete',
    component: AcAchDeleteComponent,
    data: {
      navigateProtection: routeProtectedJson,
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
    path: 'delete/confirmation',
    component: AcAchDeleteConfirmationComponent,
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
    path: 'delete/voucher',
    component: AmAchVoucherComponent,
    data: {
      view: EAMACHView.DELETE,
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
export class AchRoutingModule { }
