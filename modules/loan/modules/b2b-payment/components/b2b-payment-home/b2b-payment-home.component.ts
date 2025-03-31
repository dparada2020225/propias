import { Component, OnInit } from '@angular/core';
import {
  IPaymentAccount,
  IPaymentAccountDetail,
  IPaymentB2bAccountResponse
} from '../../interfaces/b2b-payment.interface';
import { ILoadItem, ITableStructure } from '@adf/components';
import { ActivatedRoute, Router } from '@angular/router';
import { IFlowError } from '../../../../../../models/error.interface';
import { PaymentTableType } from '../../enum/b2b-payment-control-name.enum';
import { ValidationTriggerTimeService } from '../../../../../../service/common/validation-trigger-time.service';
import { IIsSchedule } from '../../../../../../models/isSchedule.interface';
import { environment } from '../../../../../../../environments/environment';
import { B2bdPaymentManagerDefinitionService } from '../../service/definition/b2bd-payment-manager-definition.service';
import { B2bPaymentService } from '../../service/transction/b2b-payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { EB2bPaymentNavigateParameter } from '../../enum/b2b-payment-navigate-parameter.enum';
import { IB2bPaymentState } from '../../interfaces/b2b-payment-state.interface';
import { UtilService } from '../../../../../../service/common/util.service';

@Component({
  selector: 'byte-b2b-payment-home',
  templateUrl: './b2b-payment-home.component.html',
  styleUrls: ['./b2b-payment-home.component.scss']
})
export class B2bPaymentHomeComponent implements OnInit {
  b2bAccounts: IPaymentB2bAccountResponse | null = null
  paymentTable!: ITableStructure;
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  currency: string = environment.currency;


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get totalBalance() {
    return this.b2bAccounts?.totalBalance ?? 0;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private validationTriggerTime: ValidationTriggerTimeService,
    private managerDefinition: B2bdPaymentManagerDefinitionService,
    private paymentTransaction: B2bPaymentService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private utils: UtilService,
  ) { }

  ngOnInit(): void {
    this.validationRangeTriggerTime();
    this.getB2bAccountList();
    this.utils.hideLoader();
  }

  validationRangeTriggerTime() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(environment.profile, schedule);
  }

  getB2bAccountList() {
    const accountsResponse = this.activatedRoute.snapshot.data['b2bAccountList'];

    if (accountsResponse.hasOwnProperty('error')) {
      const error = accountsResponse as IFlowError;
      this.showAlert('error', error?.message);
      this.buildTable([]);
      return;
    }

    this.b2bAccounts = accountsResponse as IPaymentB2bAccountResponse;
    this.buildTable(this.b2bAccounts?.accounts ?? []);
  }

  buildTable(accounts: IPaymentAccount[]) {
    this.paymentTable = this.managerDefinition.buildTableLayout(accounts, this.currency);
  }

  getActionTable(selectedAccountTMP: any) {
    const selectedAccount: ILoadItem<IPaymentAccount> = selectedAccountTMP;

    if (selectedAccount.action === PaymentTableType.PAY) {
      return this.getAccountDetail(selectedAccount.item);
    }
  }

  getAccountDetail(account: IPaymentAccount) {
    this.utils.showLoader();

    this.paymentTransaction
      .getB2bAccountDetail(account.b2bID, null)
      .subscribe({
        next: (response) => {
          this.goToConfirmation(response, account);
        },
        error:(error: HttpErrorResponse) => {
          this.utils.hideLoader();
          this.showAlert('error', `${error.error?.message ?? 'errorB2B:get_accountDetail'}`);
        }
      })
  }

  goToConfirmation(paymentDetail: IPaymentAccountDetail, accountSelected: IPaymentAccount) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EB2bPaymentNavigateParameter.FORM,
      navigateStateParameters: {
        accountToPaymentSelected: accountSelected,
        paymentDetail,
      } as IB2bPaymentState,
    });

    this.router.navigate(['/loan/payment/form']).finally(() => this.utils.hideLoader());
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
