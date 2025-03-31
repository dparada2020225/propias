import { AdfFormBuilderService, IDataReading, ILayout } from '@adf/components';
import { StorageService } from '@adf/security';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, of } from 'rxjs';
import { EProfile } from 'src/app/enums/profile.enum';
import { PMP_TYPE_FILE, PMP_TYPE_UPLOAD } from 'src/app/modules/payroll/manager-payroll/enums/pmp-file-structure.enum';
import { ISPPFileValidationsResponse } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-upload-file.interface';
import { IBTFileResponse } from 'src/app/modules/transfer/modules/bulk-transfer/models/bulk-transfer.interface';
import { FileType } from 'src/app/modules/transfer/modules/bulk-transfer/models/type-file.enum';
import { LoadSheetFileService } from 'src/app/service/common/load-sheet-file.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import { PsVoucherService } from '../../../definitions/ps-voucher.service';
import { PsFileValidationsService } from '../../../execution/ps-file-validations.service';
import { SPRoutes } from '../../../enums/ps-routes.enum';
import { SimplePaymentSupplierLoadFormAttributes } from '../../../enums/form-attributes.enum';
import { PsmFormService } from '../../../services/upload-file/ps-form.service';
import { SPFormState } from '../../../interfaces/ps-load-form.interface';
import { SPLoadFileState, SPLoadHomeState } from '../../../interfaces/sp-state.interface';
import { PaymentOfSupplierRouteProtectedParameter } from '../../../enums/ps-protected-parameter.enum';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';

@Component({
  selector: 'byte-ps-file-manager',
  templateUrl: './ps-file-manager.component.html',
  styleUrls: ['./ps-file-manager.component.scss']
})
export class PsFileManagerComponent extends OnResize {
  typeMessage = '';
  message = '';
  voucherLayout!: IDataReading;
  formState!: SPFormState;
  formLayout!: ILayout;
  form!: FormGroup;

  allowedFileTypes: string = '.xlsx, .xls, .txt, .csv'
  errorMessage = 'error:upd_file_required'
  currentFile: File | undefined = undefined;
  fileResponse: ISPPFileValidationsResponse | undefined = undefined;
  isSuccessFileUpload = false;
  timeOut: NodeJS.Timeout | undefined = undefined;
  imgUrlLoad:string = "assets/images/private/payroll/load-payroll.svg";
  imgUrlDelete:string = "assets/images/private/payroll/delete-account.svg";
  MAX_REGISTERS_ALLOWED = JSON.parse(this.storageService.getItem('securityParameters'))?.numberPayrollAccounts || 5000;

  showButton = true
  constructor(
    private router: Router,
    private utils: UtilService,
    private voucherDefinition: PsVoucherService,
    private parameterManagerService: ParameterManagementService,
    private formLayoutDefinition: PsmFormService,
    private adfFormBuilder: AdfFormBuilderService,
    private loadSheetFile: LoadSheetFileService,
    private fileValidations: PsFileValidationsService,
    private storageService: StorageService
  ) {
    super()
   }

  ngOnInit(): void {
    const state = this.parameterManagerService.getParameter<SPLoadHomeState>('navigateStateParameters');

    this.formState = state?.formState;
    this.voucherLayout = this.voucherDefinition.buildVoucherLayout({
      title: '',
      amount: this.formState.amount,
      credits: this.formState.credits,
    })

    this.formLayout = this.formLayoutDefinition.buildUploadFormLayout();
    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
  }

  get titleMessage() {
    return this.typeMessage === 'success' ? 'ps:success_file_upload' : 'ps:error_file_upload'
  }

  get statusMessageClassName() {
    return this.typeMessage === 'success' ? 'success' : 'error'
  }

  get buttonContainerClassName() {
    return this.isSuccessFileUpload ? 'success-file' : 'filed-file'
  }

  next() {
    if (!this.isSuccessFileUpload) {
      this.showAlert('error', 'ps:error_file_upload_message');
      return;
    }

    this.saveStorage();
    this.utils.showLoader();
    this.router.navigate([SPRoutes.PAYMENT_CONFIRMATION]).finally(() => this.utils.hideLoader());
  }

  saveStorage() {
    const parameterState: SPLoadFileState = {
      formState: this.formState,
      fileUploaded: this.fileResponse as ISPPFileValidationsResponse,
    }

    this.parameterManagerService.sendParameters({
      navigateStateParameters: parameterState,
      navigationProtectedParameter: PaymentOfSupplierRouteProtectedParameter.LOAD_FILE_CONFIRMATION,
    })
  }

  previous() {
    const stateHomeParameters = {
      formState: {
        [SimplePaymentSupplierLoadFormAttributes.TYPE_LOAD]: PMP_TYPE_UPLOAD.FILE,
        [SimplePaymentSupplierLoadFormAttributes.TYPE_FILE]: PMP_TYPE_FILE.EXCEL,
        [SimplePaymentSupplierLoadFormAttributes.AMOUNT]: this.formState?.amount ?? '0',
        [SimplePaymentSupplierLoadFormAttributes.CREDITS]: this.formState?.credits ?? '0',
      }
    }

    this.parameterManagerService.sendParameters({
      navigateStateParameters: stateHomeParameters,
      navigationProtectedParameter: null
    })


    this.utils.showLoader();
    this.router.navigate([SPRoutes.BATCH]).finally(() => this.utils.hideLoader());
  }


  async getCurrentFile(fileResponse: ISPPFileValidationsResponse) {
    this.utils.hidePulseLoader()
    this.fileResponse = fileResponse;
  }

  handleRemovedFiles() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }

    this.currentFile = undefined
    this.fileResponse = undefined;
    this.isSuccessFileUpload = false;
    this.showButton = true;
    this.hideAlert();
  }


  async onLoadFile(file: File, emitter: EventEmitter<any>): Promise<any> {
    this.utils.showPulseLoader();
    switch (file.type) {
      case FileType.EXCEL:
      case FileType.EXCEL_ONLINE:
        return await this.loadExcelFile(file, emitter);
      case FileType.TXT:
      case FileType.CSV:
        return await this.loadCsvFile(file, emitter);
    }
  }

  validateFile() {
    this.utils.showPulseLoader();

    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }

    of(true)
      .pipe(delay(2000))
      .subscribe({
        next: () => {
          this.utils.hidePulseLoader();
          this.manageResponseFile();
        },
      })
  }

  manageResponseFile() {
    if (!this.currentFile && !this.fileResponse) {
      this.showAlert('error', 'ps:error_missing_file');
      return;
    }

    if (!this.fileResponse?.currentFile && this.fileResponse?.fileStatus === 'failed') {
   
      this.showAlert('error', this.fileResponse.message);
      this.isSuccessFileUpload = false;
      this.showButton = true;
      return;
    }

    this.showAlert('success', 'ps:success_file_upload_message');
    this.isSuccessFileUpload = true;
    this.showButton = false;
  }

  hideMessage() {
    this.timeOut = setTimeout(() => {
      this.hideAlert();
    }, 10000)
  }

  async loadExcelFile(file: File, emitter: EventEmitter<any>) {
    this.utils.showPulseLoader();
    try {
      const workSheetValues = await this.loadSheetFile.excel(file);

      return this.fileValidations.validate({
        file,
        emiteFile: emitter,
        workSheetRawValues: workSheetValues,
        profile: environment.profile as EProfile,
        maxRegistersAllowed: this.MAX_REGISTERS_ALLOWED,
        formValues: {
          credits: this.formState.credits,
          totalAmount: this.formState.amount,
        }
      });
    } catch (error) {
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
      return this.fileValidations.validate({
        file,
        emiteFile: emitter,
        workSheetRawValues: csvValues,
        profile: environment.profile as EProfile,
        maxRegistersAllowed: this.MAX_REGISTERS_ALLOWED,
        formValues: {
          credits: this.formState.credits,
          totalAmount: this.formState.amount,
        }
      });
    } catch (error) {
      return {
        fileStatus: 'failed',
        message: 'error:upload_file',
        messageStatus: 'warning',
        currentFile: null,
        file: null,
      } as IBTFileResponse;
    }
  }

  getErrorMessage(value: any) {
    this.errorMessage = `${value}`
    this.showAlert('error', this.errorMessage)
    this.hideMessage();
  }

  showAlert(type: string, message: string) {
    this.typeMessage = type;
    this.message = message;
  }

  hideAlert() {
    this.typeMessage = '';
    this.message = '';
  }

}
