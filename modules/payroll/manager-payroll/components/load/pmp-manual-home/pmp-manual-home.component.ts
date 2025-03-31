import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AdfFormatService, AdfFormBuilderService, IDataReading, ILayout} from '@adf/components';
import {PmpldVoucherService} from '../../../services/definition/load/upload-file/pmpld-voucher.service';
import {UtilService} from '../../../../../../service/common/util.service';
import {FormGroup} from '@angular/forms';
import {ISPLDFormState} from '../../../interfaces/pmp-load-form.interface';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {PmpmdFormService} from '../../../services/definition/load/manually/pmpmd-form.service';
import {SPPMTableBody, SPPMTableHeader, SPPRegisterBuilder} from '../../../interfaces/sppd-manually.interface';
import {PmpTransactionService} from '../../../services/transaction/pmp-transaction.service';
import {HttpErrorResponse} from '@angular/common/http';
import {SpplmdForm} from '../../../interfaces/pmp-manual-form.interface';
import {finalize} from 'rxjs/operators';
import {environment} from '../../../../../../../environments/environment';
import {PmpldTableService} from '../../../services/definition/load/upload-file/pmpld-table.service';
import {SPPMRoutes} from '../../../enums/pmp-routes.enum';
import {PaymentOfPayrollRouteProtectedParameter} from '../../../enums/pmp-protected-parameter.enum';
import {PmpLoadHomeState, PmpManualHomeState} from '../../../interfaces/pmp-state.interface';

@Component({
  selector: 'byte-pmp-manual-home',
  templateUrl: './pmp-manual-home.component.html',
  styleUrls: ['./pmp-manual-home.component.scss']
})
export class PmpManualHomeComponent implements OnInit {
  typeAlert: string | undefined = undefined;
  messageAlert: string = '';
  formLayout!: ILayout;
  form!: FormGroup;
  voucherLayout!: IDataReading;
  homeFormState!: ISPLDFormState;
  registers: Array<SPPMTableBody> = [];
  tableHeaders: Array<SPPMTableHeader> = []


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get totalAmount() {
    return this.registers.reduce((acc, register) => acc + this.utils.parseNumberAsFloat(register.amount), 0);
  }

  get isEnabledNextButton() {
    const total = this.totalAmount;
    const totalForm = this.utils.parseNumberAsFloat( this.homeFormState.amount);
    const registerForm = this.utils.parseNumberAsFloat( this.homeFormState.credits);
    const registerLength = this.registers.length;

    return total === totalForm && registerLength === registerForm;
  }

  get buttonContainerClassName() {
    return this.isEnabledNextButton ? 'success-file' : 'filed-file'
  }


  constructor(
    private router: Router,
    private adfFormBuilder: AdfFormBuilderService,
    private voucherDefinition: PmpldVoucherService,
    private adfFormatService: AdfFormatService,
    private utils: UtilService,
    private parameterManagerService: ParameterManagementService,
    private formDefinition: PmpmdFormService,
    private transactionService: PmpTransactionService,
    private sppTableDefinition: PmpldTableService,
  ) { }

  ngOnInit(): void {
    this.initState();
  }

  initState() {
    const state = this.parameterManagerService.getParameter<PmpLoadHomeState>('navigateStateParameters');
    this.homeFormState = state?.formState;
    this.tableHeaders = this.sppTableDefinition.tableLoadManuallyHeaders();

    this.voucherLayout = this.voucherDefinition.buildVoucherLayout({
      title: '',
      subtitle: 'payroll:label_enter_payroll',
      credits: this.homeFormState.credits,
      amount: this.homeFormState.amount,
    });

    this.initForm();
    this.persistsState();
  }

  persistsState() {
    const state = this.parameterManagerService.getParameter<PmpManualHomeState>('navigateStateParameters');

    if (!state?.registers) return

    this.registers = state.registers;
  }

  initForm() {
    this.formLayout = this.formDefinition.buildForm({
      title: '',
      subtitle: ''
    })

    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
  }

  addRegister() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const account = this.form.get(SpplmdForm.ACCOUNT)?.value;

    const accountInList = this.registers.find(register => register.accountNumber === account);

    if (accountInList) {
      this.utils.scrollToTop();
      this.showAlert('error', 'payroll:error_label_account_duplicated');
      return;
    }

    if(account.length < 12){
      this.form.get(SpplmdForm.ACCOUNT)?.setErrors({customErrorLength: true});
      return;
    }

    this.setAccountToRegisters(account)
  }

  setAccountToRegisters(account: string) {
    this.utils.showPulseLoader();
    this.transactionService.consult(account)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (response) => {
          const currentAmount = this.utils.parseAmountStringToNumber(this.form.get(SpplmdForm.AMOUNT)?.value);
          const parseAmount = `${environment.currency} ${this.adfFormatService.formatAmount(currentAmount)}`

          const register = new SPPRegisterBuilder()
            .setAccount(account)
            .setAmount(this.form.get(SpplmdForm.AMOUNT)?.value)
            .setEmail(this.form.get(SpplmdForm.EMAIL)?.value)
            .setAmountParsed(parseAmount)
            .setName(response.name)
            .setStatus(this.utils.getLabelStatus(response.status ?? 'Error'))
            .build();

          this.registers = [...this.registers, register];

          this.initForm();
          this.hiddenAlert();
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error.error.message);
          this.utils.scrollToTop();
          this.initForm();
        },
      })
  }

  next() {
    this.utils.showLoader();
    const stateParameters: PmpManualHomeState = {
      formState: this.homeFormState,
      registers: this.registers,
    }

    this.parameterManagerService.sendParameters({
      navigateStateParameters: stateParameters,
      navigationProtectedParameter: PaymentOfPayrollRouteProtectedParameter.LOAD_MANUAL_CONFIRMATION,
    });

    this.router.navigate([SPPMRoutes.CONFIRMATION_LOAD_MANUAL]).finally(() => this.utils.hideLoader());
  }

  previous() {
    this.resetStorage();
    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.HOME_LOAD]).finally(() => this.utils.hideLoader());
  }

  getRegisters(registers: Array<SPPMTableBody>) {
    this.registers = registers;
    this.updateRegistersInStorage();
  }

  updateRegistersInStorage() {
    this.parameterManagerService.sendParameters({
      navigateStateParameters: {
        formState: this.homeFormState,
        registers: this.registers,
      },
    })
  }

  resetStorage() {
    const homeStateParameters: PmpLoadHomeState = {
        formState: this.homeFormState,
    }

    this.parameterManagerService.sendParameters({
      navigateStateParameters: homeStateParameters,
      navigationProtectedParameter: null
    })
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = '';
    this.messageAlert ='';
  }

}
