import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPermissionEvaluatorGuard } from 'src/app/guards/menu-permission-evaluator.guard';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { StknBisvConfirmationComponent } from '../../../components/stkn-bisv-flow/stkn-bisv-confirmation/stkn-bisv-confirmation.component';
import { StknBisvInformationComponent } from '../../../components/stkn-bisv-flow/stkn-bisv-information/stkn-bisv-information.component';
import { StknBisvQrScreenComponent } from '../../../components/stkn-bisv-flow/stkn-bisv-qr-screen/stkn-bisv-qr-screen.component';
import { StknBisvTokenApproveComponent } from '../../../components/stkn-bisv-flow/stkn-bisv-token-approve/stkn-bisv-token-approve.component';

const routes: Routes = [
  {
    path: '',
    component: StknBisvInformationComponent,
    canActivate: [
      NavigationProtectedGuard,
      MenuPermissionEvaluatorGuard
    ],

  },
  {
    path: 'qrcode-stoken',
    component: StknBisvQrScreenComponent,
    canActivate: [
      NavigationProtectedGuard
    ]
  },
  {
    path: 'approve-stoken',
    component: StknBisvTokenApproveComponent,
    canActivate: [
      NavigationProtectedGuard
    ]
  },
  {
    path: 'confirmation',
    component: StknBisvConfirmationComponent,
    canActivate: [
      NavigationProtectedGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StokenBisvChangeDeviceRoutingModule { }
