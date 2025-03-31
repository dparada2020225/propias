import {Component, OnInit} from '@angular/core';
import {PmpldVoucherService} from '../../../services/definition/load/upload-file/pmpld-voucher.service';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {IDataReading} from '@adf/components';
import {ISPLDFormState} from '../../../interfaces/pmp-load-form.interface';
import {UtilService} from '../../../../../../service/common/util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SPPView} from '../../../enums/pmp-view.enum';
import {SPPMTableBody, SPPMTableHeader} from '../../../interfaces/sppd-manually.interface';
import {PmpldTableService} from '../../../services/definition/load/upload-file/pmpld-table.service';
import {SPPMRoutes} from '../../../enums/pmp-routes.enum';
import {PmpLoadFileState, PmpManualHomeState} from '../../../interfaces/pmp-state.interface';

@Component({
  selector: 'byte-pmpl-voucher',
  templateUrl: './pmpl-voucher.component.html',
  styleUrls: ['./pmpl-voucher.component.scss']
})
export class PmplVoucherComponent implements OnInit {
  typeMessage = '';
  message = '';
  voucherLayout!: IDataReading;
  formState!: ISPLDFormState;
  currentView = SPPView.LOAD_FILE;
  registers: Array<SPPMTableBody> = [];
  tableHeaders: Array<SPPMTableHeader> = []

  constructor(
    private voucherDefinition: PmpldVoucherService,
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
    this.showAlert('success', 'payroll:alert_success_load_file')
    const state = this.parameterManagerService.getParameter<PmpLoadFileState>('navigateStateParameters');
    this.formState = state?.formState;
    this.voucherLayout = this.voucherDefinition.buildVoucherLayout({
      title: '',
      subtitle: 'payroll:label_upload_file',
      amount: this.formState.amount,
      credits: this.formState.credits,
    })
  }

  buildManualVoucherLayout() {
    this.showAlert('success', 'payroll:alert_success_manual')
    const state = this.parameterManagerService.getParameter<PmpManualHomeState>('navigateStateParameters');
    this.registers = state.registers;
    this.formState = state?.formState;
    this.tableHeaders = this.sppTableDefinition.tableLoadManuallyHeaders();

    this.voucherLayout = this.voucherDefinition.buildVoucherLayout({
      title: '',
      subtitle: 'payroll:label_enter_payroll',
      credits: this.formState.credits,
      amount: this.formState.amount,
    });
  }

  previous() {
    this.resetState();
    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.HOME]).finally(() => this.utils.hideLoader());
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
