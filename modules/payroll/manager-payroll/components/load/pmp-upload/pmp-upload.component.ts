import {Component, EventEmitter, OnInit} from '@angular/core';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {UtilService} from '../../../../../../service/common/util.service';
import {Router} from '@angular/router';
import {PmpldVoucherService} from '../../../services/definition/load/upload-file/pmpld-voucher.service';
import {AdfFormBuilderService, IDataReading, ILayout} from '@adf/components';
import {ISPLDFormState} from '../../../interfaces/pmp-load-form.interface';
import {PmpldFormService} from '../../../services/definition/load/upload-file/pmpld-form.service';
import {FormGroup} from '@angular/forms';
import {IBTFileResponse} from '../../../../../transfer/modules/bulk-transfer/models/bulk-transfer.interface';
import {LoadSheetFileService} from '../../../../../../service/common/load-sheet-file.service';
import {PmpeFileValidationsService} from '../../../services/execution/pmpe-file-validations.service';
import {environment} from '../../../../../../../environments/environment';
import {ISPPFileValidationsResponse} from '../../../interfaces/pmp-upload-file.interface';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {FileType} from '../../../../../transfer/modules/bulk-transfer/models/type-file.enum';
import {SPPMRoutes} from '../../../enums/pmp-routes.enum';
import {PaymentOfPayrollRouteProtectedParameter} from '../../../enums/pmp-protected-parameter.enum';
import {PmpLoadFileState, PmpLoadHomeState} from '../../../interfaces/pmp-state.interface';
import {SimplePaymentPayrollLoadFormAttributes} from "../../../enums/form-attributes.enum";
import {PMP_TYPE_FILE, PMP_TYPE_UPLOAD} from "../../../enums/pmp-file-structure.enum";
import {StorageService} from "@adf/security";
import {EProfile} from '../../../../../../enums/profile.enum';

@Component({
  selector: 'byte-pmp-upload',
  templateUrl: './pmp-upload.component.html',
  styleUrls: ['./pmp-upload.component.scss']
})
export class PmpUploadComponent implements OnInit {
  typeMessage = '';
  message = '';
  voucherLayout!: IDataReading;
  formState!: ISPLDFormState;
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

  constructor(
    private router: Router,
    private utils: UtilService,
    private voucherDefinition: PmpldVoucherService,
    private parameterManagerService: ParameterManagementService,
    private formLayoutDefinition: PmpldFormService,
    private adfFormBuilder: AdfFormBuilderService,
    private loadSheetFile: LoadSheetFileService,
    private fileValidations: PmpeFileValidationsService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    const state = this.parameterManagerService.getParameter<PmpLoadHomeState>('navigateStateParameters');

    this.formState = state?.formState;
    this.voucherLayout = this.voucherDefinition.buildVoucherLayout({
      title: '',
      subtitle: 'payroll:label_upload_file',
      amount: this.formState.amount,
      credits: this.formState.credits,
    })

    this.formLayout = this.formLayoutDefinition.buildUploadFormLayout();
    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
  }

  get titleMessage() {
    return this.typeMessage === 'success' ? 'payroll:success_file_upload' : 'payroll:error_file_upload'
  }

  get statusMessageClassName() {
    return this.typeMessage === 'success' ? 'success' : 'error'
  }

  get buttonContainerClassName() {
    return this.isSuccessFileUpload ? 'success-file' : 'filed-file'
  }

  next() {
    if (!this.isSuccessFileUpload) {
      this.showAlert('error', 'payroll:error_file_upload_message');
      return;
    }

    this.saveStorage();
    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.CONFIRMATION_LOAD_FILE]).finally(() => this.utils.hideLoader());
  }

  saveStorage() {
    const parameterState: PmpLoadFileState = {
      formState: this.formState,
      fileUploaded: this.fileResponse as ISPPFileValidationsResponse,
    }

    this.parameterManagerService.sendParameters({
      navigateStateParameters: parameterState,
      navigationProtectedParameter: PaymentOfPayrollRouteProtectedParameter.LOAD_FILE_CONFIRMATION,
    })
  }

  previous() {
    const stateHomeParameters = {
      formState: {
        [SimplePaymentPayrollLoadFormAttributes.TYPE_LOAD]: PMP_TYPE_UPLOAD.FILE,
        [SimplePaymentPayrollLoadFormAttributes.TYPE_FILE]: PMP_TYPE_FILE.EXCEL,
        [SimplePaymentPayrollLoadFormAttributes.AMOUNT]: this.formState?.amount ?? '0',
        [SimplePaymentPayrollLoadFormAttributes.CREDITS]: this.formState?.credits ?? '0',
      }
    }

    this.parameterManagerService.sendParameters({
      navigateStateParameters: stateHomeParameters,
      navigationProtectedParameter: null
    })


    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.HOME_LOAD]).finally(() => this.utils.hideLoader());
  }


  async getCurrentFile(fileResponse: ISPPFileValidationsResponse) {
    this.fileResponse = fileResponse;
  }

  handleRemovedFiles() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }

    this.currentFile = undefined
    this.fileResponse = undefined;
    this.isSuccessFileUpload = false;
    this.hideAlert();
  }


  async onLoadFile(file: File, emitter: EventEmitter<any>): Promise<any> {
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
      this.showAlert('error', 'payroll:error_missing_file');
      return;
    }

    if (!this.fileResponse?.currentFile && this.fileResponse?.fileStatus === 'failed') {
      this.showAlert('error', this.fileResponse.message);
      this.isSuccessFileUpload = false;
      return;
    }

    this.showAlert('success', 'payroll:success_file_upload_message');
    this.isSuccessFileUpload = true;
  }

  hideMessage() {
    this.timeOut = setTimeout(() => {
      this.hideAlert();
    }, 10000)
  }

  async loadExcelFile(file: File, emitter: EventEmitter<any>) {
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
