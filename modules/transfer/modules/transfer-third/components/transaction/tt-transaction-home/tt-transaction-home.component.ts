import {IDataSelect, ILayout, ILayoutAttribute} from '@adf/components';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {EProfile} from 'src/app/enums/profile.enum';
import {IAccount} from 'src/app/models/account.inteface';
import {ITMTransaction} from 'src/app/modules/transaction-manager/interfaces/tm-transaction.interface';
import {
  ITransactionManagerRequestDetail
} from 'src/app/modules/transaction-manager/interfaces/transaction-manger.interface';
import {IThirdTransfersAccounts} from 'src/app/modules/transfer/interface/transfer-data-interface';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {environment} from 'src/environments/environment';
import {AttributeThirdFormTransfer} from '../../../enums/third-transfer-control-name.enum';
import {
  EThirdTransferNavigateParameters,
  EThirdTransferUrlNavigationCollection,
  EThirdTransferViewMode
} from '../../../enums/third-transfer-navigate-parameters.enum';
import {ITTEInitStep1Request} from '../../../interfaces/third-transfer-execution.interface';
import {IThirdTransferTransactionState} from '../../../interfaces/third-transfer-persistence.interface';
import {IThirdTransferFormValues} from '../../../interfaces/third-transfer.interface';
import {TteTransferManagerService} from '../../../services/execution/tte-transfer-manager.service';

@Component({
  selector: 'byte-tt-transaction-home',
  templateUrl: './tt-transaction-home.component.html',
  styleUrls: ['./tt-transaction-home.component.scss'],
})
export class TtTransactionHomeComponent implements OnInit, OnDestroy {
  typeAlert!: string;
  messageAlert!: string;

  formLayout!: ILayout;
  form!: FormGroup;
  optionsList: IDataSelect[] = [];
  accountDebitedList: IAccount[] = [];
  accountCreditList: IThirdTransfersAccounts[] = [];
  accountDebitedSelected!: IAccount;
  accountAccreditSelected!: IThirdTransfersAccounts;
  viewMode: EThirdTransferViewMode = EThirdTransferViewMode.DEFAULT;

  transactionManagerDetail: ITransactionManagerRequestDetail | null = null;
  transactionSelected: ITMTransaction | null = null;
  routerSubscription!: Subscription;

  private profile: string = environment.profile;
  typeProfile: EProfile = EProfile.SALVADOR;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get sourceAccountListToSelect() {
    return this.accountDebitedList.filter((account) => account.currency === this.accountAccreditSelected.currency);
  }

  get classNameForm(): string {
    const classMapForm = {
      [EProfile.SALVADOR]: 'tooltip-sv form-ly-sv'
    }
    return classMapForm[this.profile] || ''
  }

  get classNameButton(): string {
    const className = {
      [EProfile.SALVADOR]: 'no-line_sv hover_button-primary-sv btn-transfer-home'
    }

    return className[this.profile] || ''
  }

  get showNewSelects(): boolean {
    return this.profile === this.typeProfile;
  }

  get sourceAccountAttribute() {
    return this.formLayout.attributes.find((attribute) => attribute.controlName === AttributeThirdFormTransfer.ACCOUNT_ACCREDIT) as ILayoutAttribute;
  }

  get sourceAccountOptions() {
    return this.optionsList.find((option) => option.controlName === AttributeThirdFormTransfer.ACCOUNT_ACCREDIT)?.data || [];
  }

  get debitAccountAttribute() {
    return this.formLayout.attributes.find((attribute) => attribute.controlName === AttributeThirdFormTransfer.ACCOUNT_DEBITED) as ILayoutAttribute;
  }

  get debitAccountOptions() {
    return this.optionsList.find((option) => option.controlName === AttributeThirdFormTransfer.ACCOUNT_DEBITED)?.data || [];
  }

  constructor(
    private router: Router,
    private util: UtilService,
    private activatedRoute: ActivatedRoute,
    private parameterManagement: ParameterManagementService,
    private serviceExecutionManager: TteTransferManagerService
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        this.prevStep();
      }
    });
  }

  ngOnInit(): void {
    this.initDefinition();
    this.initFormDefinition();

    this.util.hideLoader();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  initDefinition() {
    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');
    this.viewMode = this.activatedRoute.snapshot.data['view'];
    this.accountDebitedList = this.activatedRoute.snapshot.data['debitAccounts'] ?? this.accountDebitedList;
    this.accountAccreditSelected = transactionState?.targetAccount;
    this.accountDebitedSelected = transactionState?.sourceAccount ?? (undefined as never);
    this.transactionSelected = transactionState?.transactionSelected ?? null;
    this.transactionManagerDetail = transactionState?.transactionManagerDetail ?? null;

    if (this.profile === this.typeProfile) {
      this.accountCreditList = this.activatedRoute.snapshot.data['associatedThirdAccounts']
    }
  }

  initFormDefinition() {
    if (this.viewMode === EThirdTransferViewMode.DEFAULT) {
      this.formDefaultDefinition();
      return;
    }

    this.formSignatureTrackingDefinition();
  }

  formDefaultDefinition(): void {

    const startupParameters: ITTEInitStep1Request = {
      title: 'transfers-third-title',
      subtitle: undefined as never,
      accountCredit: this.accountAccreditSelected,
      accountDebitedList: this.accountDebitedList,
    };

    if (this.profile === this.typeProfile) {
      startupParameters.accountCreditList = this.accountCreditList;
    }

    const {thirdTransferLayout, thirdTransferForm, optionList, error} =
      this.serviceExecutionManager.formScreenBuilderStep1(startupParameters);

    this.formLayout = thirdTransferLayout;
    this.form = thirdTransferForm;
    this.optionsList = optionList;

    this.changeFormSimple();
    this.handlePersistsFormValue();

    if (this.profile === this.typeProfile) {
      this.form.get(AttributeThirdFormTransfer.ACCOUNT_ACCREDIT)?.setValue(this.accountAccreditSelected.account)
    }

    if (error) {
      this.showAlert('error', error);
    }
  }

  formSignatureTrackingDefinition(): void {
    const associatedAccounts = this.activatedRoute.snapshot.data['associatedThirdAccounts'] ?? [];

    const startupParameters: ITTEInitStep1Request = {
      title: 'signature_tracking_label',
      subtitle: 'edit_transaction',
      accountCredit: this.accountAccreditSelected,
      accountDebitedList: this.accountDebitedList,
      isModifyMode: true,
      accountCreditList: associatedAccounts,
    };

    const {thirdTransferLayout, thirdTransferForm, optionList, error} =
      this.serviceExecutionManager.formScreenBuilderStep1(startupParameters);

    this.formLayout = thirdTransferLayout;
    this.form = thirdTransferForm;
    this.optionsList = optionList;
    this.accountCreditList = associatedAccounts;


    this.changeFormSimple();
    this.handlePersistsFormValueSignatureTracking();


    if (error) {
      this.showAlert('error', error);
    }
  }

  handlePersistsFormValue() {
    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');

    const email = transactionState?.formValues?.email ? transactionState?.formValues?.email : this.accountAccreditSelected?.email ?? '';
    this.form.get(AttributeThirdFormTransfer.EMAIL)?.setValue(email);

    if (!transactionState?.formValues) {
      return;
    }

    const formValues = transactionState?.formValues;

    const sourceAccountFounded = this.util.findSourceAccount<IAccount>(formValues?.accountDebited, this.sourceAccountListToSelect);

    this.form.patchValue({
      amount: formValues?.amount ?? '',
      comment: formValues?.comment ?? '',
    });

    if (sourceAccountFounded) {
      this.form.get(AttributeThirdFormTransfer.ACCOUNT_DEBITED)?.setValue(sourceAccountFounded.account);
    }
  }

  handlePersistsFormValueSignatureTracking() {
    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');

    if (!transactionState && !transactionState?.['formValues']) {
      return;
    }

    const formValues = transactionState?.formValues as IThirdTransferFormValues;

    this.form.patchValue({
      amount: formValues?.amount ?? '',
      comment: formValues?.comment ?? '',
    });

    if (this.findAccount(this.accountAccreditSelected?.account, this.accountCreditList)) {
      this.form.get(AttributeThirdFormTransfer.ACCOUNT_ACCREDIT)?.setValue(this.accountAccreditSelected?.account);
    }
    if (this.findAccount(this.accountDebitedSelected?.account, this.accountDebitedList)) {
      this.form.get(AttributeThirdFormTransfer.ACCOUNT_DEBITED)?.setValue(this.accountDebitedSelected?.account);
    }
  }

  changeFormSimple(): void {

    this.form.get(AttributeThirdFormTransfer.ACCOUNT_DEBITED)?.valueChanges.subscribe((accountNumber) => {
      this.changeDataAccountDebited(accountNumber);
    });

    if ((this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING) || (this.profile === this.typeProfile)) {
      this.form.get(AttributeThirdFormTransfer.ACCOUNT_ACCREDIT)?.valueChanges.subscribe((account) => {
        this.changeDataAccountAccredit(account);
      });
    }

  }

  changeDataAccountDebited(accountNumber: string) {
    if (!accountNumber) {
      this.util.removeLayoutSelect(this.formLayout, AttributeThirdFormTransfer.ACCOUNT_DEBITED);
      return;
    }

    const {
      accountDebited,
      thirdTransferLayout
    } = this.serviceExecutionManager.changeAccountDebitedStep1(accountNumber);
    this.accountDebitedSelected = accountDebited as never;
    this.formLayout = thirdTransferLayout as never;
  }

  changeDataAccountAccredit(accountNumber: string) {
    const {accountAccredit} = this.serviceExecutionManager.changeAccountAccreditStep1(accountNumber);
    this.accountAccreditSelected = accountAccredit as never;

    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');
    const formValues = transactionState?.formValues as IThirdTransferFormValues;

    if (this.viewMode === EThirdTransferViewMode.DEFAULT) {
      const email = accountAccredit?.email ? accountAccredit?.email : formValues?.email ?? '';
      this.form.get("email")?.reset(email);
      this.form.patchValue({
        email: email,
      })
    }

    if (this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING) {
      const email = accountAccredit?.email ? accountAccredit?.email : formValues?.email ?? '';
      this.form.get("email")?.setValue(email)
    }

  }

  goToConfirmationScreen() {
    this.util.showLoader();
    const parameter =
      this.viewMode === EThirdTransferViewMode.DEFAULT
        ? EThirdTransferNavigateParameters.TRANSFER_CONFIRM
        : EThirdTransferNavigateParameters.SIGNATURE_TRACKING_CONFIRM;

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: parameter,
      navigateStateParameters: {
        targetAccount: this.accountAccreditSelected,
        sourceAccount: this.accountDebitedSelected,
        formValues: this.form.value,
        transactionManagerDetail: this.transactionManagerDetail,
        transactionSelected: this.transactionSelected,
      } as IThirdTransferTransactionState,
    });

    if (this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING) {

      this.router.navigate(['/transfer/third/st-confirmation']).finally(() => this.util.hideLoader());
      return;
    }

    this.router.navigate(['/transfer/third/confirmation']).finally(() => this.util.hideLoader());
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.goToConfirmationScreen();
  }

  prevStep() {
    if (this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING) {
      this.util.showLoader();
      this.router.navigate(['/transaction-manager/signature-tracking']).catch(() => {});
      return;
    }

    const mapRouterProfile = {
      [EProfile.SALVADOR]: EThirdTransferUrlNavigationCollection.HOMESV,
      [EProfile.HONDURAS]: EThirdTransferUrlNavigationCollection.HOME,
    }

    this.router.navigate([mapRouterProfile[this.profile] || EThirdTransferUrlNavigationCollection.HOME]).then(() => this.resetStorage());
  }

  findAccount<T = any>(account: string, listAccounts: any[]): string | undefined {
    const findAccount = listAccounts.find((acc) => acc.account === account);

    return findAccount ? findAccount.account : undefined;
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  resetStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }
}
