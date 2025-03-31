import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  AdfFormBuilderService,
  IDataSelect,
  ILayout,
  DateTimeFormat
} from '@adf/components';
import { IBTFileResponse, ICurrentFile } from '../../models/bulk-transfer.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { EBulkTransactionNavigationProtected } from '../../models/bulk-transfer.enum';
import { of, finalize } from 'rxjs';
import { IAccount } from '../../../../../../models/account.inteface';
import { IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { delay, distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { BtUploadFileHelperModalComponent } from '../bt-upload-file-helper-modal/bt-upload-file-helper-modal.component';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IBulkTransferConfirmState } from '../../interfaces/bulk-transfer-parameters.interface';
import { BtdTransactionManagerService } from '../../services/definition/transaction/btd-transaction-manager.service';
import { EBulkTransferControlName } from '../../enum/bt-control-name.enum';
import { BtValidationsModalComponent } from '../bt-validations-modal/bt-validations-modal.component';
import { IIsSchedule } from '../../../../../../models/isSchedule.interface';
import { IFlowError } from '../../../../../../models/error.interface';
import { EACHTypeSchedule } from '../../../transfer-ach/enum/transfer-ach.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { TransferACHService } from '../../../transfer-ach/services/transaction/transfer-ach.service';
import { IACHScheduleResponse } from '../../../transfer-ach/interfaces/ach-transaction.interface';
import { AttributeFormTransferAch } from '../../../transfer-ach/enum/ach-transfer-control-name.enum';
import moment from 'moment/moment';
import { ParameterManagementService } from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ValidationTriggerTimeService } from '../../../../../../service/common/validation-trigger-time.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { BteFileValidationsService } from '../../services/execution/bte-file-validations.service';
import { EBTUrlNavigateCollection } from '../../enum/bt-navigation.enum';
import { AtdUtilService } from '../../../transfer-ach/services/atd-util.service';
import { LoadSheetFileService } from '../../../../../../service/common/load-sheet-file.service';
import { FileType } from '../../models/type-file.enum';

@Component({
  selector: 'byte-bt-home',
  templateUrl: './bt-home.component.html',
  styleUrls: ['./bt-home.component.scss'],
})
export class BtHomeComponent implements OnInit {
  bulkTransferLayout!: ILayout;
  bulkTransferForm!: FormGroup;
  dateTime: DateTimeFormat | null = null;
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  optionList: IDataSelect[] = [];

  currentFile: ICurrentFile | null = null;
  associatedAccounts: IAchAccount[] = [];
  sourceAccounts: IAccount[] = [];

  sourceAccount: IAccount | null = null;
  isLoadingFile = false;
  isLoading = false;
  fileUploaded: File | null = null;
  isRemoveFileHandle = false;
  listSchedule: IACHScheduleResponse[] = [];
  allowedFileTypes: string = '.xlsx, .csv, .xls'
  profile = this.utils.getProfile();

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }


  get isLoadingSkeleton() {
    return this.isLoading ? 'skeleton-loader' : '';
  }

  constructor(
    private formBuilderService: AdfFormBuilderService,
    private transactionDefinitionManager: BtdTransactionManagerService,
    private router: Router,
    private persistStepStateService: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private transactionService: TransferACHService,
    private validationTriggerTime: ValidationTriggerTimeService,
    private utils: UtilService,
    private fileValidations: BteFileValidationsService,
    private atdUtils: AtdUtilService,
    private loadSheetFile: LoadSheetFileService,
  ) {
  }

  ngOnInit(): void {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data?.["scheduleService"];
    this.validationTriggerTime.validate(this.profile, schedule);


    this.getAccountsFromResolver();
    this.formDefinition();
    this.setDefaultOptions();
    this.showAlert('info', 'label_alert_bulk_transfer');
    this.utils.hideLoader();
  }

  getCurrentFile(currentFile: IBTFileResponse) {
    this.utils.showPulseLoader();
    this.isLoading = !this.isLoading;
    of(true)
      .pipe(delay(3000))
      .pipe(finalize(() => {
        this.utils.hidePulseLoader();
        this.isLoading = !this.isLoading;
      }))
      .subscribe(() => {
        this.currentFile = currentFile?.currentFile;
        this.fileUploaded = currentFile?.file;
        this.utils.scrollToTop();

        if (currentFile.message && currentFile?.messageStatus) {
          this.showAlert(currentFile?.messageStatus, currentFile?.message);
        }

        if (currentFile?.messages && currentFile?.messages?.length > 0) {
          this.modalOfFileValidations(currentFile?.messages);
        }

        if (currentFile.fileStatus === 'success') {
          this.successFile(currentFile);
        }

        this.setDefaultAlert();
      });

  }

  async onLoadFile(file: File, emitter: EventEmitter<any>): Promise<any> {
    switch (file.type) {
      case FileType.EXCEL:
      case FileType.EXCEL_ONLINE:
        return await this.loadExcelFile(file, emitter);
      case FileType.CSV:
        return await this.loadCsvFile(file, emitter);
    }
  }

  async loadExcelFile(file: File, emitter: EventEmitter<any>) {
    try {
      const workSheetValues = await this.loadSheetFile.excel(file);
      console.log(workSheetValues)
      return this.fileValidations.validate({
        file,
        emiteFile: emitter,
        associatedAccounts: this.associatedAccounts,
        sourceAccounts: this.sourceAccounts,
        workSheetRawValues: workSheetValues,
      });
    } catch (error) {
      console.log(error)
      return {
        fileStatus: 'failed',
        message: 'error:upload_file',
        messageStatus: 'warning',
        currentFile: null,
        file: null,
      } as IBTFileResponse;
    }
  }

  async loadCsvFile(file: File, emitter: EventEmitter<any>) {
    try {
      const csvValues = await this.loadSheetFile.csv(file);
      console.log(csvValues)
      return this.fileValidations.validate({
        file,
        emiteFile: emitter,
        associatedAccounts: this.associatedAccounts,
        sourceAccounts: this.sourceAccounts,
        workSheetRawValues: csvValues,
      });
    } catch (error) {
      console.log(error)
      return {
        fileStatus: 'failed',
        message: 'error:upload_file',
        messageStatus: 'warning',
        currentFile: null,
        file: null,
      } as IBTFileResponse;
    }
  }

  successFile(currentFile: IBTFileResponse) {
    this.getCurrentSourceAccount(currentFile?.currentFile?.heading?.sourceAccount!);
    this.formDefinition(true);
    this.changeForm();
    const typeAmount = this.currentFile!.heading.totalAmount > EACHTypeSchedule.LBTR_VALUE ? EACHTypeSchedule.LBTR : EACHTypeSchedule.ACH;

    this.getTransactionSchedule(typeAmount);
    this.bulkTransferForm?.get(EBulkTransferControlName.UPLOAD_FILE)?.setValue(this.fileUploaded?.name);
    this.isLoadingFile = !this.isLoadingFile;
  }

  setDefaultOptions() {
    const option: IDataSelect = {
      controlName: EBulkTransferControlName.HOUR,
      data: [],
    };

    this.optionList.push(option);
  }

  getAccountsFromResolver() {
    this.getACHAssociatedAccounts();
    this.getACHDebitAccounts();
  }

  getACHAssociatedAccounts() {
    const resolverResponse = this.activatedRoute.snapshot.data?.['associatedAccounts'];

    if (resolverResponse.hasOwnProperty('error')) {
      return;
    }

    this.associatedAccounts = resolverResponse as IAchAccount[];
  }

  getACHDebitAccounts() {
    const resolverResponse = this.activatedRoute.snapshot.data?.['sourceAccounts'];

    if (resolverResponse.hasOwnProperty('error')) {
      return;
    }

    this.sourceAccounts = resolverResponse;
  }

  goToConfirmScreen() {
    const parameters: IBulkTransferConfirmState = {
      sourceAccount: this.sourceAccount!,
      currentFile: this.currentFile!,
      formValues: this.bulkTransferForm?.value,
      transactionResponse: null!,
      fileName: this.fileUploaded!.name,
    };

    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: EBulkTransactionNavigationProtected.CONFIRMATION,
      navigateStateParameters: parameters,
    });

    this.router.navigate([EBTUrlNavigateCollection.DEFAULT_CONFIRMATION]).finally(() => this.utils.hideLoader());
  }

  nextStep() {
    if (!this.currentFile) {
      this.showAlert('warning', 'label:empty_file');
      this.utils.scrollToTop();
      this.setDefaultAlert();
      return;
    }

    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    if (!this.bulkTransferForm.valid) {
      this.bulkTransferForm.markAllAsTouched();
      return;
    }

    this.goToConfirmScreen();
  }

  formDefinition(isShowFullForm = false) {
    this.bulkTransferLayout = this.transactionDefinitionManager.buildFormLayout(isShowFullForm);
    this.bulkTransferForm = this.formBuilderService.formDefinition(this.bulkTransferLayout.attributes);
  }

  backToUploadSection() {
    this.utils.showLoader();

    of(true)
      .pipe(delay(500))
      .subscribe({
        next: () => {
          this.isLoadingFile = !this.isLoadingFile;
          this.currentFile = null;
          this.fileUploaded = null;
          this.hideAlert();
          this.formDefinition();
          this.utils.hideLoader();
        },
      });
  }

  handleRemoveErrorAlert() {
    of(this.messageAlert && this.typeAlert)
      .pipe(delay(10000))
      .subscribe(data => {
        if (data) {
          this.showAlert('info', 'label_alert_bulk_transfer');
        }
      });
  }

  setDefaultAlert() {
    of(true)
      .pipe(delay(10000))
      .subscribe(() => {
          this.showAlert('info', 'label_alert_bulk_transfer');
      });
  }

  prevStep() {
    if (this.currentFile) {
      this.utils.showLoader();
      of(true)
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.isLoadingFile = !this.isLoadingFile;
            this.currentFile = null;
            this.fileUploaded = null;
            this.showAlert('info', 'label_alert_bulk_transfer');
            this.formDefinition();
            this.utils.scrollToTop();
            this.utils.hideLoader();
          },
        });
      return;
    }

    this.router.navigate(['home']).then(() => {});
  }

  getCurrentSourceAccount(accountDebited: string) {
    const sourceAccountSelected = this.sourceAccounts.find(acc => acc.account === accountDebited);

    if (!sourceAccountSelected) { return; }

    this.sourceAccount = sourceAccountSelected;
  }

  handleRemovedFiles() {
    this.showAlert('info', 'label_alert_bulk_transfer');
  }

  openDetailModal() {
    const modal = this.modalService.open(BtUploadFileHelperModalComponent, {
      centered: true,
      windowClass: this.profile || 'byte-theme',
      size: 'lg',
    });


    modal.result.then((isConfirm: boolean) => {
      if (!isConfirm) {
        return;
      }
    }).catch(error => error);
  }

  modalOfFileValidations(errors: string[]) {
    const modal = this.modalService.open(BtValidationsModalComponent, {
      centered: true,
      windowClass: this.profile || 'byte-theme',
      size: 'lg',
    });

    modal.componentInstance.listOfErrors = errors;


    modal.result.then((isConfirm: boolean) => {
      this.isRemoveFileHandle = !this.isRemoveFileHandle;

      if (!isConfirm) {
        return;
      }

    }).catch(error => error);
  }

  handleClick() {
    this.openDetailModal();
  }

  changeForm() {
    this.changeScheduleState();

    this.bulkTransferForm.get(EBulkTransferControlName.DATE)?.valueChanges
      .subscribe({
        next: (date) => {
          this.validateDate(date);

        }
      })

    this.bulkTransferForm.get(EBulkTransferControlName.HOUR)?.valueChanges
      .subscribe({
        next: (hour) => {
          this.validateHour(hour);
        }
      })
  }

  changeScheduleState() {
    const scheduleControl = this.bulkTransferForm.get(EBulkTransferControlName.SCHEDULE);
    const dateControl = this.bulkTransferForm.get(EBulkTransferControlName.DATE);
    const hourControl = this.bulkTransferForm.get(EBulkTransferControlName.HOUR);


    scheduleControl?.valueChanges
      .pipe(distinctUntilChanged(), throttleTime(500))
      .subscribe({
        next: (isChecked) => {
          if (isChecked) {
            dateControl?.setValidators([Validators.required]);
            hourControl?.setValidators([Validators.required]);
            dateControl?.enable();
            hourControl?.enable();
          } else {
            dateControl?.setValidators(null);
            hourControl?.setValidators(null);
            dateControl?.disable();
            hourControl?.disable();

            this.bulkTransferForm?.get(EBulkTransferControlName.HOUR)?.setValue('');
            this.bulkTransferForm?.get(EBulkTransferControlName.DATE)?.setValue(null);
          }
          dateControl?.updateValueAndValidity();
          hourControl?.updateValueAndValidity();
        }
      })
  }


  validateDate(date: NgbDate) {
    this.bulkTransferForm?.get(EBulkTransferControlName.HOUR)?.setValue('');
    const currentDate = this.atdUtils.getCurrentDate(date);
    const inputDate = moment(currentDate, 'DD/MM/YYYY', true);

    if (!inputDate.isValid()) {
      this.bulkTransferForm.get(EBulkTransferControlName.DATE)?.setErrors({ date_not_allowed: true });
      return;
    }

    if (date && this.utils.validateCurrentDate(date)) {
      this.bulkTransferForm.get(EBulkTransferControlName.DATE)?.setErrors({ date_not_allowed: true });
    }
  }

  getTransactionSchedule(typeSchedule: EACHTypeSchedule) {
    this.utils.showLoader();
    this.transactionService.getSchedule(typeSchedule)
      .pipe(finalize(() => this.utils.hideLoader()))
      .subscribe({
        next: (response) => {
          this.buildHoursToTransaction(response);
          this.listSchedule = response;
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'fatal-error:getting_ach_transaction_schedule');
        }
      })
  }

  buildHoursToTransaction(listSchedule: IACHScheduleResponse[]) {
    const scheduleParsedOptions = this.atdUtils.buildHoursToTransaction({
      controlName: AttributeFormTransferAch.HOUR,
      listSchedule,
    });

    this.optionList.forEach(option => {
      if (option.controlName === AttributeFormTransferAch.HOUR) {
        option.data = scheduleParsedOptions.data;
      }
    });
  }

  validateHour(hour: string) {
    if (hour) {
      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const selectedHour = this.getDate(this.bulkTransferForm?.getRawValue().date, this.atdUtils.getParsedScheduleValue(hour),
      );

      const isBeforeHourSelected = moment(selectedHour).isBefore(currentDate);

      if (isBeforeHourSelected) {
        this.bulkTransferForm?.controls[AttributeFormTransferAch.HOUR].setErrors({ hour_not_allowed: true });
      }
    }
  }

  getDate(date: NgbDate | null, hour: string) {
    const selectedDate = date ? `${date?.year}-${date?.month}-${date?.day}` : moment().format('YYYY-MM-DD');

    return `${selectedDate} ${hour}`;

  }

  getErrorMessage(message: string) {
    this.showAlert('warning', message);
    this.handleRemoveErrorAlert();
  }

  hideAlert() {
    this.showAlert(undefined!, undefined!);
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
