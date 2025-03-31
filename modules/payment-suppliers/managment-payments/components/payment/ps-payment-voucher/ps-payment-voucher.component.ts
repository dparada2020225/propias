import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { IAccount } from 'src/app/models/account.inteface';
import { UtilService } from 'src/app/service/common/util.service';
import { IGetDataSupplier, PSParticipant } from '../../../interfaces/ps-payment-home.interface';
import { AdfFormatService, AdfFormBuilderService, IConfirmationModal, IDataSelect, IHeadBandAttribute, ILayout, IPossibleValue, ITableStructure } from '@adf/components';
import { SPRoutes } from '../../../enums/ps-routes.enum';
import { FormGroup } from '@angular/forms';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SppFormService } from '../../../definitions/payment/spp-form.service';
import { SPPTableService } from '../../../definitions/payment/spp-table.service';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { PSProofModalComponent } from '../ps-proof-modal/ps-proof-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { PaymentPrintService } from '../../../definitions/print/payment-print.service';
@Component({
  selector: 'byte-ps-payment-voucher',
  templateUrl: './ps-payment-voucher.component.html',
  styleUrls: ['./ps-payment-voucher.component.scss']
})
export class PsPaymentVoucherComponent  extends OnResize  {
  typeMessage = '';
  message = '';
  excelLabels: any;
  paymentResponse
  account

  amount = ''
  paymentDetail!: IGetDataSupplier;
  formLayout!: ILayout;
  form!: FormGroup;
  formSelectOptions: Array<IDataSelect> = [];
  sourceAccountList: Array<IAccount> = [];
  tableLayout!: ITableStructure;
  sourceAccountSelected!: IAccount;
  voucherModalLayout!: IConfirmationModal;
  isPrint = false;

  constructor(
    private utils: UtilService,
    private translate: TranslateService,
    private formDefinitionService: SppFormService,
    private adfFormBuilder: AdfFormBuilderService,
    private tableDefinition: SPPTableService,
    private parameterManager: ParameterManagementService,
    private router: Router,
    private modalService: NgbModal,
    private adfFormatService: AdfFormatService,
    private pdfService: PaymentPrintService,

  ) { 
    super()

    this.translate.onLangChange.subscribe(() =>{
      this.excelLabels = this.buildExcelLabels();
      this.launchView()
    });
  }

  get customShow() {
    return this.message && this.typeMessage ? 'custom_show' : '';
  }


  ngOnInit(): void {
    this.launchView();
    this.excelLabels = this.buildExcelLabels();

  }


  launchView() {
    this.formDefinition();
    this.buildPaymentTable();
  }

  buildPaymentTable() {
    const parseList = this.parseDetailList()
    this.tableLayout = this.tableDefinition.buildTable(parseList ?? []);
    this.utils.hideLoader()
  }




  previous() {
    this.utils.showLoader();
    this.router.navigate([SPRoutes.HOME]).finally(() => this.utils.hideLoader())
  }

  formDefinition() {
    const state = this.parameterManager.getParameter('navigateStateParameters');
    this.sourceAccountSelected = state?.sourceAccount;
    this.paymentDetail = state?.paymentDetail;
    this.paymentResponse = state?.response
    this.account = state.cuentaSeleccionada;
    const participants = this.paymentDetail?.details ?? []
    this.amount = state.amount;
    const date = this.getDate(participants)

    this.formLayout = this.formDefinitionService.buildFormLayoutVoucher({
      title: 'ps:title',
      subtitle: 'ps:payment-button',
      credits: String(this.paymentDetail?.details.length),
      amount: this.amount,
      account: this.account,
      date
    });


    this.voucherModalLayout = this.formDefinitionService.buildFormLayoutVoucherPrint({
      credits: String(this.paymentDetail?.details.length),
      amount: this.amount,
      account: this.account,
      date: this.obtenerFecha(this.paymentResponse.dateTime ?? ''),
      reference: this.paymentResponse.reference ?? '',
      title: 'ps:title',
    });

    this.showAlert('success', this.paymentResponse.errorCode === '039' ? 'ps:sucess_message_send' : 'ps:sucess_message')
    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);

  }
  private getDate(participants: PSParticipant[]): string {
    let date:string;
    if (participants.length > 0) {
      const allAccountsHaveSameDate = participants.every(account => account.fechaCreacion === this.paymentDetail.details[0].fechaCreacion);
      date = allAccountsHaveSameDate ? this.paymentDetail.details[0].fechaCreacion : this.utils.getDateWithoutHour();
    } else {
      date = '';
    }
    return date
  }
  parseDetailList(){

    if ( this.paymentDetail?.details) {
      for ( const detail of this.paymentDetail?.details) {
        if (this.translate.currentLang === 'es') {
          if (detail.estadoCuenta === 'Inactive') {
            detail.estadoCuenta = 'Inactiva';
          }
          if (detail.estadoCuenta === 'Blocked') {
           detail.estadoCuenta = 'Bloqueada';
          }
          if (detail.estadoCuenta === 'Cancelled') {
            detail.estadoCuenta = 'Cancelada';
          }
          if (detail.estadoCuenta === 'Active') {
            detail.estadoCuenta = 'Activa';
          }
    
        } else if (this.translate.currentLang === 'en') {

          if (detail.estadoCuenta === 'Inactiva') {
            detail.estadoCuenta = 'Inactive';
          }
          if (detail.estadoCuenta === 'Bloqueada') {
            detail.estadoCuenta = 'Blocked';
          }
          if (detail.estadoCuenta === 'Cancelada') {
            detail.estadoCuenta = 'Cancelled';
          }
          if (detail.estadoCuenta === 'Activa') {
            detail.estadoCuenta = 'Active';
          }
        
        }
        const parseAmount = `${this.adfFormatService.formatAmount(detail.montoDestino)}`
        detail.montoDestino =  parseAmount

      }
      return this.paymentDetail?.details

    }

    return this.paymentDetail?.details
  }
  showAlert(type: string, message: string) {
    this.typeMessage = type;
    this.message = message;
  }

  printPdf() {
    const voucherModal = this.modalService.open(PSProofModalComponent,
      {
        centered: true,
        windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal-bisv voucher-modal payroll-modal`,
        size: `lg`,
      });
  
    voucherModal.componentInstance.data = this.voucherModalLayout;
    voucherModal.componentInstance.paymentRegisters = this.tableLayout;
  
    voucherModal.result.then(isResult => {
      if (!isResult) {
        return;
      }
  
      this.exportFile();
    }).catch(error => error);
  }

  exportFile() { 
    const test = this.obtenerFecha(this.paymentResponse.dateTime ?? '')
    const dateFormat = this.adfFormatService.getFormatDateTime(this.utils.getDate());
    const data = {
      registers: this.paymentDetail.details,
      fecha: test,
      date: dateFormat,
      labels: this.excelLabels,
      detail: this.paymentDetail,
      credits: String(this.paymentDetail?.details.length),
      amount: this.adfFormatService.formatAmount(+this.amount),
      account: this.account,
      title: 'ps:title',
    };


    const label = this.translate.instant('ps:title') + `${Date.now()}`;
    this.pdfService.pdfGenerate(data, this.paymentResponse.reference ?? '', label, 248, '', undefined, true);
  }
  buildExcelLabels() {
    return {
      labelAccount: this.translate.instant('account').toUpperCase(),
      labelAccountName: this.translate.instant('ach_name_account').toUpperCase(),
      labelStatus: this.translate.instant('state').toUpperCase(),
      labelEmail: this.translate.instant('ps:email_example').toUpperCase(),
      labelDetail: this.translate.instant('ps:detail_example').toUpperCase(),
      labelAmount: this.translate.instant('label.statements.amount').toUpperCase(),
    };
  }
  formatDate(date){
  const [fecha, hora] = date.split(' ');
  
  let [horas, minutos, segundos] = hora.split(':');
  let periodo = 'AM';

  let horasNum = parseInt(horas);

  if (horasNum >= 12) {
    periodo = 'PM';
    if (horasNum > 12) {
      horasNum -= 12; 
    }
  } else if (horasNum === 0) {
    horasNum = 12; 
  }

  const horasConFormato = horasNum.toString().padStart(2, '0');

  return `${fecha} ${horasConFormato}:${minutos}:${segundos} ${periodo}`;
  }

  obtenerFecha(fechaString: string): string {
    if (fechaString !== ''){
      const [fecha, _hora] = fechaString.split(' ');
  
      return fecha;
    }
    return ''
  }
  
  
}
