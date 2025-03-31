import { AdfFormatService, AdfFormBuilderService, IDataReading, ILayout } from '@adf/components';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ISPLDFormState } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-load-form.interface';
import { SpplmdForm } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-manual-form.interface';
import { PmpLoadHomeState, PmpManualHomeState } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-state.interface';
import { SPPMTableBody, SPPMTableHeader, SPPRegisterBuilder } from 'src/app/modules/payroll/manager-payroll/interfaces/sppd-manually.interface';
import { PmpTransactionService } from 'src/app/modules/payroll/manager-payroll/services/transaction/pmp-transaction.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import { PsVoucherService } from '../../../definitions/ps-voucher.service';
import { SpmdFormService } from '../../../definitions/manually/ps-manual-form.service';
import { SPRoutes } from '../../../enums/ps-routes.enum';
import { PSTableService } from '../../../definitions/load/ps-table.service';
import { SPDRegisterBuilder, SPMTableBody } from '../../../interfaces/sp-manually.interface';
import { PsMForm } from '../../../definitions/manually/ps-manual-form.interface';
import { PaymentOfSupplierRouteProtectedParameter } from '../../../enums/ps-protected-parameter.enum';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';

@Component({
  selector: 'byte-ps-manual-manager',
  templateUrl: './ps-manual-manager.component.html',
  styleUrls: ['./ps-manual-manager.component.scss']
})
export class PsManualManagerComponent extends OnResize {
  typeAlert: string | undefined = undefined;
  messageAlert: string = '';
  formLayout!: ILayout;
  form!: FormGroup;
  voucherLayout!: IDataReading;
  homeFormState!: ISPLDFormState;
  registers: Array<SPMTableBody> = [];
  tableHeaders: Array<SPPMTableHeader> = []


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get totalAmount() {
    return parseFloat(this.registers.reduce((acc, register) => 
      acc + this.utils.parseNumberAsFloat(register.amount), 0).toFixed(2));
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
    private voucherDefinition: PsVoucherService,
    private adfFormatService: AdfFormatService,
    private utils: UtilService,
    private parameterManagerService: ParameterManagementService,
    private formDefinition: SpmdFormService,
    private transactionService: PmpTransactionService,
    private sppTableDefinition: PSTableService,
  ) { 
    super()
  }

  ngOnInit(): void {
    this.initState();
  }

  initState() {
    const state = this.parameterManagerService.getParameter<PmpLoadHomeState>('navigateStateParameters');
    this.homeFormState = state?.formState;
    this.tableHeaders = this.sppTableDefinition.PStableLoadManuallyHeaders();

    this.voucherLayout = this.voucherDefinition.buildVoucherLayoutManual({
      title: '',
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
/* 
    if (accountInList) {
      this.utils.scrollToTop();
      this.showAlert('error', 'ps:error_label_account_duplicated');
      return;
    } */

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
          const currentAmount = this.utils.parseAmountStringToNumber(this.form.get(PsMForm.AMOUNT)?.value);
          //${environment.currency} 
          const parseAmount = `${this.adfFormatService.formatAmount(currentAmount)}`

          const register = new SPDRegisterBuilder()
            .setAccount(account)
            .setAmount(this.form.get(PsMForm.AMOUNT)?.value)
            .setEmail(this.form.get(PsMForm.EMAIL)?.value)
            .setAmountParsed(parseAmount)
            .setName(response.name)
            .setStatus(this.utils.getLabelStatus(response.status ?? 'Error'))
            .setDetail(this.form.get(PsMForm.DETAIL)?.value)
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
      navigationProtectedParameter: PaymentOfSupplierRouteProtectedParameter.LOAD_MANUAL_CONFIRMATION,
    });

    this.router.navigate([SPRoutes.CONFIRMATION_LOAD_MANUAL]).finally(() => this.utils.hideLoader());
  }

  previous() {
    this.resetStorage();
    this.utils.showLoader();
    this.router.navigate([SPRoutes.BATCH]).finally(() => this.utils.hideLoader());
  }

  getRegisters(e) {
    this.registers = e;
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
