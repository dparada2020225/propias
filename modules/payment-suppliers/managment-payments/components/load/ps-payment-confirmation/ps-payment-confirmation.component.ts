import { AdfFormatService, IDataReading } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SPPView } from 'src/app/modules/payroll/manager-payroll/enums/pmp-view.enum';
import { ISPLDFormState } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-load-form.interface';
import { PmpLoadFileState, PmpManualHomeState } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-state.interface';
import { ISPPFStructureParsed } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-upload-file.interface';
import { SPPMTableBody, SPPMTableHeader } from 'src/app/modules/payroll/manager-payroll/interfaces/sppd-manually.interface';
import { PmpldTableService } from 'src/app/modules/payroll/manager-payroll/services/definition/load/upload-file/pmpld-table.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import { SPRoutes } from '../../../enums/ps-routes.enum';
import { SpLoadSupplierTransactionService } from '../../../execution/sp-loadSupplier-transaction.service';
import { ITMUploadUniTrfRequest } from 'src/app/modules/transfer/modules/transfer-ach-uni-multiple/interfaces/ach-uni-tm-transaction';
import { IUserInfo } from 'src/app/models/user-info.interface';
import { PaymentOfSupplierRouteProtectedParameter } from '../../../enums/ps-protected-parameter.enum';
import { PsVoucherService } from '../../../definitions/ps-voucher.service';
import { SPStructureParsed } from '../../../interfaces/ps-upload-file.interface';

@Component({
  selector: 'byte-ps-payment-confirmation',
  templateUrl: './ps-payment-confirmation.component.html',
  styleUrls: ['./ps-payment-confirmation.component.scss']
})
export class PsPaymentConfirmationComponent implements OnInit {
  currentView = SPPView.LOAD_FILE;
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  // NOTE: this variables are only for load file view
  file!: File;
  fileParsed!: SPStructureParsed;

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
    private voucherDefinition: PsVoucherService,
    private adfFormat: AdfFormatService,
    private sppTableDefinition: PmpldTableService,
    private serviceTransactions: SpLoadSupplierTransactionService
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
    //${environment.currency} 
    return `${ this.adfFormat.formatAmount(this.formState.amount ?? 0) }`;
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
      credits: this.formState.credits,
      amount: this.formState.amount,
    });
  }

  previous() {
    if (this.currentView === SPPView.LOAD_FILE) {
      this.resetState();
      this.utils.showLoader();
      this.router.navigate([SPRoutes.HOME]).finally(() => this.utils.hideLoader());
      return;
    }

    this.resetStateForLoadManually();
    this.utils.showLoader();
    this.router.navigate([SPRoutes.HOME]).finally(() => this.utils.hideLoader());
  }

  handleResponseForExecuteLoadFile() {
    this.saveStorageForExecuteLoadFile();
    this.router.navigate([SPRoutes.FILE_VOUCHER]).finally(() => this.utils.hideLoader());
  }

  handleResponseForExecuteManually() {
    this.saveStorageForExecuteLoadManual();
    this.router.navigate([SPRoutes.VOUCHER_LOAD_MANUAL]).finally(() => this.utils.hideLoader());
  }

  saveStorageForExecuteLoadFile() {
    this.parameterManagerService.sendParameters({
      navigateStateParameters: {
        formState: this.formState,
      },
      navigationProtectedParameter: PaymentOfSupplierRouteProtectedParameter.LOAD_FILE_VOUCHER,
    })
  }

  saveStorageForExecuteLoadManual() {
    const state = this.parameterManagerService.getParameter('navigateStateParameters');

    this.parameterManagerService.sendParameters({
      navigateStateParameters: {
        ...state,
      },
      navigationProtectedParameter: PaymentOfSupplierRouteProtectedParameter.LOAD_MANUAL_VOUCHER,
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

  nextStep() {
    const state = this.parameterManagerService.getParameter<PmpLoadFileState>('navigateStateParameters');
    this.utils.showLoader();
    const userInfo: IUserInfo = this.parameterManagerService.getParameter('userInfo');
    this.serviceTransactions.generateCorrelativeParti(userInfo.customerCode).pipe().subscribe({
      next: (authorization) => {
        try {
          this.createLot(authorization.correlative, userInfo);
         /*  const fileName = this.genFileNameProvee(authorization.correlative);
          const fileData = this.generatePagProData();
          const mimeType = 'application/octet-stream'; 
          const formData = this.createMultipartFileRequest(btoa(fileData), fileName, mimeType);

          const request: ITMUploadUniTrfRequest = {
            uploadFile: formData
          }
          
          this.serviceTransactions.fileTransferFTP(request).subscribe({
            next: (response) => {
              this.createLot(authorization.correlative);
            },
            error: (error) => {
              this.showAlert('error', `${error.error?.message ?? 'errorB2B:paymentExecution'}`);
              this.utils.hideLoader();
            }
          }); */
        } catch (e) {
          this.utils.hideLoader();
        }
      },
      error: (error) => {
        this.showAlert('error', `${error.error?.message ?? 'errorB2B:paymentExecution'}`);
        this.utils.hideLoader();
      }
    }
    );
  }

  createLot(correlative, userInfo){
/*     this.serviceTransactions.generateCorrelativeParti().pipe().subscribe({
      next: (authorization) => {
        console.log('authorization', authorization)
        try { */
          const participantes: any[] = [];
          if (this.registers) {
            let correlativeCounter = 0;

            for (const r of this.fileParsed.accounts) {
              const data: any = {
                tipo: 2,
                cuentaDestino: r.accountNumber,
                nombreCuenta: r.accountName,
                correo: r.email ?? '', 
                detalle: r.detail, 
                montoDestino: +r.amount,
                statusCuenta: r.status,
                empresa: +userInfo.customerCode,
                numParti: correlative,
                correlativo: correlativeCounter,
              };
          
              participantes.push(data);
              correlativeCounter++;
            }
          
           
          
          }
          const request = {
            participantes
          };

          this.serviceTransactions.saveLote(request).subscribe({
            next: (response) => {
              if ( response){
                this.router.navigate([SPRoutes.VOUCHER_LOAD_FILE]).finally(() => this.utils.hideLoader());

              }

      
            },
            error: (error) => {
              this.showAlert('error', `${error.error?.message ?? 'errorB2B:paymentExecution'}`);
              this.utils.hideLoader();
            }
          });
/*         } catch (e) {
          this.utils.hideLoader();
        }
      },
      error: (error) => {
        this.showAlert('error', `${error.error?.message ?? 'errorB2B:paymentExecution'}`);
        this.utils.hideLoader();
      }
    }
    ); */
  }
}
