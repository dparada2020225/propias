import {IDataSelect, ILayout} from '@adf/components';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {EProfile} from '../../../../../../enums/profile.enum';
import {environment} from '../../../../../../../environments/environment';
import {Subscription} from 'rxjs';
import {ITMTransaction} from '../../../../../transaction-manager/interfaces/tm-transaction.interface';
import {
  ITransactionManagerRequestDetail
} from '../../../../../transaction-manager/interfaces/transaction-manger.interface';
import {EOwnTransferViewMode} from '../../enum/own-transfer.enum';
import {IOwnAccount, IOwnTransferFormValues, IOwnTransferState} from '../../interfaces/own-transfer.interface';
import {ValidationTriggerTimeService} from '../../../../../../service/common/validation-trigger-time.service';
import {OteTransferManagerService} from '../../services/execution/ote-transfer-manager.service';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from '../../../../../../service/common/util.service';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import {
  EOwnTransferProtectedNavigation,
  EOwnTransferUrlNavigationCollection
} from '../../enum/navigation-parameter.enum';
import {AttributeFormTransferOwn} from '../../enum/own-transfer-control-name.enum';
import {distinctUntilChanged} from 'rxjs/operators';
import {IOTEInitStep1Request} from '../../interfaces/own-transfer-execution.interface';
import {IOTDForm} from '../../interfaces/own-transfer-definition.interface';
import {IIsSchedule} from '../../../../../../models/isSchedule.interface';
import {IFlowError} from '../../../../../../models/error.interface';

@Component({
  selector: 'byte-own-home',
  templateUrl: './own-home.component.html',
  styleUrls: ['./own-home.component.scss'],
})
export class OwnHomeComponent implements OnInit, OnDestroy {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  accountDebitList: IOwnAccount[] = [];
  accountCreditList: IOwnAccount[] = [];
  optionsList: IDataSelect[] = [];

  layoutOwnTransfer!: ILayout;
  ownTransferForm!: FormGroup;
  accountDebitedSelected: IOwnAccount | undefined = undefined;
  accountAccreditSelected: IOwnAccount | undefined = undefined;
  viewMode: EOwnTransferViewMode | null = null;
  transactionManagerDetail: ITransactionManagerRequestDetail | null = null;
  transactionSelected: ITMTransaction | null = null;
  sourceAccountSubscription!: Subscription | undefined;
  targetAccountSubscription!: Subscription | undefined;
  typeProfile: string = environment.profile;
  profileSV: EProfile = EProfile.SALVADOR;
  profilePA: EProfile = EProfile.PANAMA;


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get classNameProfile() {
    const classNames = {
      [EProfile.SALVADOR]: 'text-area_sv',
      [EProfile.PANAMA]: 'container_pa',
    }

    return classNames[this.typeProfile] || '';
  }


  constructor(
    private router: Router,
    private util: UtilService,
    private activatedRoute: ActivatedRoute,
    private parameterManagement: ParameterManagementService,
    private executionServiceManager: OteTransferManagerService,
    private validationTriggerTime: ValidationTriggerTimeService
  ) {
  }

  ngOnInit(): void {
    this.viewMode = this.activatedRoute.snapshot.data?.['view'];
    const ownState = this.parameterManagement.getParameter('navigateStateParameters');
    this.transactionManagerDetail = ownState?.transactionManagerDetail ?? null;
    this.transactionSelected = ownState?.transactionSelected ?? null;
    this.validationRangeTriggerTime();
    this.initMainDefinition();
    this.persistsFormValues();
    this.util.hideLoader();
    this.scrollToTop();
  }

  ngOnDestroy() {
    this.sourceAccountSubscription?.unsubscribe();
    this.targetAccountSubscription?.unsubscribe();
  }

  initMainDefinition() {
    if (this.viewMode === EOwnTransferViewMode.DEFAULT) {
      this.mainDefinition({
        title: 'own-transfer',
        subtitle: null!,
      });
      this.resetStorage();
      return;
    }

    this.mainDefinition({
      title: 'signature_tracking_label',
      subtitle: 'edit_transaction',
    });
  }

  validationRangeTriggerTime() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(environment.profile, schedule);
  }

  persistsFormValues() {
    const ownTransferState: IOwnTransferState = this.parameterManagement.getParameter('navigateStateParameters');

    if (!ownTransferState?.formValues && this.handleFoundAccount(ownTransferState?.debitedAccount?.account, this.accountDebitList)) {
      this.ownTransferForm.get(AttributeFormTransferOwn.ACCOUNT_DEBITED)?.setValue(ownTransferState?.debitedAccount?.account);
      return;
    }

    if (!ownTransferState || !ownTransferState?.formValues) {
      return;
    }

    const {formValues} = ownTransferState ?? {};

    this.handleSetAccountValues(formValues);
  }

  handleSetAccountValues(formValues: IOwnTransferFormValues) {
    this.ownTransferForm?.patchValue({
      amount: formValues?.amount,
      comment: formValues?.comment,
    });

    if (this.handleFoundAccount(formValues.accountDebited, this.accountDebitList)) {
      this.ownTransferForm.get(AttributeFormTransferOwn.ACCOUNT_DEBITED)?.setValue(formValues?.accountDebited);
    }

    setTimeout(() => {
      if (this.handleFoundAccount(formValues.accountCredit, this.accountCreditList)) {
        this.ownTransferForm.get(AttributeFormTransferOwn.ACCOUNT_ACCREDIT)?.setValue(formValues?.accountCredit);
      }
    }, 10);
  }

  handleFoundAccount(numberAccount: string, accountList: IOwnAccount[]) {
    return accountList.find((account) => account.account === numberAccount);
  }

  mainDefinition(parameters: IOTDForm): void {
    const {title, subtitle} = parameters ?? {};

    this.accountDebitList = this.activatedRoute.snapshot.data['debitAccounts'] ?? this.accountDebitList;
    this.accountCreditList = this.activatedRoute.snapshot.data['creditAccounts'] ?? this.accountCreditList;

    const startupParameters: IOTEInitStep1Request = {
      title,
      subtitle,
      accountDebitList: this.accountDebitList,
      accountCreditList: this.accountCreditList,
    };

    const {
      error,
      layoutOwnTransfer,
      optionsList,
      ownTransferForm
    } = this.executionServiceManager.formScreenBuilderStep1({
      ...startupParameters,
    });

    this.layoutOwnTransfer = layoutOwnTransfer;
    this.ownTransferForm = ownTransferForm;
    this.optionsList = optionsList;

    if (error) {
      this.showAlert('error', error);
    }

    this.changeForm();
  }

  changeForm() {
    this.sourceAccountSubscription = this.ownTransferForm
      .get(AttributeFormTransferOwn.ACCOUNT_DEBITED)
      ?.valueChanges.subscribe((account) => {
        this.changeDebit(account);
      });

    this.targetAccountSubscription = this.ownTransferForm
      .get(AttributeFormTransferOwn.ACCOUNT_ACCREDIT)
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((account) => {
        this.changeCredit(account);
      });
  }

  changeDebit(account: string) {
    if (!account) {
      this.util.removeLayoutSelect(this.layoutOwnTransfer, AttributeFormTransferOwn.ACCOUNT_DEBITED);
      return;
    }

    this.ownTransferForm.get(AttributeFormTransferOwn.ACCOUNT_ACCREDIT)?.setValue('');
    const {
      accountDebitedSelected,
      layoutOwnTransfer,
      optionsList
    } = this.executionServiceManager.changeAccountDebitedStep1(account);

    this.accountDebitedSelected = accountDebitedSelected;
    this.layoutOwnTransfer = layoutOwnTransfer;
    this.optionsList = optionsList;
  }

  changeCredit(account: string) {
    if (!account) {
      this.util.removeLayoutSelect(this.layoutOwnTransfer as never, AttributeFormTransferOwn.ACCOUNT_ACCREDIT);
      return;
    }

    const {
      accountCreditSelected,
      layoutOwnTransfer,
      optionsList
    } = this.executionServiceManager.changeAccountAccreditStep1(account);

    this.accountAccreditSelected = accountCreditSelected;
    this.layoutOwnTransfer = layoutOwnTransfer;
    this.optionsList = optionsList;
  }

  nextStep() {
    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    if (!this.ownTransferForm?.valid) {
      this.ownTransferForm?.markAllAsTouched();
      return;
    }

    this.util.showLoader();

    const parameter =
      this.viewMode === EOwnTransferViewMode.DEFAULT
        ? EOwnTransferProtectedNavigation.CONFIRMATION
        : EOwnTransferProtectedNavigation.CONFIRMATION_ST_UPDATE_MODE;

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: parameter,
      navigateStateParameters: {
        debitedAccount: this.accountDebitedSelected,
        accreditAccount: this.accountAccreditSelected,
        formValues: this.ownTransferForm.value,
        transactionManagerDetail: this.transactionManagerDetail,
        transactionSelected: this.transactionSelected,
      } as IOwnTransferState,
    });

    if (this.viewMode === EOwnTransferViewMode.DEFAULT) {
      this.router.navigate([EOwnTransferUrlNavigationCollection.DEFAULT_CONFIRMATION]).finally(() => this.util.hideLoader());
      return;
    }

    this.router.navigate([EOwnTransferUrlNavigationCollection.SIGNATURE_TRACKING_CONFIRMATION]).finally(() => this.util.hideLoader());
  }

  lastStep() {
    this.resetStorage();

    if (this.viewMode === EOwnTransferViewMode.DEFAULT) {
      this.router.navigate(['home']).then(() => {
      });
      return;
    }

    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).then(() => {
    });
  }

  resetStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
    });
  }

  scrollToTop() {
    this.util.scrollToTop();
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
