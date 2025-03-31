import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdfComponentsModule } from '@adf/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StknBisvCodeQrZoomComponent } from './components/stkn-bisv-code-qr/stkn-bisv-code-qr-zoom/stkn-bisv-code-qr-zoom.component';
import { StknBisvCodeQrComponent } from './components/stkn-bisv-code-qr/stkn-bisv-code-qr.component';
import { StknBisvConfirmationComponent } from './components/stkn-bisv-flow/stkn-bisv-confirmation/stkn-bisv-confirmation.component';
import { ModalMsecurityComponent } from './components/stkn-bisv-flow/stkn-bisv-information/modals/modal-msecurity/modal-msecurity.component';
import { ModalStokenComponent } from './components/stkn-bisv-flow/stkn-bisv-information/modals/modal-stoken/modal-stoken.component';
import { ModalVerificationComponent } from './components/stkn-bisv-flow/stkn-bisv-information/modals/modal-verification/modal-verification.component';
import { StknBisvInformationComponent } from './components/stkn-bisv-flow/stkn-bisv-information/stkn-bisv-information.component';
import { StknBisvQrScreenComponent } from './components/stkn-bisv-flow/stkn-bisv-qr-screen/stkn-bisv-qr-screen.component';
import { StknBisvTokenApproveComponent } from './components/stkn-bisv-flow/stkn-bisv-token-approve/stkn-bisv-token-approve.component';
import { StknBisvWelcomeComponent } from './components/stkn-bisv-flow/stkn-bisv-welcome/stkn-bisv-welcome.component';
import { StknBisvConfirmModalComponent } from './components/stkn-bisv-invitation/stkn-bisv-confirm-modal/stkn-bisv-confirm-modal.component';
import { StknBisvInfoModalComponent } from './components/stkn-bisv-invitation/stkn-bisv-info-modal/stkn-bisv-info-modal.component';
import { StknBisvQrModalComponent } from './components/stkn-bisv-invitation/stkn-bisv-qr-modal/stkn-bisv-qr-modal.component';
import { StknBisvValidateModalComponent } from './components/stkn-bisv-invitation/stkn-bisv-validate-modal/stkn-bisv-validate-modal.component';
import { StknBisvValidateMembershipComponent } from './components/stkn-bisv-validate-membership/stkn-bisv-validate-membership.component';
import { StokenBisvRoutingModule } from './stoken-bisv-routing.module';
import { StknBisvHelpModalComponent } from './components/stkn-bisv-help-modal/stkn-bisv-help-modal.component';
import { StknBisvStepHorizontalComponent } from './components/stkn-bisv-steps-indicator/stkn-bisv-step-horizontal/stkn-bisv-step-horizontal.component';
import { StknBisvStepVerticalComponent } from './components/stkn-bisv-steps-indicator/stkn-bisv-step-vertical/stkn-bisv-step-vertical.component';


@NgModule({
  declarations: [
    StknBisvInfoModalComponent,
    StknBisvQrModalComponent,
    StknBisvStepVerticalComponent,
    StknBisvCodeQrComponent,
    StknBisvCodeQrZoomComponent,
    StknBisvValidateModalComponent,
    StknBisvHelpModalComponent,
    StknBisvConfirmModalComponent,
    StknBisvValidateMembershipComponent,
    StknBisvQrScreenComponent,
    StknBisvTokenApproveComponent,
    StknBisvWelcomeComponent,
    StknBisvConfirmationComponent,
    StknBisvInformationComponent,
    ModalStokenComponent,
    ModalMsecurityComponent,
    ModalVerificationComponent,
    StknBisvStepHorizontalComponent,
  ],
  imports: [
    CommonModule,
    StokenBisvRoutingModule,
    AdfComponentsModule,
    TranslateModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class StokenBisvModule { }
