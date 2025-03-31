import { Component, OnInit } from '@angular/core';
import { IPayrollLoadParticipantsExecuteLoadParameters, PmpLoadFileState, PmpManualHomeState } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-state.interface';
import { SPPView } from '../../../enums/ps-view.enum';
import { ISPPFStructureParsed } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-upload-file.interface';
import { ISPLDFormState } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-load-form.interface';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdfFormatService, IDataReading } from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';
import { environment } from 'src/environments/environment';
import { SPMTableBody, SPMTableHeader } from '../../../interfaces/sp-manually.interface';
import { PSTableService } from '../../../definitions/load/ps-table.service';
import { SPRoutes } from '../../../enums/ps-routes.enum';
import { PaymentOfSupplierRouteProtectedParameter } from '../../../enums/ps-protected-parameter.enum';
import { PsVoucherService } from '../../../definitions/ps-voucher.service';

@Component({
  selector: 'byte-ps-manual-voucher',
  templateUrl: './ps-manual-voucher.component.html',
  styleUrls: ['./ps-manual-voucher.component.scss']
})
export class PsManualVoucherComponent implements OnInit {
  currentView = SPPView.MANUAL;
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  file!: File;
  fileParsed!: ISPPFStructureParsed;

  registers: Array<SPMTableBody> = [];
  voucherLayout!: IDataReading;
  formState!: ISPLDFormState;
  tableHeaders: Array<SPMTableHeader> = []

  constructor(
    private parameterManagerService: ParameterManagementService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private utils: UtilService,
    private voucherDefinition: PsVoucherService,
    private adfFormat: AdfFormatService,
    private sppTableDefinition: PSTableService,
  ) {

   }

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
    this.showAlert('success', 'ps:alert_success_manual')

    const state = this.parameterManagerService.getParameter<PmpManualHomeState>('navigateStateParameters');
    this.registers = state.registers;
    this.tableHeaders = this.sppTableDefinition.PStableLoadManuallyHeaders();

    this.voucherLayout = this.voucherDefinition.buildVoucherLayoutManual({
      title: '',
      credits: this.formState.credits,
      amount: this.formState.amount,
    });
  }

  previous() {
      this.resetState();
      this.utils.showLoader();
      this.router.navigate([SPRoutes.HOME]).finally(() => this.utils.hideLoader());
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
      navigationProtectedParameter: PaymentOfSupplierRouteProtectedParameter.HOME_LOAD_MANUAL,
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
