import { Component, OnInit } from '@angular/core';
import { AdfFormBuilderService, AdfFormModalComponent, IDataSelect, ILayout } from '@adf/components';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAccount } from '../../../../../../../models/account.inteface';
import { IAchAccount } from '../../../interfaces/ach-account-interface';
import { AteTransferManagerService } from '../../../services/execution/ate-transfer-manager.service';
import { AtdTransferManagerService } from '../../../services/definition/transaction/atd-transfer-manager.service';
import { IAchFormStorageLayout, IAchFormValues } from '../../../interfaces/ach-transfer.interface';
import { IATEInitForm } from '../../../interfaces/ach-transfer-definition.inteface';
import { AttributeFormTransferAch } from '../../../enum/ach-transfer-control-name.enum';
import { EACHNavigationParameters, EACHTransferUrlNavigationCollection } from '../../../enum/navigation-parameter.enum';
import { IACHTransactionNavigateParametersState } from '../../../interfaces/ach-persists-parameters.interface';
import { EACHStatusAccount, EACHTransactionViewMode, EACHTypeSchedule } from '../../../enum/transfer-ach.enum';
import { TransferACHService } from '../../../services/transaction/transfer-ach.service';
import { catchError, delay, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { IACHScheduleResponse } from '../../../interfaces/ach-transaction.interface';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { of } from 'rxjs';
import { AtdCrudManagerService } from '../../../services/definition/crud/atd-crud-manager.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { AtdUtilService } from '../../../services/atd-util.service';
import { UtilTransactionService } from '../../../../../../../service/common/util-transaction.service';
import { AttributeFormCrudAch } from '../../../enum/ach-crud-control-name.enum';
import { IUpdateAchForm } from '../../../interfaces/crud/crud-form.interface';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import { TTransactionResponse } from '../../../../../../../models/utils-transaction.interface';

@Component({
  selector: 'byte-ach-form',
  templateUrl: './ach-form.component.html',
  styleUrls: ['./ach-form.component.scss'],
})
export class AchFormComponent implements OnInit {
  debitedAccountList: IAccount[] = [];

  transferFormLayout!: ILayout;
  transferForm!: FormGroup;
  accountSelected!: IAchAccount | undefined;
  cloneAccountSelected!: IAchAccount | undefined;
  optionList: IDataSelect[] = [];
  accountSelectedDebited: IAccount | null = null;
  formModal!: FormGroup;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  listSchedule: IACHScheduleResponse[] = [];
  hourSelected: IACHScheduleResponse | null = null;
  associatedAccounts: IAchAccount[] = [];

  currentScheduleValue: EACHTypeSchedule = EACHTypeSchedule.ACH;
  isScheduledTransaction = false;
  view: string | null = null;
  regexValidateNameAccount = /^[-a-zA-Z0-9ñÑ]+ [-a-zA-Z0-9ñÑ]+( [-a-zA-Z0-9ñÑ]+)*$/;
  minLengthName = 4;

  propertiesToTestTargetAccount = ['account', 'bank', 'documentNumber', 'type', 'name', 'alias'];

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get accountListToSelect() {
    return this.debitedAccountList.filter(account => account.currency === this.accountSelected?.currencyCode);
  }

  constructor(
    private persistStepStateService: ParameterManagementService,
    private executionManager: AteTransferManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transactionService: TransferACHService,
    private transferManager: AtdTransferManagerService,
    private adfFormDefinition: AdfFormBuilderService,
    private modalService: NgbModal,
    private crudManagerDefinition: AtdCrudManagerService,
    private achTransaction: TransferACHService,
    private  utils: UtilService,
    private atdUtils: AtdUtilService,
    private utilTransaction: UtilTransactionService,
  ) {}

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];
    const storageParameters: IAchFormStorageLayout = this.persistStepStateService.getParameter('navigateStateParameters');
    this.accountSelected = storageParameters?.accountSelected;

    this.initDefinition();
    this.handleGetSchedule();
    this.validateIdBeneficiary();
    this.utils.hideLoader();
  }


  initDefinition() {
    if (this.view === EACHTransactionViewMode.DEFAULT) {
      this.formDefinition();
      this.persistsFormValues();
      return;
    }

    if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
      this.associatedAccounts = this.activatedRoute.snapshot.data['associatedAccounts'] ?? [];
      this.formDefinitionSignatureTrackingModify();
      this.persistsFormForSignatureTracking();
    }
  }

  isValidAccountToTransfer() {
    if (!this.accountSelected) return false;

    const emptyAccountValues = Object.entries(this.accountSelected)
      .filter(([_, value]) => value === '')
      .map((a) => a[0]);

    const isEmpty = this.propertiesToTestTargetAccount.find((a) => emptyAccountValues.some((x) => x === a));

    this.cloneAccountSelected = { ...this.accountSelected } as IAchAccount;
    const name = this.cloneAccountSelected?.name;

    return isEmpty || !this.regexValidateNameAccount.test(name) || name?.length < this.minLengthName;
  }

  validateIdBeneficiary() {
    if (this.isValidAccountToTransfer()) {
      this.openModalToUpdateTargetAccount(this.cloneAccountSelected as IAchAccount);
    }
  }

  handleGetSchedule() {
    const currentAmount = this.transferForm?.getRawValue()?.amount;

    if (currentAmount && Number(currentAmount) > EACHTypeSchedule.LBTR_VALUE) {
      this.getTransactionSchedule(EACHTypeSchedule.LBTR);
      this.currentScheduleValue = EACHTypeSchedule.LBTR;
      return;
    }

    this.getTransactionSchedule(EACHTypeSchedule.ACH);
    this.currentScheduleValue = EACHTypeSchedule.ACH;
  }

  validateDate(date: NgbDate) {
    this.transferForm.get(AttributeFormTransferAch.HOUR)?.setValue('');
    const currentDate = this.atdUtils.getCurrentDate(date);
    const inputDate = moment(currentDate, 'DD/MM/YYYY', true);

    if (!inputDate.isValid()) {
      this.transferForm.get(AttributeFormTransferAch.DATE)?.setErrors({ date_not_allowed: true });
      return;
    }


    if (date && this.utils.validateCurrentDate(date) && inputDate.isValid()) {
      this.transferForm.get(AttributeFormTransferAch.DATE)?.setErrors({ date_not_allowed: true });
    }
  }

  getTransactionSchedule(typeSchedule: EACHTypeSchedule) {
    this.utils.showLoader();

    this.transactionService
      .getSchedule(typeSchedule)
      .pipe(finalize(() => this.utils.hideLoader()))
      .subscribe({
        next: (response) => {
          this.buildHoursToTransaction(response);
          this.listSchedule = response;
          this.setPersistsHour(response);
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'fatal-error:getting_ach_transaction_schedule');
        },
      });
  }

  buildHoursToTransaction(listSchedule: IACHScheduleResponse[]) {
    const { data } = this.atdUtils.buildHoursToTransaction({
      controlName: AttributeFormTransferAch.HOUR,
      listSchedule,
    })

    this.optionList.forEach((option) => {
      if (option.controlName === AttributeFormTransferAch.HOUR) {
        option.data = data;
      }
    });
  }

  formDefinition() {
    this.debitedAccountList = this.activatedRoute.snapshot.data['sourceAccounts'] ?? [];

    const startupParameters: IATEInitForm = {
      title: 'transfers_other_banks',
      subtitle: undefined as never,
      accountCredit: this.accountSelected as never,
      accountDebitedList: this.debitedAccountList,
    };


    const { transferFormLayout, transferForm, optionList, error } = this.executionManager.buildFormScreenBuilder(startupParameters);

    this.transferFormLayout = transferFormLayout;
    this.transferForm = transferForm;
    this.optionList = optionList;
    this.changeForm();

    if (error) {
      this.showAlert('error', error);
    }
  }

  changeForm() {
    this.transferForm.get(AttributeFormTransferAch.ACCOUNT_DEBITED)?.valueChanges.subscribe((accountNumber) => {
      this.handleAccountDebitedChange(accountNumber);
    });

    this.changeScheduleState();

    this.transferForm.get(AttributeFormTransferAch.DATE)?.valueChanges
      .subscribe((date) => {
        this.validateDate(date);
      });

    this.transferForm.get(AttributeFormTransferAch.HOUR)?.valueChanges.subscribe((hour) => {
      this.validateHour(hour);
    });

    if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
      if (this.utils.findSourceAccount(this.accountSelected?.account as string, this.associatedAccounts)) {
        this.transferForm.get(AttributeFormTransferAch.ACCOUNT_CREDIT_NAME)?.setValue(this.accountSelected?.account);
      }

      this.transferForm.get(AttributeFormTransferAch.ACCOUNT_CREDIT_NAME)?.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe({
          next: data => {
            this.changeDataTargetAccount(data);
          }
        });
    }

    this.changeAmount();
  }

  changeDataTargetAccount(accountNumber: string) {
    const { accountAccredit } = this.executionManager.changeTargetAccount(accountNumber);
    this.accountSelected = accountAccredit;
    this.transferFormLayout.attributes = this.utils.injectMask(this.utils.getCurrencySymbolToIso(this.accountSelected?.currency!), AttributeFormTransferAch.AMOUNT, this.transferFormLayout.attributes);
    this.validateIdBeneficiary();
  }

  validateHour(hour: string) {
    if (hour) {
      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const selectedHour = this.getDate(this.transferForm.getRawValue().date, this.atdUtils.getParsedScheduleValue(hour));

      const isBeforeHourSelected = moment(selectedHour).isBefore(currentDate);
      this.hourSelected = this.listSchedule.find((schedule) => schedule.hour === hour) as IACHScheduleResponse;

      if (isBeforeHourSelected) {
        this.transferForm.controls[AttributeFormTransferAch.HOUR].setErrors({ hour_not_allowed: true });
      }
    }
  }

  getDate(date: NgbDate | null, hour: string) {
    const selectedDate = date ? `${date?.year}-${date?.month}-${date?.day}` : moment().format('YYYY-MM-DD');

    return `${selectedDate} ${hour}`;
  }

  changeAmount() {
    this.transferForm.get(AttributeFormTransferAch.AMOUNT)?.valueChanges.subscribe((amount) => {
      if (Number(amount) > EACHTypeSchedule.LBTR_VALUE && this.currentScheduleValue !== EACHTypeSchedule.LBTR) {
        this.currentScheduleValue = EACHTypeSchedule.LBTR;
        this.getTransactionSchedule(EACHTypeSchedule.LBTR);
        return;
      }

      if (Number(amount) < EACHTypeSchedule.LBTR_VALUE && this.currentScheduleValue !== EACHTypeSchedule.ACH) {
        this.currentScheduleValue = EACHTypeSchedule.ACH;
        this.getTransactionSchedule(EACHTypeSchedule.ACH);
      }
    });
  }

  setPersistsHour(response: IACHScheduleResponse[]) {
    if (response) {
      const transferState: IAchFormStorageLayout = this.persistStepStateService.getParameter('navigateStateParameters');
      const formValues = transferState?.formValues as IAchFormValues;

      if (formValues && formValues?.schedule) {
        this.transferForm.get(AttributeFormTransferAch.HOUR)?.setValue(formValues?.hour);
      }
    }
  }

  persistsFormValues() {
    const transferState: IAchFormStorageLayout = this.persistStepStateService.getParameter('navigateStateParameters');
    const formValues = transferState?.formValues as IAchFormValues;

    if (!transferState || !transferState?.formValues) { return; }

    this.transferForm.patchValue({
      amount: formValues?.amount,
      comment: formValues?.comment,
    });

    const sourceAccountFounded = this.utils.findSourceAccount<IAccount>(formValues?.accountDebited, this.accountListToSelect);

    if (sourceAccountFounded) {
      this.transferForm.get(AttributeFormTransferAch.ACCOUNT_DEBITED)?.setValue(sourceAccountFounded.account);
    }

    if (formValues?.schedule) {
      this.transferForm.patchValue({
        date: formValues?.date,
        schedule: formValues?.schedule,
      });
    }
  }

  persistsFormForSignatureTracking() {
    const transferState: IAchFormStorageLayout = this.persistStepStateService.getParameter('navigateStateParameters');
    const formValues = transferState?.formValues as IAchFormValues;

    if (transferState && transferState?.formValues) {
      this.transferForm.patchValue({
        amount: formValues?.amount,
        comment: formValues?.comment,
      });

      of(true)
        .pipe(delay(200))
        .subscribe(() => {
          const isFoundAccount = this.debitedAccountList.find((account) => account.account === formValues?.accountDebited);
          if (isFoundAccount) {
            this.transferForm.get(AttributeFormTransferAch.ACCOUNT_DEBITED)?.setValue(isFoundAccount.account ?? formValues?.accountDebited);
          }
        });

      if (formValues?.schedule) {
        this.transferForm.get(AttributeFormTransferAch.SCHEDULE)?.setValue(formValues?.schedule);
      }

      setTimeout(() => {
        this.transferForm.get(AttributeFormTransferAch.DATE)?.setValue(formValues?.date);
      }, 1000)
    }
  }

  handleAccountDebitedChange(accountNumber: string) {
    if (!accountNumber) {
      this.utils.removeLayoutSelect(this.transferFormLayout, AttributeFormTransferAch.ACCOUNT_DEBITED);
      return;
    }

    const { accountDebited, transferFormLayout } = this.executionManager.handleChangeDebitedAccount(accountNumber);
    this.transferFormLayout = transferFormLayout;
    this.accountSelectedDebited = accountDebited as IAccount;
  }

  nextStep() {
    if (!this.transferForm.valid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    if (this.isValidAccountToTransfer()) {
      this.openModalToUpdateTargetAccount(this.cloneAccountSelected as IAchAccount);
      return;
    }

    if (this.view === EACHTransactionViewMode.DEFAULT) {
      this.saveNavigationProtectedParameter();
      this.goToConfirmation();
      return;
    }

    if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
      this.goToConfirmationModifySignatureTracking();
    }
  }

  lastStep() {
    if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
      this.router.navigate([ESignatureTrackingUrlFlow.HOME]).then(() => {});
      this.resetStorage();
      return;
    }

    this.router.navigate([EACHTransferUrlNavigationCollection.HOME]).then(() => {});
    this.resetStorage();
  }

  goToConfirmation() {
    this.utils.showLoader();

    const propertiesToTransferFormStep: IACHTransactionNavigateParametersState = {
      formValues: this.transferForm.value,
      targetAccount: this.accountSelected as IAchAccount,
      sourceAccount: this.accountSelectedDebited as IAccount,
      accountSelected: this.accountSelected,
      hourSelected: this.hourSelected,
    };

    this.persistStepStateService.sendParameters({
      navigateStateParameters: propertiesToTransferFormStep,
    });

    this.router.navigate([EACHTransferUrlNavigationCollection.DEFAULT_CONFIRMATION]).finally(() => this.utils.hideLoader());
  }

  goToConfirmationModifySignatureTracking() {
    const storageParameters = this.persistStepStateService.getParameter('navigateStateParameters');

    this.utils.showLoader();

    const propertiesToTransferFormStep: IACHTransactionNavigateParametersState = {
      formValues: this.transferForm.value,
      targetAccount: this.accountSelected as IAchAccount,
      sourceAccount: this.accountSelectedDebited as IAccount,
      accountSelected: this.accountSelected,
      transactionSelected: storageParameters?.transactionSelected,
      transactionManagerDetail: storageParameters?.transactionManagerDetail,
      hourSelected: this.hourSelected,
    };

    this.persistStepStateService.sendParameters({
      navigateStateParameters: propertiesToTransferFormStep,
      navigationProtectedParameter: EACHNavigationParameters.CONFIRMATION_UPDATE_MODE,
    });

    this.router.navigate([EACHTransferUrlNavigationCollection.SIGNATURE_TRACKING_CONFIRMATION]).finally(() => this.utils.hideLoader());
  }

  /* ===================================================== MODIFY SIGNATURE TRACKING  =================================================*/

  formDefinitionSignatureTrackingModify() {
    const storageParameters = this.persistStepStateService.getParameter('navigateStateParameters');
    this.debitedAccountList = this.activatedRoute.snapshot.data['sourceAccounts'] ?? [];

    const accountSelected = this.associatedAccounts.find((account) => account.account === storageParameters?.targetAccount?.account);
    this.accountSelected = accountSelected;

    const startupParameters: IATEInitForm = {
      title: 'signature_tracking',
      subtitle: 'edit_transaction',
      accountCredit: accountSelected as IAchAccount,
      accountDebitedList: this.debitedAccountList,
      accountCreditList: this.associatedAccounts,
      isModify: true,
    };

    const { transferFormLayout, transferForm, optionList, error } = this.executionManager.buildFormScreenBuilder(startupParameters);

    this.transferFormLayout = transferFormLayout;
    this.transferForm = transferForm;
    this.optionList = optionList;
    this.changeForm();

    if (error) {
      this.showAlert('error', error);
    }
  }

  /* ===================================================== MODIFY SIGNATURE TRACKING  =================================================*/

  /* ===================================================== UTILITIES =================================================*/

  saveNavigationProtectedParameter() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: EACHNavigationParameters.CONFIRMATION,
    });
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  changeScheduleState() {
    const scheduleControl = this.transferForm.get('schedule');
    const dateControl = this.transferForm.get('date');
    const hourControl = this.transferForm.get('hour');

    scheduleControl?.valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        dateControl?.setValidators([Validators.required]);
        hourControl?.setValidators([Validators.required]);
        dateControl?.enable();
        hourControl?.enable();
        this.isScheduledTransaction = !this.isScheduledTransaction;
      } else {
        dateControl?.setValidators(null);
        hourControl?.setValidators(null);
        dateControl?.disable();
        hourControl?.disable();
        this.hourSelected = null;

        this.transferForm.get(AttributeFormTransferAch.DATE)?.setValue(null);
        this.transferForm.get(AttributeFormTransferAch.HOUR)?.setValue('');
      }
      dateControl?.updateValueAndValidity();
      hourControl?.updateValueAndValidity();
    });
  }

  /* ===================================================== MODAL TO UPDATE IDENTIFIER BENEFICIARY =================================================*/

  openModalToUpdateTargetAccount(accountSelected?: IAchAccount) {
    const modalLayout = this.transferManager.buildModalFormLayout();
    this.formModal = this.adfFormDefinition.formDefinition(modalLayout.attributes);

    const modal = this.modalService.open(AdfFormModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} ach-modify-modal alert-modal ach-modal`,
      size: 'lg',
    });


    modal.dismissed.subscribe({
      next: () => {
        this.utils.showLoader();
        this.lastStep();
      },
    })

    modal.componentInstance.setLayoutModal = modalLayout;
    modal.componentInstance.form = this.formModal;

    this.formModal.patchValue({
      [AttributeFormCrudAch.NAME]: accountSelected?.name,
      [AttributeFormCrudAch.ALIAS]: accountSelected?.alias,
      [AttributeFormCrudAch.IDENTIFY_BENEFICIARY]: accountSelected?.documentNumber,
    });

    modal.componentInstance.executeService = this.executeUpdateAccount.bind(this);

    modal.result.then((response) => {
        if (!response) {
          this.lastStep();
          return;
        }

        if (this.view === EACHTransactionViewMode.DEFAULT) {
          this.handleUpdateAccountServiceResponse(response);
        }

        if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
          this.handleUpdateAccountServiceResponseFromSignatureTracking(response);
        }

      })
      .catch((error) => error);
  }

  handleUpdateAccountServiceResponseFromSignatureTracking(response: TTransactionResponse) {
    if (!response) {
      this.utils.hidePulseLoader();
      return;
    }

    this.utils.hidePulseLoader();

    const associatedAccount = {
      ...this.accountSelected,
      clientId: this.formModal.get(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)?.value,
      documentNumber: this.formModal.get(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)?.value,
      alias: this.formModal.get(AttributeFormCrudAch.ALIAS)?.value,
      name: this.formModal.get(AttributeFormCrudAch.NAME)?.value,
    } as IAchAccount;

    const accountSelectedIndex = this.associatedAccounts.findIndex((account) => account.account === this.accountSelected?.account);

    this.associatedAccounts = [
      ...this.associatedAccounts.slice(0, accountSelectedIndex),
      associatedAccount,
      ...this.associatedAccounts.slice(accountSelectedIndex + 1),
    ];

    this.persistStepStateService.sendParameters({
      navigateStateParameters: {
        ...this.persistStepStateService.getParameter('navigateStateParameters'),
        targetAccount: associatedAccount,
      },
    });

    this.formDefinitionSignatureTrackingModify();
    this.persistsFormForSignatureTracking();
    this.setPersistsHour([]);
  }

  executeUpdateAccount() {
    this.utils.showPulseLoader();

    const rawFormValues: IUpdateAchForm = {
      name: this.formModal.get(AttributeFormCrudAch.NAME)?.value,
      alias: this.formModal.get(AttributeFormCrudAch.ALIAS)?.value,
      identifyBeneficiary: this.formModal.get(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)?.value,
      email: this.accountSelected?.email as string,
      status: EACHStatusAccount[this.cloneAccountSelected?.status as string || 'UNKNOWN'],
    }

    const dataToUpdateAccount = this.crudManagerDefinition.builderDataToUpdate({
      selectedAccount: this.cloneAccountSelected as IAchAccount,
      formValues: rawFormValues,
    });

    const accountNumber = this.cloneAccountSelected?.account as string;
    const bankCode = this.cloneAccountSelected?.bank as number;
    return this.achTransaction.updateAccountAch(dataToUpdateAccount, String(bankCode), accountNumber)
      .pipe(
        finalize(() => this.utils.hidePulseLoader()),
        map(response => this.utilTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilTransaction.handleErrorTransaction(error)))
      );
  }

  handleUpdateAccountServiceResponse(response: TTransactionResponse) {
    if (!response) {
      this.utils.hidePulseLoader();
      return;
    }

    this.utils.hidePulseLoader();
    this.accountSelected = {
      ...this.accountSelected,
      clientId: this.formModal.get(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)?.value,
      documentNumber: this.formModal.get(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)?.value,
      alias: this.formModal.get(AttributeFormCrudAch.ALIAS)?.value,
      name: this.formModal.get(AttributeFormCrudAch.NAME)?.value,
    } as IAchAccount;

    this.persistStepStateService.sendParameters({
      navigateStateParameters: {
        ...this.persistStepStateService.getParameter('navigateStateParameters'),
      },
    });

    this.formDefinition();
  }
}
