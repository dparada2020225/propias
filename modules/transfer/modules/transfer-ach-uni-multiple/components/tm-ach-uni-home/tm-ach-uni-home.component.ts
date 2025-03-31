import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AchUniTransferService } from '../../../transfer-ach-uni/services/transaction/ach-uni-transfer.service';
import { AchUniStatusTermsResponse } from '../../../transfer-ach-uni/interfaces/ach-uni-status-terms-response';
import { ETmAchUniProtectedNavigation, ETmAchUniUrlCollection } from '../../enum/ach-uni-url-collection';
import { IFlowError } from 'src/app/models/error.interface';
import { IAccount } from 'src/app/models/account.inteface';
import { IACHSettings } from '../../../transfer-ach/interfaces/settings.interface';
import { IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { AdfFormBuilderService, IDataSelect, ILayout } from '@adf/components';
import { FormGroup } from '@angular/forms';
import { TmAchUniFormService } from '../../services/definition/tm-ach-uni-form.service';
import { ETMAchUniFormControlName } from '../../enum/ach-uni-form-control-name.enum';
import { OtdTransferBaseHomeService } from '../../../transfer-own/services/definition/base/otd-transfer-base-home.service';
import { ITMAchiUniValidateDataFile, ITMAchUniCreditInfo, ITMAchUniFileValidationResponse, ITMAchUniInitLoadFileParameters, TMAchUniFileLoadedStructure } from '../../interfaces/ach-uni-load-file.interface';
import { FileType } from '../../../bulk-transfer/models/type-file.enum';
import { TmAchUniLoadFileService } from '../../services/execution/tm-ach-uni-load-file.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TmAchUniHelperComponent } from '../tm-ach-uni-helper/tm-ach-uni-helper.component';
import bankListHelperModalJson from '../../data/bank-modal-helper.json';
import { IUserInfo } from 'src/app/models/user-info.interface';
import { ITMAchUniAchAccount } from '../../interfaces/ach-uni-table.interface';
import { ServiceTypeStatusTermsConditions } from 'src/app/modules/transfer/enum/service-type-status-terms-conditions.enum';
import { CanComponentDeactivate } from '../../guards/verify-terms-conditions.guard';

@Component({
  selector: 'byte-tm-ach-uni-home',
  templateUrl: './tm-ach-uni-home.component.html',
  styleUrls: ['./tm-ach-uni-home.component.scss']
})
export class TmAchUniHomeComponent implements CanComponentDeactivate, OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  sourceAccountList: Array<IAccount> = [];
  targetAccountList: Array<IAchAccount> = [];
  settings: Array<IACHSettings> = [];
  associatedMappedAccounts: Map<string, IAchAccount> = new Map<string, IAchAccount>();
  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];
  sourceAccountSelected: IAccount | undefined = undefined;

  timeOut: NodeJS.Timeout | undefined = undefined;
  allowedFileTypes: string = '.xlsx, .xls, .csv';
  errorMessage = 'error:upd_file_required'
  currentFile: File | undefined = undefined;
  fileResponse: ITMAchUniFileValidationResponse | undefined = undefined;
  isSuccessFileUpload = false;

  typeMessage = '';
  message = '';
  accountNumberInvalid!: string | undefined;

  //variables a mostrar:
  isNextButtonDisabled: boolean = false;

  get titleMessage() {
    return this.typeMessage === 'success' ? 'payroll:success_file_upload' : 'ach_uni:error_file_upload'
  }

  get statusMessageClassName() {
    return this.typeMessage === 'success' ? 'success' : 'error'
  }

  get buttonContainerClassName() {
    return this.isSuccessFileUpload ? 'success-file' : 'filed-file'
  }


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  canDeactivate(): boolean {
    return true;
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private activatedRouter: ActivatedRoute,
    private formDefinitionService: TmAchUniFormService,
    private adfFormBuilderService: AdfFormBuilderService,
    private ownTransferBaseUtil: OtdTransferBaseHomeService,
    private tmAchUniLoadFile: TmAchUniLoadFileService,
    private achUniTransferService: AchUniTransferService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const clientCode = this.parameterManagement.getParameter('userInfo')?.customerCode;
    const serviceType = ServiceTypeStatusTermsConditions.UNI;
    const navigateStateParametersTC = this.parameterManagement.getParameter('AcceptedeStateParametersTC');

    if(navigateStateParametersTC && navigateStateParametersTC.errorCode === '0'){
      this.initState();
      this.initFormDefinition();
      this.utils.hideLoader();
    }else{
      this.achUniTransferService.getStatusTermsConditions(serviceType, clientCode).subscribe({
        next: (res: AchUniStatusTermsResponse) => {
          if (res.result === 'S' && res.errorCode === '0') {
            this.initState();
            this.initFormDefinition();
            this.utils.hideLoader();
          } else {
            this.redirectToTermsConditionsNoAcepted(res);
          }
        },
        error: (error) => {
          this.redirectToTermsConditions({
            result: error,
            errorCode: '500',
            errorDescription: error?.error?.errorDescription ? error.error.errorDescription : error.error.message
          });
        }
      })
    }
  }

  private redirectToTermsConditionsNoAcepted(res: AchUniStatusTermsResponse): void {
    this.parameterManagement.sendParameters({
      navigateStateParametersTC: {
        result: res.result,
        errorCode: res.errorCode,
        errorDescription: res.errorDescription
      },
      navigationProtectedParameter: ETmAchUniProtectedNavigation.TERMS_CONDITIONS,
    });
    this.router.navigate([ETmAchUniUrlCollection.TERMS_CONDITIONS]).finally(() => this.utils.hideLoader());

  }

  private redirectToTermsConditions(res: AchUniStatusTermsResponse): void {
    this.parameterManagement.sendParameters({
      navigateStateParametersTC: {
        result: res.result,
        errorCode: res.errorCode,
        errorDescription: res.errorDescription
      },
      navigationProtectedParameter: ETmAchUniProtectedNavigation.TERMS_CONDITIONS,
    });
    this.router.navigate([ETmAchUniUrlCollection.TERMS_CONDITIONS]).finally(() => this.utils.hideLoader());

  }

  initFormDefinition() {
    this.formLayout = this.formDefinitionService.buildFormLayoutDefinition();
    this.form = this.adfFormBuilderService.formDefinition(this.formLayout?.attributes);
    this.buildFormOptions();
    this.changeForm();
  }

  initState() {
    this.getSourceAccountList();
    // this.getGeneralParameters();
    this.getTargetAccounts();
  }

  getSourceAccountList() {
    const sourceAccountListResponse = this.activatedRouter.snapshot.data['sourceAccountList'];

    if (sourceAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (sourceAccountListResponse as IFlowError).message);
      return;
    }

    this.sourceAccountList = sourceAccountListResponse;
  }

  getTargetAccounts() {
    const targetAccountListResponse = this.activatedRouter.snapshot.data['targetAccountList'];
    if (targetAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (targetAccountListResponse as IFlowError).message);
      return;
    }

    this.targetAccountList = targetAccountListResponse;

    for (const account of  this.targetAccountList) {
      this.associatedMappedAccounts.set(account.account, account);
    }
  }

  buildFormOptions() {
    const options = this.sourceAccountList
    .filter(account => account.status === 'Activa')
    .map(account => {
      const acronym = this.utils.getProductAcronym(account.product);

      return {
        name: `${acronym} - ${account.account}`,
        value: account.account,
      }
    });

    const dataSelect = {
      controlName: ETMAchUniFormControlName.SOURCE_ACCOUNT,
      data: options,
    }

    this.selectOptions = [dataSelect];
  }

  changeForm() {
    this.form.get(ETMAchUniFormControlName.SOURCE_ACCOUNT)?.valueChanges.subscribe({
      next: (value) => this.handleChangeSourceAccount(value),
    });

    this.form.get(ETMAchUniFormControlName.AMOUNT)?.valueChanges.subscribe((amount: number) => {
      this.handleAmountChange(amount);
    });
  }

  handleAmountChange(amount: number){}

  validateAmount(amount: number): boolean {
    if(this.sourceAccountSelected){
      return amount <= this.sourceAccountSelected?.availableAmount;
    }
    return false;
  }

  handleChangeSourceAccount(value: string) {
    const selectedAccount = this.sourceAccountList.find((accountTemp) => accountTemp.account === value);
    if (!selectedAccount) {
      this.sourceAccountSelected = undefined;
      this.formLayout?.attributes.forEach((attribute) => {
        if (attribute.controlName === ETMAchUniFormControlName.SOURCE_ACCOUNT) {
          attribute.layoutSelect = [];
        }
      });
      return;
    }

    this.sourceAccountSelected = selectedAccount;
    this.formLayout?.attributes.forEach((attribute) => {
      if (attribute.controlName === ETMAchUniFormControlName.SOURCE_ACCOUNT) {
        attribute.layoutSelect = this.ownTransferBaseUtil.buildDebitedAccountSelectAttributes(selectedAccount);
      }
    });
    this.form.controls[ETMAchUniFormControlName.AMOUNT].reset();
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate(['home']).finally(() => {});
  }

  nextStep() {
    this.utils.showLoader();
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const requestValidation: ITMAchiUniValidateDataFile = {
      clientNumber: userInfo.customerCode,
      creditCount: String(this.fileResponse?.fileLoaded?.accounts.length),
      amount: this.form.controls[ETMAchUniFormControlName.AMOUNT].value,
      credits: this.getCreditsToRequest(this.fileResponse?.fileLoaded?.accounts ? this.fileResponse?.fileLoaded?.accounts : [])
    }

    this.tmAchUniLoadFile.validateFileServer(requestValidation).subscribe({
      next: (response: any) => {
        if(response.responseCode !== '0'){
          this.showAlert('error', `${response.responseCode} - ${response.errorMessage}`);
          this.utils.scrollToTop();
        }else{
          this.parameterManagement.sendParameters({
            navigateStateParameters: {
              sourceAccountSelected: this.sourceAccountSelected,
              targetAccountListFromFile: this.fileResponse?.fileLoaded?.accounts ?? [],
              fileResponse: this.fileResponse
            },
            navigationProtectedParameter: ETmAchUniProtectedNavigation.CONFIRMATION,
          });
          this.router.navigate([ETmAchUniUrlCollection.CONFIRMATION]).finally(() => this.utils.hideLoader());
        }

        this.utils.hideLoader();
      },
      error: (error) => {
        this.showAlert('error', error?.error?.errorDescription ? error.error.errorDescription :  error.error.message);
        this.utils.scrollToTop();
        this.utils.hideLoader();
      }
    });
  }

  getCreditsToRequest(listAccounts: Array<ITMAchUniAchAccount>): ITMAchUniCreditInfo[] {

    if(listAccounts.length > 0){
      return listAccounts.map((account: ITMAchUniAchAccount) => {
        const data = account.dataFromFile;
        return {
          bankCode: data.bankCode,
          product: data.product,
          currency: data.currency,
          accountNumber: data.accountNumber,
          amount: String(data.amount),
          description: data.description,
          lineNumber: data.lineNumber
        };
      });
    }else{
      return [];
    }
  }

  async getCurrentFile(fileResponse: ITMAchUniFileValidationResponse) {
    this.fileResponse = fileResponse;
    this.currentFile = fileResponse.fileRaw;
  }

  handleRemovedFiles() {

    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    this.currentFile = undefined
    this.fileResponse = undefined;
    this.isSuccessFileUpload = false;
    this.isNextButtonDisabled = false;
    this.accountNumberInvalid = undefined;
    this.typeAlert = null;
    this.messageAlert = null;
    this.hideAlertValidations();
  }

  async onLoadFile(file: File, emitter: EventEmitter<any>): Promise<any> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    const parameters: ITMAchUniInitLoadFileParameters = {
      emitter,
      file,
      targetAccountList: this.targetAccountList,
      settings: this.settings,
      formValues: this.form.value,
      targetAccountListMap: this.associatedMappedAccounts,
    };

    const mappedFileTypes = {
      [FileType.EXCEL]: async () => await this.tmAchUniLoadFile.loadExcelFile(parameters),
      [FileType.EXCEL_ONLINE]: async () => await this.tmAchUniLoadFile.loadExcelFile(parameters),
      [FileType.CSV]: async () => await this.tmAchUniLoadFile.loadCsvFile(parameters),
    }

    if (!mappedFileTypes[file.type]) return;

    return mappedFileTypes[file.type]();
  }

  validateFile() {

    if (!this.currentFile) {
      this.showAlertFileValidations('error', 'tm-ach-uni:no_select_file');
      return;
    }

    this.utils.showPulseLoader();

    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    const currentFile: File = this.currentFile;
    this.onLoadFile(currentFile, new EventEmitter<any>()).then((res: any) => {
      of(true)
        .pipe(delay(2000))
        .subscribe({
          next: () => {
            const emitter = new EventEmitter<any>();
            emitter.subscribe((response: ITMAchUniFileValidationResponse) => {
              this.fileResponse = response;
              this.utils.hidePulseLoader();
              this.manageResponseFile();
            });

            this.onLoadFile(currentFile, emitter).catch(error => {
              this.showAlertFileValidations('error', 'tm-ach-uni:no_found_select_file');
            });
          },
        });
    }).catch(error => {
      this.showAlertFileValidations('error', 'tm-ach-uni:no_found_select_file');
    });

  }

  manageResponseFile() {
    if(!this.fileResponse?.dataInvalid){

      this.accountNumberInvalid = undefined;

      if (!this.currentFile && !this.fileResponse) {
        this.showAlertFileValidations('error', 'tm-ach-uni:no_found_select_file');
        return;
      }

      if (!this.fileResponse?.fileLoaded && !this.fileResponse?.isSuccessLoadFile) {
        this.showAlertFileValidations('error', this.fileResponse?.message ?? '');
        this.isSuccessFileUpload = false;
        return;
      }

      this.showAlertFileValidations('success', 'tm-ach-uni:success_file');
      this.isSuccessFileUpload = true;
    }else{
      this.accountNumberInvalid = this.fileResponse?.dataInvalid?.accountNumber;
      this.showAlert('error', this.fileResponse?.message ? this.fileResponse?.message: 'tm-ach-uni:line_error_account_not_found_uni');
      this.isSuccessFileUpload = false;
      return;
    }

  }

  hideMessage() {
    this.timeOut = setTimeout(() => {
      this.hideAlertValidations();
    }, 5000)
  }

  getErrorMessage(value: any) {
    this.errorMessage = `${value}`
    this.showAlertFileValidations('error', this.errorMessage)
    this.hideMessage();
  }

  openHelperModal() {
    const modal = this.modalService.open(TmAchUniHelperComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'}`,
      size: 'lg',
    });
    modal.componentInstance.registers = bankListHelperModalJson;
    modal.result.catch(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  showAlertFileValidations(type: string, message: string) {
    this.typeMessage = type;
    this.message = message;
  }

  hideAlertValidations() {
    this.typeMessage = '';
    this.message = '';
  }

}
