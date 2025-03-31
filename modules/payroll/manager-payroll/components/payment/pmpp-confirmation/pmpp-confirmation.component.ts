import {Component, OnDestroy, OnInit} from '@angular/core';
import {IDataReading, ITableStructure} from '@adf/components';
import {IAccount} from '../../../../../../models/account.inteface';
import {PmpdTableService} from '../../../services/definition/payment/pmpd-table.service';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {Router} from '@angular/router';
import {UtilService} from '../../../../../../service/common/util.service';
import {PmpdVoucherService} from '../../../services/definition/payment/pmpd-voucher.service';
import {PmpeTransactionService} from '../../../services/execution/pmpe-transaction.service';
import {SPPMRoutes} from '../../../enums/pmp-routes.enum';
import {IGetDataPayroll} from "../../../interfaces/pmp-payment-home.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'byte-pmpp-confirmation',
  templateUrl: './pmpp-confirmation.component.html',
  styleUrls: ['./pmpp-confirmation.component.scss']
})
export class PmppConfirmationComponent implements OnInit, OnDestroy {
  typeMessage = '';
  message = '';

  tableLayout!: ITableStructure;
  sourceAccountSelected!: IAccount;

  paymentDetail!: IGetDataPayroll;
  voucherLayout!: IDataReading;

  messageTransaction!: Subscription;


  constructor(
    private tableDefinition: PmpdTableService,
    private parameterManager: ParameterManagementService,
    private router: Router,
    private utils: UtilService,
    private voucherDefinition: PmpdVoucherService,
    private executeTransaction: PmpeTransactionService,
  ) { }

  get customShow() {
    return this.message && this.typeMessage ? 'custom_show' : '';
  }

  ngOnInit(): void {
    this.initState();
    this.buildPaymentTable();
  }

  ngOnDestroy() {
    if (this.messageTransaction) {
      this.messageTransaction.unsubscribe();
    }

    this.executeTransaction.resetMessage();
  }

  initState() {
    const state = this.parameterManager.getParameter('navigateStateParameters');
    this.sourceAccountSelected = state?.sourceAccount;
    this.paymentDetail = state?.paymentDetail;
  }

  buildPaymentTable() {
    this.tableLayout = this.tableDefinition.buildTable(this.paymentDetail.participants);

    const amount = String(this.paymentDetail.participants.reduce((sum, account) => sum + account.targetAmount, 0));
    const date = this.paymentDetail.participants.every(account => account.dateCreation === this.paymentDetail.participants[0].dateCreation) ? this.paymentDetail.participants[0].dateCreation : this.utils.getDate();

    this.voucherLayout = this.voucherDefinition.buildConfirmationVoucher({
      title: 'payroll:title',
      subtitle: 'payroll:label_subtitle',
      credits: String(this.paymentDetail?.participants.length),
      amount,
      sourceAccount: this.sourceAccountSelected,
      date
    })
  }

  next() {
    this.executeTransaction.execute({
      sourceAccountSelected: this.sourceAccountSelected,
      paymentDetail: this.paymentDetail,
    });

    this.messageTransaction = this.executeTransaction.message$.subscribe({
      next: (message) => {
        if (message) {
          this.showAlert('error', message)
        }
      }
    })

  }


  previous() {
    this.resetState();
    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.HOME_PAYMENT]).finally(() => {});
  }

  resetState() {
    this.parameterManager.sendParameters({
      navigateStateParameters: {
        sourceAccount: this.sourceAccountSelected,
        paymentDetail: this.paymentDetail,
      },
      navigationProtectedParameter: null,
    });
  }

  showAlert(type: string, message: string) {
    this.typeMessage = type;
    this.message = message;
  }

}
