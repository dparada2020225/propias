import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TmAchUniHomeComponent } from './components/tm-ach-uni-home/tm-ach-uni-home.component';
import { GetSourceAccountResolver } from 'src/app/resolvers/get-source-account.resolver';
import { TmAchUniConfirmationComponent } from './components/tm-ach-uni-confirmation/tm-ach-uni-confirmation.component';
import { TmAchUniVoucherComponent } from './components/tm-ach-uni-voucher/tm-ach-uni-voucher.component';
import { ETMAchUniView } from './enum/ach-uni-view.enum';
import { AchUniTermsConditionsComponent } from '../transfer-ach-uni/components/ach-uni-terms-conditions/ach-uni-terms-conditions.component';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { AchUniTermsConditionsVerifyGuard } from './guards/ach-uni-terms-conditions-verify.guard';
import { TransferAchResolver } from '../transfer-ach/resolvers/transfer-ach.resolver';
import { EAchScheduleServices } from '../transfer-ach/enum/transfer-ach.enum';
import { StAchUniOperationsComponent } from './components/st-ach-uni-operations/st-ach-uni-operations.component';
import { GetAchUniLoteDetailResolver } from './resolvers/get-ach-uni-lote-detail.resolver';
import { KeepAlive2Resolver } from '../../../../resolvers/keep-alive2.resolver';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import routeProtectedJson from './config/route-protected.json';
import { VerifyTermsConditionsGuard } from './guards/verify-terms-conditions.guard';

const routes: Routes = [
  {
    path: '',
    component: TmAchUniHomeComponent,
    data:{
      service: EAchScheduleServices.ACH_TRANSFER
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      targetAccountList: TransferAchResolver,
      sourceAccountList: GetSourceAccountResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
      // AchUniTermsConditionsVerifyGuard
    ],
    canDeactivate: [VerifyTermsConditionsGuard]
  },
  {
    path: 'confirmation',
    component: TmAchUniConfirmationComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
  },
  {
    path: 'voucher',
    component: TmAchUniVoucherComponent,
    data: {
      view: ETMAchUniView.DEFAULT,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
  },
  {
    path: 'terms-conditions',
    component: AchUniTermsConditionsComponent,
    data: {
      view: ETMAchUniView.TERMS_CONDITION_MULTIPLE,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'st/detail',
    component: StAchUniOperationsComponent,
    data: {
      view: ETMAchUniView.ST_DETAIL_,
      navigateProtection: routeProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      lote: GetAchUniLoteDetailResolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'st/operation',
    component: StAchUniOperationsComponent,
    data: {
      view: ETMAchUniView.ST_OPERATION,
      navigateProtection: routeProtectedJson,
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      lote: GetAchUniLoteDetailResolver,
    },
    canActivate: [NavigationProtectedGuard, LoggedGuard, RequireSecurityProfileGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferAchUniMultipleRoutingModule { }
