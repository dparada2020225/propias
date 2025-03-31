import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { IAccount } from 'src/app/models/account.inteface';
import { UtilService } from 'src/app/service/common/util.service';
import { IGetDataSupplier, PSParticipant } from '../../../interfaces/ps-payment-home.interface';
import {
  AdfFormatService,
  AdfFormBuilderService,
  IConfirmationModal,
  IDataReading,
  IDataSelect,
  IHeadBandAttribute,
  ILayout,
  IPossibleValue,
  ITableStructure,
  TableStructuredBuilder
} from '@adf/components';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SppFormService } from '../../../definitions/payment/spp-form.service';
import { SPPTableService } from '../../../definitions/payment/spp-table.service';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { PSProofModalComponent } from '../ps-proof-modal/ps-proof-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { PaymentPrintService } from '../../../definitions/print/payment-print.service';
import { EPaymentSupplierView } from '../../../enums/view.enum';
import { StOperationHandlerService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import { ESignatureTrackingTypeAction } from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import { ITMTransaction } from 'src/app/modules/transaction-manager/interfaces/tm-transaction.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from 'src/app/enums/common-value.enum';
import { subTitleMessage } from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/signature-tracking.enum';
import { ESTButtonMessage } from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-common.enum';
import { ESignatureTrackingUrlFlow } from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import { StProcessAtomicService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/handlers/st-process-atomic.service';

@Component({
  selector: 'byte-sp-st-voucher',
  templateUrl: './sp-st-voucher.component.html',
  styleUrls: ['./sp-st-voucher.component.scss']
})
export class SpStVoucherComponent implements OnInit {
  view: EPaymentSupplierView = EPaymentSupplierView.ST_DETAIL;
  isShowNextButton = false;
  title = ''
  subTitle = '';
  nextButtonMessage = '';
  isShowHeadband = false
  isShowPrintButton = false
  currentStep
  voucherLayout: IDataReading | null = null;
  typeAlert = '';
  messageAlert = '';
  tableLayout: ITableStructure = new TableStructuredBuilder().build();
  position = 0;
  typeMessage = '';
  message = '';
  lstDetails
  get userVirtualScrollInTable() {
    return this.tableLayout && this.tableLayout.items && this.tableLayout.items.length > 8;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private stOperationHandler: StOperationHandlerService,
    private parameterManagement: ParameterManagementService,
    private utils: UtilService,
    private paidSupplierResumeService: SppFormService,
    public tableDefinition: SPPTableService,
    private router: Router,
    private stProcess: StProcessAtomicService,
    private translate: TranslateService,
    private adfFormatService: AdfFormatService
  ) { 
    this.translate.onLangChange.subscribe(() =>{
      this.getSuppliers()
    });
  }
  get customShow() {
    return this.message && this.typeMessage ? 'custom_show' : '';
  }

  ngOnInit(): void {
    this.utils.showLoader()
    this.view = this.activatedRoute.snapshot.data['view'];
    this.isShowNextButton = this.view === EPaymentSupplierView.ST_OPERATION;
    const state = this.parameterManagement.getParameter('navigateStateParameters');


    if (this.view === EPaymentSupplierView.ST_DETAIL) {
      this.title = 'signature_tracking';
      this.subTitle = 'view_detail_transaction';
    } else {
      this.title = 'signature_tracking';
      this.subTitle = subTitleMessage[(state?.action).toLowerCase()]
      this.nextButtonMessage = ESTButtonMessage[(state?.action)];
    }
    this.getSuppliers()

  }
  getSuppliers() {
    const response = this.activatedRoute.snapshot.data['paymentSuppliers'];
    this.lstDetails = response
    if (response.hasOwnProperty('error')) {
      this.showAlert('error', response.error.message);
      return;
    }

    this.geLote()
    const parseList = this.parseDetailList(response)

    this.tableLayout = this.tableDefinition.buildTableTrack(parseList ?? []);

  }
  parseDetailList(details){

    if ( details) {
      for ( const detail of details) {
        if (this.translate.currentLang === 'es') {
          if (detail.statusCuenta === 'Inactive') {
            detail.statusCuenta = 'Inactiva';
          }
          if (detail.statusCuenta === 'Blocked') {
           detail.statusCuenta = 'Bloqueada';
          }
          if (detail.statusCuenta === 'Cancelled') {
            detail.statusCuenta = 'Cancelada';
          }
          if (detail.statusCuenta === 'Active') {
            detail.statusCuenta = 'Activa';
          }
    
        } else if (this.translate.currentLang === 'en') {

          if (detail.statusCuenta === 'Inactiva') {
            detail.statusCuenta = 'Inactive';
          }
          if (detail.statusCuenta === 'Bloqueada') {
            detail.statusCuenta = 'Blocked';
          }
          if (detail.statusCuenta === 'Cancelada') {
            detail.statusCuenta = 'Cancelled';
          }
          if (detail.statusCuenta === 'Activa') {
            detail.statusCuenta = 'Active';
          }
        
        }
        const parseAmount = `${this.adfFormatService.formatAmount(detail.monto)}`
        detail.monto =  parseAmount

      }
      return details

    }

    return details
  }


  next() {
    // hacer validaciones
    this.handleExecuteOperation();
  }

  lastStep() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        position: this.currentStep,
      },
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => {});
  }
  loteNumber(filename: string): string {
      let numericString = filename.replace('P', '').replace('.txt', '');
     // let result = parseInt(numericString, 10);
      return numericString;
  }
  //get de detalle lotes
  geLote(){
    this.paymentMetod()
    const state = this.parameterManagement.getParameter('navigateStateParameters');
    this.utils.hideLoader();

  }
  //VALIDACION DE METHODO DE PAGO
  paymentMetod(){
    const state = this.parameterManagement.getParameter('navigateStateParameters');
    this.buildVoucherStForDetailTransaction(state, this.title, this.subTitle)
  }
  buildVoucherStForDetailTransaction(body, title, subtitle)  {
    this.isShowHeadband = false;
    this.isShowPrintButton = false;
    this.currentStep = body?.position;

    const amount = String(this.lstDetails.reduce((sum, account) => {
      const montoStr = String(account.monto); 
      const sanitizedMonto = montoStr.replace(/,/g, ""); 
      return sum + (+sanitizedMonto);
    }, 0));
        
    const layoutParameters = {
      title: title,
      subtitle: subtitle,
      sourceAccount: body?.sourceAccount,
      transactionSelected: body?.transactionSelected,
      transactionDetail: body?.transactionDetail,
      amount
    }
    
    this.voucherLayout = this.paidSupplierResumeService.buildFormLayoutVoucherTrack(layoutParameters)

   // this.voucherLayout = this.payrollVoucherLayoutDefinitionService.buildVoucherForSignatureTrackingDetail(layoutParameters);
  }

  handleExecuteOperation() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = paymentState?.transactionSelected;
    const position: number = paymentState?.position;
    if (paymentState?.action === ESignatureTrackingTypeAction.PROCESS) {
      this.stProcess.execute('AUTHENTICATION');
      return;
    }

    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action: paymentState?.action
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  formatearNumero(numero: number): string {
    const number = +numero
    if (Number.isInteger(number)) {
      return number.toFixed(2);
    } else {
      return number.toString();
    }
  }
}
