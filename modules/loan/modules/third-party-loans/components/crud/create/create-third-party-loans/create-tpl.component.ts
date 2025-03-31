import { AdfFormBuilderService, ILayout } from '@adf/components';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TplCrudManagerService } from '../../../../services/definition/crud/tpl-crud-manager.service';
import { ThirdPartyLoansService } from '../../../../services/transaction/third-party-loans.service';
import { AttributeFormThirdPartyLoansCrud } from '../../../../enum/third-party-loans-control-name.enum';
import {
  IConfirmationData,
  IConfirmationDataResponse,
  IConsultThirdPartyLoan,
  ICreateNumberLoans,
  IData,
} from '../../../../interfaces/crud/crud-third-party-loans-interface';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  ENavigateProtectionParameter,
  ETPLPaymentCRUDUrlNavigationCollection, ETPLPaymentUrlNavigationCollection
} from '../../../../enum/navigate-protection-parameter.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ParameterManagementService } from '../../../../../../../../service/navegation-parameters/parameter-management.service';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../../../../../../service/common/util.service';

@Component({
  selector: 'byte-create-home-third-party-loans',
  templateUrl: './create-tpl.component.html',
  styleUrls: ['./create-tpl.component.scss'],
})
export class CreateThirdPartyLoansComponent implements OnInit, OnDestroy {
  //Form
  createLayout!: ILayout;
  createForm!: FormGroup;
  thirdPartyLoanData!: IConsultThirdPartyLoan;

  //dataLoan
  identifier: string | null = null;
  emailLoanUser: string | null = null;
  aliasLoanUser: string | null = null;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  routerSubscription: Subscription;

  constructor(
    private createThirdPartyLoansManager: TplCrudManagerService,
    private tplFormBuilder: AdfFormBuilderService,
    private router: Router,
    private parametersService: ParameterManagementService,
    private thirdPartyLoansService: ThirdPartyLoansService,
    private spinner: NgxSpinnerService,
    private utils: UtilService,
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


  initDefinition() {
    this.getThirdPartyLoan();
    this.createLayoutDefinition();
  }

  createLayoutDefinition() {
    this.createLayout = this.createThirdPartyLoansManager.builderCreateLoansForm(this.identifier!, this.thirdPartyLoanData);
    this.createForm = this.tplFormBuilder.formDefinition(this.createLayout.attributes);
  }

  backTo(): void {
    this.utils.showLoader();

    this.parametersService.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: ENavigateProtectionParameter.CONSULT,
    });

    this.router.navigate([ETPLPaymentCRUDUrlNavigationCollection.CONSULT]).then(() => this.utils.hideLoader());
  }

  addNumberLoan() {
    if (!this.createForm.valid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.emailLoanUser = this.createForm?.get(AttributeFormThirdPartyLoansCrud.EMAIL)?.value;
    this.aliasLoanUser = this.createForm?.get(AttributeFormThirdPartyLoansCrud.ALIAS)?.value;

    const numberLoan: ICreateNumberLoans = {
      identifier: this.identifier!,
      alias: this.aliasLoanUser!,
      email: this.emailLoanUser!,
    };

    this.spinner.show('main-spinner');

    this.thirdPartyLoansService.associateNumberLoan(numberLoan).subscribe({
      next: (data) => {
        const dataLoan: IConfirmationDataResponse = {
          reference: data.reference,
          dateTime: data.dateTime,
          message: 'loan_creation_successful',
          action: 'create',
        };

        this.sentDataCreateConfirmation(dataLoan);
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.showAlert('error', errorResponse?.error?.message ?? 'error:get_credit');
        this.hiddenSpinner();
      },
    });
  }

  getThirdPartyLoan() {
    const currentState =this.parametersService.getParameter('navigateStateParameters');
    this.thirdPartyLoanData = currentState?.thirdPartyLoan;
    this.identifier = currentState?.identifier;

    if (!this.identifier && !this.thirdPartyLoanData) {
      this.router.navigate([ETPLPaymentCRUDUrlNavigationCollection.CONSULT]).then(() => {});
    }
  }

  sentDataCreateConfirmation(response: IConfirmationDataResponse) {
    const dataCreateConfirmation = {
      identifier: this.identifier,
      currency: this.thirdPartyLoanData.currency,
      currencyCode: this.thirdPartyLoanData.currencyCode,
      type: this.thirdPartyLoanData.type,
      alias: this.aliasLoanUser,
      loanName: this.thirdPartyLoanData.loanName,
      email: this.emailLoanUser,
      status: this.thirdPartyLoanData.status,
    };

    const data: IConfirmationData = {
      reference: response.reference,
      dateTime: response.dateTime,
      message: 'loan_creation_successful',
      action: 'create',
      data: dataCreateConfirmation as IData,
    };

    this.parametersService.sendParameters({
      navigateStateParameters: data,
      navigationProtectedParameter: ENavigateProtectionParameter.CONFIRMATION,
    });

    this.router.navigate([ETPLPaymentUrlNavigationCollection.DEFAULT_CONFIRMATION]).finally(() => this.hiddenSpinner());
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  showSpinner() {
    this.spinner.show('main-spinner');
  }

  hiddenSpinner() {
    this.spinner.hide('main-spinner');
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
}
