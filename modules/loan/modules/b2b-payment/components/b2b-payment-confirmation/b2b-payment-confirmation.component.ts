import { IDataReading } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { EB2bPaymentView } from '../../enum/b2b-payment-view.enum';
import { B2bdPaymentManagerDefinitionService } from '../../service/definition/b2bd-payment-manager-definition.service';
import { IB2bPaymentFormValues, IB2bPaymentState } from '../../interfaces/b2b-payment-state.interface';
import { IB2BDPaymentConfirmationDefinitionParameters } from '../../interfaces/b2bd-payment-confirmation.interface';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { IAccount } from '../../../../../../models/account.inteface';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EB2bPaymentNavigateParameter } from '../../enum/b2b-payment-navigate-parameter.enum';
import { B2bPaymentService } from '../../service/transction/b2b-payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IPaymentExecutionDescription } from '../../interfaces/b2b-payment-execution.interface';
import { IPaymentAccount, IPaymentAccountDetail } from '../../interfaces/b2b-payment.interface';
import { UtilService } from '../../../../../../service/common/util.service';

@Component({
  selector: 'byte-b2b-payment-confirmation',
  templateUrl: './b2b-payment-confirmation.component.html',
  styleUrls: ['./b2b-payment-confirmation.component.scss']
})
export class B2bPaymentConfirmationComponent implements OnInit {
  confirmationLayout!: IDataReading;
  accountToPaymentSelected: IPaymentAccount | null = null;
  paymentDetail: IPaymentAccountDetail | null = null;
  formValues: IB2bPaymentFormValues | null = null;
  selectedSourceAccount: IAccount | null = null;
  message: string = '';

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  currency: string = environment.currency;
  view: EB2bPaymentView = EB2bPaymentView.DEFAULT;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private managerDefinition: B2bdPaymentManagerDefinitionService,
    private parameterManagement: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private paymentTransaction: B2bPaymentService,
    private router: Router,
    private utils: UtilService,
  ) { }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];
    this.initDefinition();
    this.buildConfirmationVoucher();
  }

  initDefinition() {
    const paymentState: IB2bPaymentState = this.parameterManagement.getParameter('navigateStateParameters');
    this.paymentDetail = paymentState?.paymentDetail;
    this.accountToPaymentSelected = paymentState?.accountToPaymentSelected;
    this.formValues = paymentState?.formValues as IB2bPaymentFormValues;
    this.message = paymentState?.message ?? '';
    this.selectedSourceAccount = paymentState?.selectedSourceAccount as IAccount;

  }

  buildConfirmationVoucher() {
    const paymentState: IB2bPaymentState = this.parameterManagement.getParameter('navigateStateParameters');
    this.showAlert('warning', this.message);

    const sampleVoucherProps: IB2BDPaymentConfirmationDefinitionParameters = {
      detailAccount: paymentState?.paymentDetail,
      sourceAccount: paymentState?.selectedSourceAccount as IAccount,
      currency: this.currency,
      formValues: paymentState?.formValues as IB2bPaymentFormValues,
      b2bAccount: paymentState?.accountToPaymentSelected,
    }


    this.confirmationLayout = this.managerDefinition.buildConfirmationLayout({ ...sampleVoucherProps });
  }

  nextStep() {
    this.executePayment();
  }

  executePayment() {
    this.utils.showLoader();

    const paymentData = this.managerDefinition.buildDataToExecuteTransaction({
      formValues: this.formValues,
      paymentDetail: this.paymentDetail as IPaymentAccountDetail,
      accountToPaymentSelected: this.accountToPaymentSelected as IPaymentAccount,
      selectedSourceAccount: this.selectedSourceAccount as IAccount,
      currency: this.currency,
    });


    this.paymentTransaction.executePayment(paymentData)
      .subscribe({
        next: (response) => {
          this.goToVoucher(response);
        },
        error: (error: HttpErrorResponse) => {
          this.utils.hideLoader();
          this.showAlert('error', `${error.error?.message ?? 'errorB2B:paymentExecution'}`);
        },
      })
  }

  prevStep() {
    this.resetStorage();
    this.location.back();
  }

  goToVoucher(paymentTransactionResponse: IPaymentExecutionDescription) {
    const paymentState: IB2bPaymentState = this.parameterManagement.getParameter('navigateStateParameters');

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EB2bPaymentNavigateParameter.VOUCHER,
      navigateStateParameters: {
        ...paymentState,
        paymentTransactionResponse,
      }
    });

    this.router.navigate(['/loan/payment/voucher']).finally(() => this.utils.hideLoader());

  }

  resetStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EB2bPaymentNavigateParameter.FORM,
    })
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }

}
