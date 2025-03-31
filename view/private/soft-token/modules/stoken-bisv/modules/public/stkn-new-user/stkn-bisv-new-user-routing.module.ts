import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StknBisvWelcomeComponent } from '../../../components/stkn-bisv-flow/stkn-bisv-welcome/stkn-bisv-welcome.component';
import { StknBisvInformationComponent } from '../../../components/stkn-bisv-flow/stkn-bisv-information/stkn-bisv-information.component';
import { SecurityOptionStokenResolver } from '../../../resolvers/security-option-stoken.resolver';
import { StknBisvQrScreenComponent } from '../../../components/stkn-bisv-flow/stkn-bisv-qr-screen/stkn-bisv-qr-screen.component';
import { StknBisvTokenApproveComponent } from '../../../components/stkn-bisv-flow/stkn-bisv-token-approve/stkn-bisv-token-approve.component';
import { StknBisvConfirmationComponent } from '../../../components/stkn-bisv-flow/stkn-bisv-confirmation/stkn-bisv-confirmation.component';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';

const routes: Routes = [  
  {
  path: '',
  component: StknBisvWelcomeComponent,
  canActivate: [
    NavigationProtectedGuard,
  ]
},
{
  path: 'information',
  component: StknBisvInformationComponent,
  canActivate: [
    NavigationProtectedGuard,
  ],
  resolve: {
    securityOptionExposed: SecurityOptionStokenResolver,
  }
},
{
  path: 'qrcode-stoken',
  component: StknBisvQrScreenComponent,
  canActivate: [
    NavigationProtectedGuard,
  ]
},
{
  path: 'approve-stoken',
  component: StknBisvTokenApproveComponent,
  canActivate: [
    NavigationProtectedGuard,
  ]
},
{
  path: 'confirmation',
  component: StknBisvConfirmationComponent,
  canActivate: [
    NavigationProtectedGuard,
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StknBisvNewUserRoutingModule { }
