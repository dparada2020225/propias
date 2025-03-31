import { Component, OnInit } from '@angular/core';
import {
  EDonationNavigationProtected,
  EDonationTransferUrlNavigationCollection,
  EDonationViewMode
} from '../../enum/donation.enum';
import { IDonationAccount } from '../../interfaces/donation-account.interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { IDataSelect, ILayout } from '@adf/components';
import { FormGroup } from '@angular/forms';
import { ValidationTriggerTimeService } from 'src/app/service/common/validation-trigger-time.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/service/common/util.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { DteDonationManagerService } from '../../services/execute/dte-donation-manager.service';
import { environment } from '../../../../../../../environments/environment';
import { IIsSchedule } from '../../../../../../models/isSchedule.interface';
import { IFlowError } from '../../../../../../models/error.interface';
import { IDonationState } from '../../interfaces/donation.state.interface';
import { IDTEInitStep1 } from '../../interfaces/donation-execution.interface';
import { AttributeDonation } from '../../enum/donation-transfer-control-name.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';

@Component({
  selector: 'byte-donation-home',
  templateUrl: './donation-home.component.html',
  styleUrls: ['./donation-home.component.scss']
})
export class DonationHomeComponent implements OnInit {
  formLayout!: ILayout;
  form!: FormGroup;
  optionsList: IDataSelect[] = [];
  fundationListAccount: IDonationAccount[] = [];
  debitListAccount: IAccount[] = [];
  accountToDebitSelected: IAccount | null = null;
  fundationAccountSelected: IDonationAccount | null = null;
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  view: EDonationViewMode = EDonationViewMode.DEFAULT;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }


  constructor(
    private parameterManagement: ParameterManagementService,
    private donationExecuteManager: DteDonationManagerService,
    private activatedRoute: ActivatedRoute,
    private util: UtilService,
    private router: Router,
    private validationTriggerTime: ValidationTriggerTimeService,
  ) { }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];

    this.validateDonationTransferSchedule();
    this.handleGetListAccounts();
    this.mainDefinition();
    this.persistsFormValues();
    this.util.hideLoader();
  }

  validateDonationTransferSchedule() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(environment.profile, schedule);
  }

  getFundationAccounts() {
    const responseResolver = this.activatedRoute.snapshot.data['fundationAccounts'];

    if (responseResolver.hasOwnProperty('error')) {
      return;
    }

    this.fundationListAccount = responseResolver;
  }

  getDebitedAccounts() {
    const responseResolver = this.activatedRoute.snapshot.data['debitAccounts'];

    if (responseResolver.hasOwnProperty('error')) {
      return;
    }

    this.debitListAccount = responseResolver;
  }

  handleGetListAccounts() {
    this.getFundationAccounts();
    this.getDebitedAccounts();
  }

  mainDefinition() {
    if (this.view === EDonationViewMode.SIGNATURE_TRACKING) {
      this.buildSignatureTrackingFormLayout();
      this.changeForm();
      return;
    }

    this.buildDefaultFormLayout();
    this.changeForm();
  }

  /* ===================================== DEFAULT TRANSACTION ============================*/

  /* ===================================== SIGNATURE TRACKING  ============================*/

  buildSignatureTrackingFormLayout() {
    const startupParameters: IDTEInitStep1 = {
      title: 'signature_tracking',
      subtitle: 'edit_transaction',
      accountDebitList: this.debitListAccount,
      accountFundationList: this.fundationListAccount
    };

    const {
      error,
      donationLayout,
      optionsList,
      donationTransferForm } = this.donationExecuteManager.formScreenBuilderStep1(startupParameters);

    this.formLayout = donationLayout;
    this.optionsList = optionsList;
    this.form = donationTransferForm;

    if (error) {
      this.showAlert('error', error);
    }
  }

  buildDataToSignatureTrackingVoucher() {
    const donationState: IDonationState = this.parameterManagement.getParameter('navigateStateParameters');

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EDonationNavigationProtected.SIGNATURE_TRACKING_CONFIRMATION,
      navigateStateParameters: {
        debitedAccount: this.accountToDebitSelected,
        fundationAccount: this.fundationAccountSelected,
        formValues: this.form.value,
        transactionManagerDetail: donationState?.transactionManagerDetail,
        transactionSelected: donationState?.transactionSelected,
      } as IDonationState
    });
  }

  /* ===================================== SIGNATURE TRACKING  ============================*/

  buildDefaultFormLayout() {
    const startupParameters: IDTEInitStep1 = {
      title: 'donations-title-forms',
      subtitle: null,
      accountDebitList: this.debitListAccount,
      accountFundationList: this.fundationListAccount
    };

    const {
      error,
      donationLayout,
      optionsList,
      donationTransferForm } = this.donationExecuteManager.formScreenBuilderStep1(startupParameters);

    this.formLayout = donationLayout;
    this.optionsList = optionsList;
    this.form = donationTransferForm;

    if (error) {
      this.showAlert('error', error);
    }
  }

  buildDataToVoucher() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EDonationNavigationProtected.CONFIRMATION,
      navigateStateParameters: {
        debitedAccount: this.accountToDebitSelected,
        fundationAccount: this.fundationAccountSelected,
        formValues: this.form.value,
      } as IDonationState
    });
  }

  /* ===================================== DEFAULT TRANSACTION  ============================*/

  changeForm() {
    this.form.get(AttributeDonation.ACCOUNT_DEBITED)?.valueChanges.subscribe((account) => {
      this.changeDebit(account);
    });

    this.form.get(AttributeDonation.FUNDATION_ACCOUNT)?.valueChanges.subscribe((account) => {
      this.changeCredit(account);
    });
  }

  changeDebit(account: string) {
    if (!account) {
      this.util.removeLayoutSelect(this.formLayout, AttributeDonation.ACCOUNT_DEBITED);
      return;
    }

    this.form.get(AttributeDonation.FUNDATION_ACCOUNT)?.setValue('');

    this.accountToDebitSelected = this.debitListAccount.find((acc) => acc.account === account) as IAccount;
    this.formLayout = this.donationExecuteManager.changeAccountDebitedStep1(account) as ILayout;
  }

  changeCredit(account: string) {
    if (!account) {
      this.util.removeLayoutSelect(this.formLayout, AttributeDonation.FUNDATION_ACCOUNT);
      return;
    }

    this.fundationAccountSelected = this.fundationListAccount.find((acc) => acc.account === account) as IDonationAccount;
    this.formLayout = this.donationExecuteManager.changeAccountFundationStep1(account) as ILayout;
  }

  persistsFormValues() {
    const donationState: IDonationState = this.parameterManagement.getParameter('navigateStateParameters');

    if (!donationState?.formValues && !donationState) { return; }

    const { formValues } = donationState ?? {};

    this.form.patchValue({
      accountDebited: formValues?.accountDebited,
      amount: formValues?.amount,
    });

    setTimeout(() => {
      this.form.get(AttributeDonation.FUNDATION_ACCOUNT)?.setValue(formValues?.fundationAccount);
    }, 10);
  }

  nextStep() {
    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }


    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.util.showLoader();

    if (this.view === EDonationViewMode.SIGNATURE_TRACKING) {
      this.buildDataToSignatureTrackingVoucher();
      this.router.navigate([EDonationTransferUrlNavigationCollection.SIGNATURE_TRACKING_CONFIRMATION]).finally(() => this.util.hideLoader());
      return;
    }

    this.buildDataToVoucher();
    this.router.navigate([EDonationTransferUrlNavigationCollection.DEFAULT_CONFIRMATION]).finally(() => this.util.hideLoader());
  }

  lastStep() {
    this.resetStorage();

    if (this.view === EDonationViewMode.SIGNATURE_TRACKING) {
      this.router.navigate([ESignatureTrackingUrlFlow.HOME]).then(() => {});
      return;
    }

    this.router.navigate(['home']).then(() => {});
  }



  /* ===================================== UTILITIES  ============================*/

  resetStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
  /* ===================================== UTILITIES  ============================*/

}
