import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import { StHomeComponent } from './components/st-home/st-home.component';
import { TransferAchResolver } from '../../../transfer/modules/transfer-ach/resolvers/transfer-ach.resolver';
import { StSignaturesComponent } from './components/st-signatures/st-signatures.component';
import { AchConfigurationResolver } from 'src/app/modules/transfer/modules/transfer-ach/resolvers/configuration.resolver';
import { MenuPermissionEvaluatorGuard } from '../../../../guards/menu-permission-evaluator.guard';
import { environment } from '../../../../../environments/environment';
import { EProfile } from '../../../../enums/profile.enum';

const routes: Routes = [
  {
    path: '',
    component: StHomeComponent,
    data: {
      isSignatureTrackingAchServiceEnabled: environment.profile === EProfile.HONDURAS
    },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
      associatedAccounts: TransferAchResolver,
      settings: AchConfigurationResolver,
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      MenuPermissionEvaluatorGuard,
    ],
  },
  {
    path: 'signatures',
    component: StSignaturesComponent,
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
export class SignatureTrackingRoutingModule { }
