import { IDataReading } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISPLDFormState } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-load-form.interface';
import { SPPMTableBody, SPPMTableHeader } from 'src/app/modules/payroll/manager-payroll/interfaces/sppd-manually.interface';
import { PmpldTableService } from 'src/app/modules/payroll/manager-payroll/services/definition/load/upload-file/pmpld-table.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { PsVoucherService } from '../../../definitions/ps-voucher.service';
import { SPRoutes } from '../../../enums/ps-routes.enum';
import { SPLoadFileState, SPManualHomeState } from '../../../interfaces/sp-state.interface';
import { SPPView } from '../../../enums/ps-view.enum';

@Component({
  selector: 'byte-ps-file-voucher',
  templateUrl: './ps-file-voucher.component.html',
  styleUrls: ['./ps-file-voucher.component.scss']
})
export class PsFileVoucherComponent implements OnInit {
  typeMessage = '';
  message = '';
  voucherLayout!: IDataReading;
  formState!: ISPLDFormState;
  currentView = SPPView.LOAD_FILE;
  registers: Array<SPPMTableBody> = [];
  tableHeaders: Array<SPPMTableHeader> = []

  constructor(
    private voucherDefinition: PsVoucherService,
    private parameterManagerService: ParameterManagementService,
    private utils: UtilService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private sppTableDefinition: PmpldTableService,
  ) { }

  get customShow() {
    return this.message && this.typeMessage ? 'custom_show' : '';
  }

  get isLoadFileView() {
    return this.currentView === SPPView.LOAD_FILE;
  }

  ngOnInit(): void {
    this.currentView = this.activatedRouter.snapshot.data['view'];

    this.initState();
  }


  initState() {
    this.launchView();
  }

  launchView() {
    if (this.currentView === SPPView.LOAD_FILE) {
      this.buildLoadFileVoucherLayout();
      return;
    }

    this.buildManualVoucherLayout();
  }

  buildLoadFileVoucherLayout() {
    this.showAlert('success', 'ps:alert_success_load_file')
    const state = this.parameterManagerService.getParameter<SPLoadFileState>('navigateStateParameters');
    this.formState = state?.formState;
    this.voucherLayout = this.voucherDefinition.buildVoucherLayout({
      title: '',
      amount: this.formState.amount,
      credits: this.formState.credits,
    })
  }

  buildManualVoucherLayout() {
    this.showAlert('success', 'ps:alert_success_manual')
    const state = this.parameterManagerService.getParameter<SPManualHomeState>('navigateStateParameters');
    this.registers = state.registers;
    this.formState = state?.formState;
    this.tableHeaders = this.sppTableDefinition.tableLoadManuallyHeaders();

    this.voucherLayout = this.voucherDefinition.buildVoucherLayout({
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

  showAlert(type: string, message: string) {
    this.typeMessage = type;
    this.message = message;
  }

}
