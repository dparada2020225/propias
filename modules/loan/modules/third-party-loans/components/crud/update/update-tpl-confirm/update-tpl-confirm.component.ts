import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDataReading } from '@adf/components';
import { Router } from '@angular/router';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { TplUpdateConfirmService } from '../../../../services/definition/crud/update/tpl-update-confirm.service';
import { Subscription } from 'rxjs';
import {
  EPaymentLoansFlowView,
  ETPLPaymentUrlNavigationCollection
} from '../../../../enum/navigate-protection-parameter.enum';


@Component({
  selector: 'byte-update-tpl-confirm',
  templateUrl: './update-tpl-confirm.component.html',
  styleUrls: ['./update-tpl-confirm.component.scss'],
})
export class UpdateTplConfirmComponent implements OnInit, OnDestroy {
  //Form
  layoutJsonConfirmation!: IDataReading;
  showPaymentButton: boolean = true;

  //Header Alert
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  routerSubscription: Subscription;
  currentView!: EPaymentLoansFlowView;

  constructor(
    private parametersService: ParameterManagementService,
    private updateConfirmService: TplUpdateConfirmService,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        this.backTo();
      }
    });
  }

  ngOnInit(): void {
    this.initDefinition();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  initDefinition(): void {
    this.confirmationLayoutDefinition();
  }

  confirmationLayoutDefinition(): void {
    const parameterState = this.parametersService.getParameter('navigateStateParameters');
    const confirmationUpdate = parameterState;
    this.currentView = parameterState?.view;
    this.layoutJsonConfirmation = this.updateConfirmService.builderLayoutConfirmation(confirmationUpdate);
    this.showAlert(confirmationUpdate.type, confirmationUpdate.message);
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  backTo(): void {
    this.parametersService.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    });


    if(this.currentView === EPaymentLoansFlowView.ALL_LOANS){
      this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME2]).then(() => {});
    } else {
      this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME]).then(() => {});
    }
  }
}
