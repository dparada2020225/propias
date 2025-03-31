import { AdfFormBuilderService, ILayout } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TplCrudManagerService } from '../../../../services/definition/crud/tpl-crud-manager.service';
import { ThirdPartyLoansService } from '../../../../services/transaction/third-party-loans.service';
import { AttributeThirdPartyLoansTable } from '../../../../enum/third-party-loans-control-name.enum';
import { IConsultNumberLoan } from '../../../../interfaces/crud/crud-third-party-loans-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import {
  ENavigateProtectionParameter,
  ETPLPaymentCRUDUrlNavigationCollection
} from '../../../../enum/navigate-protection-parameter.enum';
import { ParameterManagementService } from '../../../../../../../../service/navegation-parameters/parameter-management.service';

@Component({
  selector: 'byte-consult-home-third-party-loans',
  templateUrl: './consult-third-party-loans.component.html',
  styleUrls: ['./consult-third-party-loans.component.scss'],
})
export class ConsultThirdPartyLoansComponent implements OnInit {
  filterLayout!: ILayout;
  filterForm!: FormGroup;

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  constructor(
    private crudManagerService: TplCrudManagerService,
    private consultFormBuilder: AdfFormBuilderService,
    private router: Router,
    private thirdPartyLoansService: ThirdPartyLoansService,
    private sendDataAction: ParameterManagementService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private parametersService: ParameterManagementService
  ) {}

  ngOnInit(): void {
    this.initDefinition();
  }

  initDefinition() {
    this.filterLayoutDefinition();
  }

  filterLayoutDefinition() {
    this.filterLayout = this.crudManagerService.builderConsultLoansForm();
    this.filterForm = this.consultFormBuilder.formDefinition(this.filterLayout.attributes);
  }

  backTo(): void {
    this.parametersService.sendParameters({
      navigationProtectedParameter: null,
    });
    this.location.back();
  }

  consultNumberLoan() {
    // opción para enviar los datos de una cuenta
    if (!this.filterForm.valid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    this.showSpinner();
    const numberLoanInput: string = this.filterForm?.get(AttributeThirdPartyLoansTable.FILTER)?.value;
    const numberLoan: IConsultNumberLoan = { identifier: numberLoanInput };
    this.thirdPartyLoansService.consultThirdPartyLoan(numberLoan).subscribe({
      next: (data) => {
        this.sendDataAction.sendParameters({
          navigateStateParameters: {
            thirdPartyLoan: data,
            identifier: numberLoanInput,
          },
          navigationProtectedParameter: ENavigateProtectionParameter.CREATE,
        });

        this.router.navigate([ETPLPaymentCRUDUrlNavigationCollection.CREATE_HOME]).finally(() => this.hiddenSpinner());
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.showAlert('error', errorResponse?.error?.message ?? 'error:get_credit');
        this.hiddenSpinner();
      },
    });
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
