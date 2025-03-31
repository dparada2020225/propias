import {Component, OnInit} from '@angular/core';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {ISPPFStructureParsed} from '../../../interfaces/pmp-upload-file.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from '../../../../../../service/common/util.service';
import {ISPLDFormState} from '../../../interfaces/pmp-load-form.interface';
import {environment} from '../../../../../../../environments/environment';
import {SPPView} from '../../../enums/pmp-view.enum';
import {SPPMTableBody, SPPMTableHeader} from '../../../interfaces/sppd-manually.interface';
import {AdfFormatService, IDataReading} from '@adf/components';
import {PmpldVoucherService} from '../../../services/definition/load/upload-file/pmpld-voucher.service';
import {PmpldTableService} from '../../../services/definition/load/upload-file/pmpld-table.service';
import {SPPMRoutes} from '../../../enums/pmp-routes.enum';
import {PaymentOfPayrollRouteProtectedParameter} from '../../../enums/pmp-protected-parameter.enum';
import {
  IPayrollLoadParticipantsExecuteLoadParameters,
  PmpLoadFileState,
  PmpManualHomeState
} from '../../../interfaces/pmp-state.interface';
import {SpplLoadpayrollTransactionService} from "../../../services/execution/sppl-loadpayroll-transaction.service";

@Component({
  selector: 'byte-pmpl-confirmation',
  templateUrl: './sppl-confirmation.component.html',
  styleUrls: ['./sppl-confirmation.component.scss']
})
export class SpplConfirmationComponent implements OnInit {
  currentView = SPPView.LOAD_FILE;
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  // NOTE: this variables are only for load file view
  file!: File;
  fileParsed!: ISPPFStructureParsed;

  // NOTE: this variables are only for manually view
  registers: Array<SPPMTableBody> = [];
  voucherLayout!: IDataReading;
  formState!: ISPLDFormState;
  tableHeaders: Array<SPPMTableHeader> = []

  constructor(
    private parameterManagerService: ParameterManagementService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private utils: UtilService,
    private voucherDefinition: PmpldVoucherService,
    private adfFormat: AdfFormatService,
    private sppTableDefinition: PmpldTableService,
    private serviceTransactions: SpplLoadpayrollTransactionService
  ) { }

  get isLoadFileView() {
    return this.currentView === SPPView.LOAD_FILE;
  }

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  ngOnInit(): void {
    this.currentView = this.activatedRouter.snapshot.data['view'];
    this.initSate();
  }

  get credits() {
    return this.formState.credits;
  }

  get totalAmount() {
    return `${environment.currency} ${ this.adfFormat.formatAmount(this.formState.amount ?? 0) }`;
  }

  initSate() {
    const state = this.parameterManagerService.getParameter('navigateStateParameters');
    this.formState = state.formState as ISPLDFormState;

    this.launchView();
  }

  launchView() {
    if (this.currentView === SPPView.LOAD_FILE) {
      const state = this.parameterManagerService.getParameter<PmpLoadFileState>('navigateStateParameters');
      const fileResponse = state.fileUploaded;
      this.file = fileResponse.file as File;
      this.fileParsed = fileResponse.currentFile as ISPPFStructureParsed;
      return;
    }

    this.buildManuallyVoucher();
  }

  buildManuallyVoucher() {
    const state = this.parameterManagerService.getParameter<PmpManualHomeState>('navigateStateParameters');
    this.registers = state.registers;
    this.tableHeaders = this.sppTableDefinition.tableLoadManuallyHeaders();

    this.voucherLayout = this.voucherDefinition.buildVoucherLayout({
      title: '',
      subtitle: 'payroll:label_enter_payroll',
      credits: this.formState.credits,
      amount: this.formState.amount,
    });
  }

  previous() {
    if (this.currentView === SPPView.LOAD_FILE) {
      this.resetState();
      this.utils.showLoader();
      this.router.navigate([SPPMRoutes.HOME]).finally(() => this.utils.hideLoader());
      return;
    }

    this.resetStateForLoadManually();
    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.HOME_LOAD_MANUAL]).finally(() => this.utils.hideLoader());
  }


  next() {
    const parameters: IPayrollLoadParticipantsExecuteLoadParameters = {
      currentView: this.currentView,
      fileParsed: this.fileParsed,
      registers: this.registers
    }

    this.utils.showLoader();
    this.serviceTransactions.execute(parameters)
      .subscribe({
        next: () => {
          if(this.currentView === SPPView.LOAD_FILE){
            this.handleResponseForExecuteLoadFile()
            return
          }
          this.handleResponseForExecuteManually()
        },
        error: (error) => {
          this.utils.hideLoader();
          this.showAlert('error', error?.error?.message ?? 'error:st-missing-connection');
        }
      })
  }

  handleResponseForExecuteLoadFile() {
    this.saveStorageForExecuteLoadFile();
    this.router.navigate([SPPMRoutes.VOUCHER_LOAD_FILE]).finally(() => this.utils.hideLoader());
  }

  handleResponseForExecuteManually() {
    this.saveStorageForExecuteLoadManual();
    this.router.navigate([SPPMRoutes.VOUCHER_LOAD_MANUAL]).finally(() => this.utils.hideLoader());
  }

  saveStorageForExecuteLoadFile() {
    this.parameterManagerService.sendParameters({
      navigateStateParameters: {
        formState: this.formState,
      },
      navigationProtectedParameter: PaymentOfPayrollRouteProtectedParameter.LOAD_FILE_VOUCHER,
    })
  }

  saveStorageForExecuteLoadManual() {
    const state = this.parameterManagerService.getParameter('navigateStateParameters');

    this.parameterManagerService.sendParameters({
      navigateStateParameters: {
        ...state,
      },
      navigationProtectedParameter: PaymentOfPayrollRouteProtectedParameter.LOAD_MANUAL_VOUCHER,
    })
  }


  resetState() {
    this.parameterManagerService.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    })
  }

  resetStateForLoadManually() {
    const state = this.parameterManagerService.getParameter<PmpManualHomeState>('navigateStateParameters');

    this.parameterManagerService.sendParameters({
      navigateStateParameters: {
        ...state,
      },
      navigationProtectedParameter: PaymentOfPayrollRouteProtectedParameter.HOME_LOAD_MANUAL,
    })
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
