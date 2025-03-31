import {Component, OnInit} from '@angular/core';
import {UtilService} from '../../../../../../service/common/util.service';
import {PmpTransactionService} from '../../../services/transaction/pmp-transaction.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PmpdFormService} from '../../../services/definition/payment/pmpd-form.service';
import {AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue, ITableStructure} from '@adf/components';
import {FormGroup} from '@angular/forms';
import {IAccount} from '../../../../../../models/account.inteface';
import {ActivatedRoute, Router} from '@angular/router';
import {SppdFormAttributes} from '../../../interfaces/pmp-form.interface';
import {PmpdTableService} from '../../../services/definition/payment/pmpd-table.service';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {SPPMRoutes} from '../../../enums/pmp-routes.enum';
import {PaymentOfPayrollRouteProtectedParameter} from '../../../enums/pmp-protected-parameter.enum';
import {IGetDataPayroll, Participant} from "../../../interfaces/pmp-payment-home.interface";

@Component({
  selector: 'byte-pmp-home',
  templateUrl: './pmpp-payment.component.html',
  styleUrls: ['./pmpp-payment.component.scss']
})
export class PmppPaymentComponent implements OnInit {
  typeMessage = '';
  message = '';

  paymentDetail!: IGetDataPayroll;
  formLayout!: ILayout;
  form!: FormGroup;
  formSelectOptions: Array<IDataSelect> = [];
  sourceAccountList: Array<IAccount> = [];
  tableLayout!: ITableStructure;
  sourceAccountSelected!: IAccount;

  get isShowNextButton(): boolean {
    return this.sourceAccountSelected && this.paymentDetail?.participants.length > 0;
  }

  constructor(
    private utils: UtilService,
    private transactionService: PmpTransactionService,
    private formDefinitionService: PmpdFormService,
    private adfFormBuilder: AdfFormBuilderService,
    private activatedRoute: ActivatedRoute,
    private tableDefinition: PmpdTableService,
    private parameterManager: ParameterManagementService,
    private router: Router,
  ) { }

  get customShow() {
    return this.message && this.typeMessage ? 'custom_show' : '';
  }


  ngOnInit(): void {
    this.getPayrollDetail();
    this.getSourceAccountList();
  }

  getSourceAccountList() {
    const response = this.activatedRoute.snapshot.data['sourceAccounts'];
    if (response.hasOwnProperty('error')) {
      this.showAlert('error', response.error.message);
      return;
    }

    this.sourceAccountList = response;
  }

  getPayrollDetail() {
    const idClient = this.parameterManager.getParameter('userInfo')?.customerCode;

    this.transactionService.getPayrollToPayment(idClient)
      .subscribe({
        next: (res:IGetDataPayroll) => {
          this.paymentDetail = res;
          this.launchView();
        },
        error: (error: HttpErrorResponse) => {
          const message = error?.error?.code === '1' ? 'payroll:label_no_payroll' : error.message;
          const type = error?.error?.code === '1' ? 'info' : 'error';

          this.utils.hideLoader();
          this.launchView();
          this.showAlert(type, message);
        }
      })
  }

  launchView() {
    this.formDefinition();
    this.buildPaymentTable();
  }

  buildPaymentTable() {
    this.tableLayout = this.tableDefinition.buildTable(this.paymentDetail?.participants ?? []);
    this.utils.hideLoader()
  }

  buildSelectOptions() {
    const options = this.selectFormatting(this.sourceAccountList);

    const fundationAccountOptions: IDataSelect = {
      controlName: SppdFormAttributes.SOURCE_ACCOUNT,
      data: options
    };

    this.formSelectOptions = [...this.formSelectOptions, fundationAccountOptions];
  }

  next() {
    if (!this.isShowNextButton) return;

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        sourceAccount: this.sourceAccountSelected,
        paymentDetail: this.paymentDetail,
      },
      navigationProtectedParameter: PaymentOfPayrollRouteProtectedParameter.PAYMENT_CONFIRMATION,
    });

    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.CONFIRMATION_PAYMENT]).finally(() => this.utils.hideLoader());
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.HOME]).finally(() => this.utils.hideLoader())
  }

  selectFormatting(accountList: IAccount[]): IPossibleValue[] {
    if (accountList && accountList.length === 0) return [];

    return accountList.map((account) => {
      const accountTemp: IPossibleValue = {
        value: account.account,
        name: `${this.nameFormatting(account)}`,
      };
      return accountTemp;
    });
  }

  private nameFormatting(account: IAccount): string {
    const acronym = this.utils.getProductAcronym(account?.product)
    return `${acronym} - ${account?.account} / ${account?.name}`;
  }

  formDefinition() {
    const participants = this.paymentDetail?.participants ?? []
    const amount = String(participants.reduce((sum, account) => sum + account.targetAmount, 0));
    const date = this.getDate(participants)

    this.formLayout = this.formDefinitionService.buildFormLayout({
      title: 'payroll:title',
      subtitle: 'payroll:payment-button',
      credits: String(this.paymentDetail?.participants.length),
      amount,
      date
    });

    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
    this.buildSelectOptions();
    this.changeForm();
  }

  private getDate(participants: Participant[]): string {
    let date:string;
    if (participants.length > 0) {
      const allAccountsHaveSameDate = participants.every(account => account.dateCreation === this.paymentDetail.participants[0].dateCreation);
      date = allAccountsHaveSameDate ? this.paymentDetail.participants[0].dateCreation : this.utils.getDate();
    } else {
      date = '';
    }
    return date
  }

  changeForm() {
    this.form.get(SppdFormAttributes.SOURCE_ACCOUNT)?.valueChanges.subscribe((value) => {
      this.sourceAccountSelected = this.sourceAccountList.find((account) => account.account === value) as IAccount;
    });
  }

  showAlert(type: string, message: string) {
    this.typeMessage = type;
    this.message = message;
  }

}
