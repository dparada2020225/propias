import { AdfAlertModalComponent, AdfFormBuilderService, ILayout } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TplCrudManagerService } from '../../../../services/definition/crud/tpl-crud-manager.service';
import { Router } from '@angular/router';
import {
  IConsultNumberLoan,
  IThirdPartyLoanAssociate,
  ICreateNumberLoans,
} from '../../../../interfaces/crud/crud-third-party-loans-interface';
import { AttributeFormThirdPartyLoansCrud } from '../../../../enum/third-party-loans-control-name.enum';
import { ThirdPartyLoansService } from '../../../../services/transaction/third-party-loans.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TplUpdateService } from '../../../../services/definition/crud/update/tpl-update.service';
import { ParameterManagementService } from '../../../../../../../../service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import { UtilWorkFlowService } from '../../../../../../../../service/common/util-work-flow.service';
import { Subscription } from 'rxjs';
import {
  EPaymentLoansFlowView, ETPLPaymentCRUDUrlNavigationCollection,
  ETPLPaymentUrlNavigationCollection
} from '../../../../enum/navigate-protection-parameter.enum';


@Component({
  selector: 'byte-update-tpl',
  templateUrl: './update-tpl.component.html',
  styleUrls: ['./update-tpl.component.scss'],
})
export class UpdateTplComponent implements OnInit {
  //Form
  updateLayout!: ILayout;
  updateForm!: FormGroup;

  //DataAccountSelected
  accountTPL!: IThirdPartyLoanAssociate;
  routerSubscription: Subscription;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  UPDATE_MESSAGE_ALERT_MODAL = 'update_message_third_modal';

  constructor(
    private createThirdPartyLoansManager: TplCrudManagerService,
    private tplFormBuilder: AdfFormBuilderService,
    private router: Router,
    private parametersService: ParameterManagementService,
    private crudTPLService: ThirdPartyLoansService,
    private location: Location,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private updateService: TplUpdateService,
    private utilWorkFlow: UtilWorkFlowService,
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        this.backTo();
      }
    });
  }

  ngOnInit(): void {
    this.receiveMessageAccount();
    this.initDefinition();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  initDefinition() {
    this.createLayoutDefinition();
  }

  createLayoutDefinition() {
    this.updateLayout = this.createThirdPartyLoansManager.builderUpdateLoansForm(this.accountTPL);
    this.updateForm = this.tplFormBuilder.formDefinition(this.updateLayout.attributes);
  }

  getDetailLoan() {
    this.showSpinner();
    const identifier: IConsultNumberLoan = { identifier: this.accountTPL.identifier! };
    this.crudTPLService
      .consultDetail(identifier)
      .pipe(finalize(() => this.hiddenSpinner()))
      .subscribe({
        next: (response) => {
          this.updateForm?.get(AttributeFormThirdPartyLoansCrud.ALIAS)?.setValue(response.alias);
          this.updateForm?.get(AttributeFormThirdPartyLoansCrud.EMAIL)?.setValue(response.email);
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'error:update_third_party_loan');
          this.hiddenSpinner();
        },
      });
  }

  backTo(): void {
    const view = this.parametersService.getParameter('navigateStateParameters')?.view;

    if(view === EPaymentLoansFlowView.ALL_LOANS){
      this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME2]).finally(() => {});
    } else {
      this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME]).finally(() => {});
    }

    this.parametersService.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    });



  }

  receiveMessageAccount() {
    this.accountTPL = this.parametersService.getParameter('navigateStateParameters');
    this.getDetailLoan();
  }

  updateButton(): void {
    if (!this.updateForm.valid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.openUpdateModal();
  }

  updateThirdPartyLoan() {
    if (!this.updateForm.valid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.showSpinner();

    const numberLoanTest: ICreateNumberLoans = {
      identifier: this.accountTPL.identifier!,
      alias: this.updateForm.getRawValue().alias,
      email: this.updateForm.getRawValue().email,
    };

    this.crudTPLService.updateAssociateNumberLoan(numberLoanTest).subscribe({
      next: (data) => {
        const dataResponse = {
          reference: data.reference,
          action: 'update',
          message: 'alert_updateTPL_successfully',
          alias: numberLoanTest.alias,
          email: numberLoanTest.email,
          type: 'success',
        };
        this.parametersService.sendParameters({
          navigateStateParameters: {
            ...dataResponse,
            view: this.parametersService.getParameter('navigateStateParameters')?.view,
          },
          navigationProtectedParameter: 'update_confirmation',
        });

        this.router.navigate([ETPLPaymentCRUDUrlNavigationCollection.UPDATE_CONFIRMATION]).finally(() => this.hiddenSpinner());
      },
      error: (error: HttpErrorResponse) => {
        this.showAlert('error', error?.error?.message ?? 'error:update_third_party_loan');
        this.hiddenSpinner();
      },
    });
  }

  openUpdateModal() {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.utilWorkFlow.buildAlertToUpdate(this.UPDATE_MESSAGE_ALERT_MODAL);


    modal.result.then((isResult) => {
      if (!isResult) {
        return;
      }

      this.updateThirdPartyLoan();
    }).catch((error) => {});
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
