import { Component, OnInit } from '@angular/core';
import { AdfConfirmationModalComponent, IConfirmationModal, IDataReading } from '@adf/components';
import { IPaymentAccount, IPaymentAccountDetail } from '../../interfaces/b2b-payment.interface';
import { IB2bPaymentFormValues, IB2bPaymentState } from '../../interfaces/b2b-payment-state.interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { environment } from '../../../../../../../environments/environment';
import { EB2bPaymentView } from '../../enum/b2b-payment-view.enum';
import { IPrintedData } from 'src/app/modules/transfer/interface/print-data-interface';
import { B2bdPaymentManagerDefinitionService } from '../../service/definition/b2bd-payment-manager-definition.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { IPaymentExecutionDescription } from '../../interfaces/b2b-payment-execution.interface';
import { IB2BDPdfDefinitionParameters } from '../../interfaces/b2bd-pdf.interface';
import { IB2BDModalDefinitionParameters } from '../../interfaces/b2bd-payment-modal.interface';
import { IB2BDPaymentVoucherDefinitionParameters } from '../../interfaces/b2bd-payment-voucher.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { B2bPaymentPrintService } from '../../../../prints/b2b-payment-print.service';
import { TranslateService } from '@ngx-translate/core';
import { IUserInfo } from '../../../../../../models/user-info.interface';

@Component({
  selector: 'byte-b2b-payment-voucher',
  templateUrl: './b2b-payment-voucher.component.html',
  styleUrls: ['./b2b-payment-voucher.component.scss']
})
export class B2bPaymentVoucherComponent implements OnInit {
  voucherLayout!: IDataReading;
  pdfLayout: IPrintedData | null = null;
  modalLayout: IConfirmationModal | null = null;
  accountToPaymentSelected: IPaymentAccount | null = null;
  paymentDetail: IPaymentAccountDetail | null = null;
  formValues: IB2bPaymentFormValues | null = null;
  selectedSourceAccount: IAccount | null = null;
  paymentTransactionResponse: IPaymentExecutionDescription | null = null;
  message: string = '';

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  currency: string = environment.currency;
  view: EB2bPaymentView = EB2bPaymentView.DEFAULT;
  bankName: string = 'BI-BANK CONNECTION';
  userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private managerDefinition: B2bdPaymentManagerDefinitionService,
    private parameterManagement: ParameterManagementService,
    private router: Router,
    private modalService: NgbModal,
    private pdfService: B2bPaymentPrintService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.buildVoucherByView()
  }

  initDefinition() {
    const paymentState: IB2bPaymentState = this.parameterManagement.getParameter('navigateStateParameters');
    this.accountToPaymentSelected = paymentState.accountToPaymentSelected;
    this.paymentDetail = paymentState.paymentDetail;
    this.formValues = paymentState.formValues as IB2bPaymentFormValues;
    this.selectedSourceAccount = paymentState.selectedSourceAccount as IAccount;
    this.paymentTransactionResponse = paymentState?.paymentTransactionResponse as IPaymentExecutionDescription;
  }

  buildVoucherByView() {
    this.buildDefaultVoucher();
  }

  buildDefaultVoucher() {
    const { voucherLayoutProperties, modalLayoutProps, pdfLayoutProps } = this.buildVoucherStartupParameters()

    this.showAlert('success', 'payment_successfully_message');

    this.voucherLayout = this.managerDefinition.buildVoucherLayout({
      ...voucherLayoutProperties
    });

    this.pdfLayout = this.managerDefinition.buildPdfLayout({ ...pdfLayoutProps });
    this.modalLayout = this.managerDefinition.buildModalLayout({ ...modalLayoutProps })

  }

  nextStep() {
    this.openProofModal();
  }

  prevStep() {
    this.resetStorageDefaultTransaction();
    this.router.navigate(['/loan/payment']).then(() => {});
  }

  buildVoucherStartupParameters() {
    const dateTime = this.getEmissionDate();

    const modalLayoutProps: IB2BDModalDefinitionParameters = {
      paymentDetail: this.paymentTransactionResponse as IPaymentExecutionDescription,
      sourceAccount: this.selectedSourceAccount as IAccount,
      b2bADetail: this.paymentDetail as IPaymentAccountDetail,
      dateTime: {
        hour: dateTime?.hour,
        date: dateTime?.date,
      },
      bankName: this.bankName,
      user: this.userInfo,
      currency: this.currency,
    };

    const voucherLayoutProperties: IB2BDPaymentVoucherDefinitionParameters = {
      paymentDetail: this.paymentTransactionResponse as IPaymentExecutionDescription,
      currency: this.currency,
      sourceAccount: this.selectedSourceAccount as IAccount,
      b2bAccount: this.paymentDetail as IPaymentAccountDetail,
    };

    const pdfLayoutProps: IB2BDPdfDefinitionParameters = {
      paymentDetail: this.paymentTransactionResponse as IPaymentExecutionDescription,
      b2bDetail: this.paymentDetail as IPaymentAccountDetail,
      sourceAccount: this.selectedSourceAccount as IAccount,
      currency: this.currency,
    };

    return {
      voucherLayoutProperties,
      modalLayoutProps,
      pdfLayoutProps
    }

  }

  openProofModal() {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} byte-payment`,
      size: `lg`,
    });

    modal.componentInstance.data = this.modalLayout;

    modal.result.then(isConfirm => {
      if (!isConfirm) { return; }
      this.exportPdfFile();
    }).catch(error => error);
  }

  exportPdfFile() {
    const { reference, data } = this.pdfLayout as IPrintedData;
    const label = this.translate.instant('title-pdf:b2b-payment')

    this.pdfService.pdfGenerate({...this.paymentDetail}, reference as string, label, 268, 'voucher_transfer_title', {...data});
  }

  getEmissionDate() {
    const date = moment().format('DD/MM/YYYY')
    const hour = moment().format('HH')
    const minute = moment().format('mm')

    const suffix = +hour <= 12 ? 'AM' : 'PM'

    const finalHour = `${hour}:${minute} ${suffix}`

    return {
      hour: finalHour,
      date,
    }
  }

  resetStorageDefaultTransaction() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
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
