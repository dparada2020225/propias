import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue } from '@adf/components';
import { environment } from '../../../../../../../environments/environment';
import { B2bdPaymentManagerDefinitionService } from '../../service/definition/b2bd-payment-manager-definition.service';
import { B2bPaymentForm } from '../../enum/b2b-payment-control-name.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { IAccount } from '../../../../../../models/account.inteface';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { IB2bPaymentState } from '../../interfaces/b2b-payment-state.interface';
import { IPaymentAccount, IPaymentAccountDetail } from '../../interfaces/b2b-payment.interface';
import { distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { EB2bPaymentView } from '../../enum/b2b-payment-view.enum';
import { Location } from '@angular/common';
import { UtilService } from '../../../../../../service/common/util.service';
import { EB2bPaymentNavigateParameter } from '../../enum/b2b-payment-navigate-parameter.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { B2bPaymentService } from '../../service/transction/b2b-payment.service';

@Component({
  selector: 'byte-b2b-payment-form',
  templateUrl: './b2b-payment-form.component.html',
  styleUrls: ['./b2b-payment-form.component.scss']
})
export class B2bPaymentFormComponent implements OnInit {
  form!: FormGroup;
  formLayout!: ILayout;
  selectOptions: IDataSelect[] = [];
  sourceAccountList: IAccount[] = [];
  sourceAccountSelected: IAccount | null = null;
  accountToPaymentSelected: IPaymentAccount | null = null;
  paymentDetail: IPaymentAccountDetail | null = null;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  currency: string = environment.currency;
  view: EB2bPaymentView = EB2bPaymentView.DEFAULT;


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private managerDefinition: B2bdPaymentManagerDefinitionService,
    private adfFormDefinition: AdfFormBuilderService,
    private activatedRoute: ActivatedRoute,
    private parameterManagement: ParameterManagementService,
    private location: Location,
    private utils: UtilService,
    private router: Router,
    private paymentTransaction: B2bPaymentService,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.accountListUpload();
    this.formDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    this.view = this.activatedRoute.snapshot.data['view'];
    const paymentState: IB2bPaymentState = this.parameterManagement.getParameter('navigateStateParameters');
    this.paymentDetail = paymentState?.paymentDetail;
    this.accountToPaymentSelected = paymentState?.accountToPaymentSelected;
  }

  formDefinition() {
    this.formLayout = this.managerDefinition.buildFormLayout({
      accountDetail: this.paymentDetail as IPaymentAccountDetail,
      currency: this.currency,
      b2bAccount: this.accountToPaymentSelected as IPaymentAccount,
    });

    this.form = this.adfFormDefinition.formDefinition(this.formLayout.attributes);
    this.changeForm();
  }

  changeForm() {
    this.onDebitedAccountChange();
    const balanceToPayment = this.paymentDetail?.paymentBalance ?? '';
    this.form.get(B2bPaymentForm.BALANCE_PAYMENT)?.setValue(balanceToPayment);
  }

  onDebitedAccountChange() {
    this.form.get(B2bPaymentForm.ACCOUNT_DEBITED)?.valueChanges
      .pipe(distinctUntilChanged(), throttleTime(500))
      .subscribe((data) => {
      const accountDebited = this.sourceAccountList.find((account) => account.account === data) as IAccount;
      this.sourceAccountSelected = { ...accountDebited };
    })
  }

  accountListUpload() {
    const accountsResponse = this.activatedRoute.snapshot.data['sourceAccounts'];
    if (accountsResponse.hasOwnProperty('error')) {
      return;
    }

    this.sourceAccountList = accountsResponse

    const possibleValuesAccountsDebit: IPossibleValue[] = this.sourceAccountList.map((accountDebit) => {
      const accountDebitTemp: IPossibleValue = {
        value: accountDebit.account,
        name: ` ${accountDebit.account} - ${accountDebit.name}`,
      };
      return accountDebitTemp;
    });

    const debitAccountOptions: IDataSelect = {
      controlName: B2bPaymentForm.ACCOUNT_DEBITED,
      data: possibleValuesAccountsDebit,
    };

    this.selectOptions.push(debitAccountOptions);
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.scrollToTop();
      return;
    }

    this.handleGoToConfirmationScreen();
  }

  prevStep() {
    this.resetStorage();
    this.location.back();
  }

  getPaymentDetail(account: IPaymentAccount, paymentBalance: number | null = null, message?: string) {
    this.utils.showLoader();

    this.paymentTransaction
      .getB2bAccountDetail(account.b2bID, paymentBalance)
      .subscribe({
        next: (response) => {
          this.goToConfirmation(response, message);
        },
        error:(error: HttpErrorResponse) => {
          this.utils.hideLoader();
          this.showAlert('error', `${error.error?.message ?? 'errorB2B:get_accountDetail'}`);
        }
      })
  }

  handleGoToConfirmationScreen() {
    const paymentBalance = Number(this.paymentDetail?.paymentBalance ?? 0);
    const formPaymentBalance = Number(this.form.get(B2bPaymentForm.BALANCE_PAYMENT)?.value ?? 0);
    const capital = Number(this.paymentDetail?.capital ?? 0);
    const interest = Number(this.paymentDetail?.interests ?? 0);
    const message = (formPaymentBalance > paymentBalance) && (paymentBalance === interest) && capital <= 0 ? 'payment_greater' : undefined;

    if (formPaymentBalance && formPaymentBalance === paymentBalance) {
      this.goToConfirmation(undefined, message);
      return;
    }

    this.getPaymentDetail(this.accountToPaymentSelected as IPaymentAccount, formPaymentBalance, message);
  }

  goToConfirmation(paymentDetail?: IPaymentAccountDetail, message?: string) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EB2bPaymentNavigateParameter.CONFIRMATION,
      navigateStateParameters: {
        accountToPaymentSelected: this.accountToPaymentSelected,
        paymentDetail: paymentDetail ?? this.paymentDetail,
        formValues: this.form.value,
        selectedSourceAccount: this.sourceAccountSelected,
        message,
      } as IB2bPaymentState,
    })

    this.router.navigate(['/loan/payment/confirmation']).finally(() => this.utils.hideLoader());
  }

  resetStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
     });
  }

  scrollToTop() {
    this.utils.scrollToTop();
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
