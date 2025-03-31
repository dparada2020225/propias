import { Component, EventEmitter, OnInit } from '@angular/core';
import { AdfFormBuilderService, IDataSelect, ILayout } from '@adf/components';
import { FormGroup } from '@angular/forms';
import { IAccount } from '../../../../../../models/account.inteface';
import { IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { IFlowError } from '../../../../../../models/error.interface';
import { Tm365FormService } from '../../services/definition/tm365-form.service';
import {
  OtdTransferBaseHomeService
} from '../../../transfer-own/services/definition/base/otd-transfer-base-home.service';
import { ETM365FormControlName } from '../../enum/form-control-name.enum';
import { FileType } from '../../../bulk-transfer/models/type-file.enum';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Tm365LoadFileService } from '../../services/execution/tm365-load-file.service';
import { ITM365FileValidationResponse, ITM365InitLoadFileParameters } from '../../interfaces/load-file.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { ETm365UrlCollection } from '../../enum/url-collection.enum';
import { Tm365ModalHelperComponent } from '../tm365-modal-helper/tm365-modal-helper.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import bankListHelperModalJson from '../../data/bank-modal-helper.json';
import {
  BisvGeneralParameters,
  IACHBiesGeneralParameters
} from '../../../../../../models/ach-general-parameters.interface';
import { EMt365MultipleRouteProtected } from '../../enum/route-protected.enum';
import { ITM365HomeState } from '../../interfaces/state.interface';

@Component({
  selector: 'byte-tm365-home',
  templateUrl: './tm365-home.component.html',
  styleUrls: ['./tm365-home.component.scss']
})
export class Tm365HomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  typeMessage = '';
  message = '';

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  settings: IACHBiesGeneralParameters = new BisvGeneralParameters().build();
  sourceAccountList: Array<IAccount> = [];

  sourceAccountSelected: IAccount | undefined = undefined;

  allowedFileTypes: string = '.xlsx, .xls, .txt, .csv'
  errorMessage = 'error:upd_file_required'
  currentFile: File | undefined = undefined;
  fileResponse: ITM365FileValidationResponse | undefined = undefined;
  isSuccessFileUpload = false;
  timeOut: NodeJS.Timeout | undefined = undefined;

  get titleMessage() {
    return this.typeMessage === 'success' ? 'payroll:success_file_upload' : 'payroll:error_file_upload'
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

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private activatedRouter: ActivatedRoute,
    private formDefinitionService: Tm365FormService,
    private adfFormBuilderService: AdfFormBuilderService,
    private ownTransferBaseUtil: OtdTransferBaseHomeService,
    private tm365LoadFile: Tm365LoadFileService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initFormDefinition();
    this.utils.hideLoader();
  }

  initState() {
    this.getSourceAccountList();
    this.getGeneralParameters();
  }

  getSourceAccountList() {
    const sourceAccountListResponse = this.activatedRouter.snapshot.data['sourceAccountList'];

    if (sourceAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (sourceAccountListResponse as IFlowError).message);
      return;
    }

    this.sourceAccountList = sourceAccountListResponse;
  }

  getGeneralParameters() {
    const settingResponse = this.activatedRouter.snapshot.data['settings'];

    if (settingResponse.hasOwnProperty('error')) {
      this.showAlert('error', (settingResponse as IFlowError).message);
      return;
    }

    this.settings = settingResponse;
  }


  initFormDefinition() {
    this.formLayout = this.formDefinitionService.buildFormLayoutDefinition();
    this.form = this.adfFormBuilderService.formDefinition(this.formLayout.attributes);
    this.buildFormOptions();
    this.setPersistenceData();
    this.changeForm();
  }

  setPersistenceData() {
    const state = this.parameterManagement.getParameter<ITM365HomeState>(PROTECTED_PARAMETER_STATE);
    if (!state) return;

    const { formValues } = state;
    const isFoundSourceAccount = this.utils.findSourceAccount(formValues.sourceAccount, this.sourceAccountList);

    if (isFoundSourceAccount) {
      this.form.patchValue({
        sourceAccount: formValues.sourceAccount,
      });
    }

    this.form.patchValue({
      amount: formValues.amount,
      credits: formValues.credits,
    });
  }

  buildFormOptions() {
    const options = this.sourceAccountList.map(account => {
      const acronym = this.utils.getProductAcronym(account.product);

      return {
        name: `${acronym} - ${account.account}`,
        value: account.account,
      }
    });

    const dataSelect = {
      controlName: ETM365FormControlName.SOURCE_ACCOUNT,
      data: options,
    }

    this.selectOptions = [dataSelect];
  }

  changeForm() {
    this.form.get(ETM365FormControlName.SOURCE_ACCOUNT)?.valueChanges.subscribe({
      next: (value) => this.handleChangeSourceAccount(value),
    });
  }

  handleChangeSourceAccount(value: string) {
    const selectedAccount = this.sourceAccountList.find((accountTemp) => accountTemp.account === value);

    if (!selectedAccount) {
      this.sourceAccountSelected = undefined;
      this.formLayout.attributes.forEach((attribute) => {
        if (attribute.controlName === ETM365FormControlName.SOURCE_ACCOUNT) {
          attribute.layoutSelect = [];
        }
      });
      return;
    }

    this.sourceAccountSelected = selectedAccount;
    this.formLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === ETM365FormControlName.SOURCE_ACCOUNT) {
        attribute.layoutSelect = this.ownTransferBaseUtil.buildDebitedAccountSelectAttributes(selectedAccount);
      }
    });
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate(['home']).finally(() => {});
  }

  nextStep() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        sourceAccountSelected: this.sourceAccountSelected,
        formValues: this.form.value,
        targetAccountListFromFile: this.fileResponse?.fileLoaded?.accounts ?? [],
      } as ITM365HomeState,
      [PROTECTED_PARAMETER_ROUTE]: EMt365MultipleRouteProtected.CONFIRMATION,
    });

    this.router.navigate([ETm365UrlCollection.CONFIRMATION]).finally(() => {});
  }


  async getCurrentFile(fileResponse: ITM365FileValidationResponse) {
    this.fileResponse = fileResponse;
  }

  handleRemovedFiles() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }

    this.currentFile = undefined
    this.fileResponse = undefined;
    this.isSuccessFileUpload = false;
    this.hideAlertValidations();
  }



  async onLoadFile(file: File, emitter: EventEmitter<any>): Promise<any> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const parameters: ITM365InitLoadFileParameters = {
      emitter,
      file,
      settings: this.settings,
      formValues: this.form.value,
    };

    const mappedFileTypes = {
      [FileType.EXCEL]: async () => await this.tm365LoadFile.loadExcelFile(parameters),
      [FileType.EXCEL_ONLINE]: async () => await this.tm365LoadFile.loadExcelFile(parameters),
      [FileType.CSV]: async () => await this.tm365LoadFile.loadCsvFile(parameters),
    }

    if (!mappedFileTypes[file.type]) return;

    return mappedFileTypes[file.type]();
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
      this.showAlertFileValidations('error', 'payroll:error_missing_file');
      return;
    }

    if (!this.fileResponse?.fileLoaded && !this.fileResponse?.isSuccessLoadFile) {
      this.showAlertFileValidations('error', this.fileResponse?.message ?? '');
      this.isSuccessFileUpload = false;
      return;
    }

    this.showAlertFileValidations('success', 'payroll:success_file_upload_message');
    this.isSuccessFileUpload = true;
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
    const modal = this.modalService.open(Tm365ModalHelperComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'}`,
      size: 'lg',
    });

    modal.componentInstance.registers = this.getListOfBanks();

    modal.result.catch(() => {});
  }

  private getListOfBanks() {
    const bankAvailable = this.settings.banks.filter(bank => bank.participant[1] === 'S');
    return bankAvailable.map(bank => {
      return {
        code: bank.code,
        name: bank.description,
        shortName: bank.description,
      }
    });
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
