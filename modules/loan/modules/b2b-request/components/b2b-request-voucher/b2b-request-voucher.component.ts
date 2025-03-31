import { Component, OnInit } from '@angular/core';
import { AdfConfirmationModalComponent, IConfirmationModal, IDataReading } from '@adf/components';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { EB2bRequestView } from '../../enum/b2b-request-view.enum';
import moment from 'moment';
import { environment } from '../../../../../../../environments/environment';
import { B2bdManagerService } from '../../service/definition/b2bd-manager.service';
import { IPrintedData } from 'src/app/modules/transfer/interface/print-data-interface';
import { IB2bRequestFormValues, IB2bRequestStateDefault } from '../../interfaces/b2b-request-state.interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { IB2bRequestResponse } from '../../interfaces/b2b-request.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanPrintService } from '../../../../prints/loan-print.service';
import { TranslateService } from '@ngx-translate/core';
import { IUserInfo } from '../../../../../../models/user-info.interface';

@Component({
  selector: 'byte-b2b-request-voucher',
  templateUrl: './b2b-request-voucher.component.html',
  styleUrls: ['./b2b-request-voucher.component.scss']
})
export class B2bRequestVoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  confirmationLayout!: IDataReading;
  currency = environment.currency;
  view: EB2bRequestView = EB2bRequestView.DEFAULT;
  layoutVoucherModal: IConfirmationModal | null = null;
  pdfLayout: IPrintedData | null = null;
  bankProfile: string = 'BI-BANK CONNECTION' || environment.profile;
  userInfo: IUserInfo | null = null;
  formValues: IB2bRequestFormValues | null = null;
  sourceAccountSelected: IAccount | null = null;
  transactionResponse: IB2bRequestResponse | null = null;


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private b2bManagerDefinition: B2bdManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private parameterManagement: ParameterManagementService,
    private modalService: NgbModal,
    private pdfService: LoanPrintService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];
    this.userInfo = this.parameterManagement.getParameter('userInfo');
    const currentState: IB2bRequestStateDefault = this.parameterManagement.getParameter('navigateStateParameters');

    this.transactionResponse = currentState?.transactionResponse;
    this.sourceAccountSelected = currentState?.sourceAccountSelected;
    this.formValues = currentState?.formValues;

    this.buildViewVoucher();
  }

  buildViewVoucher() {
    if (this.view === EB2bRequestView.DEFAULT) {
      return this.buildVoucherForDefaultTransaction();
    }
  }

  buildVoucherForDefaultTransaction() {
    this.showAlert('success', 'b2b.request');
    const dateTime = this.getEmissionDate();
    const transactionResponse = this.transactionResponse as IB2bRequestResponse;

    this.confirmationLayout = this.b2bManagerDefinition.buildVoucherLayout(transactionResponse, this.currency);
    this.pdfLayout = this.b2bManagerDefinition.buildPdfLayout(transactionResponse, this.currency);
    this.layoutVoucherModal = this.b2bManagerDefinition.buildModalLayout({
      requestDetail: transactionResponse,
      accountDebited: this.sourceAccountSelected as IAccount,
      bankName: this.bankProfile,
      currency: this.currency,
      user: this.userInfo as IUserInfo,
      dateTime,
    });

  }

  nextStep() {
    this.openModalVoucher();
  }

  backStep() {
    this.resetDefaultStorage();
    this.router.navigate(['/loan/request']).then(() => {});
  }

  openModalVoucher() {
    const voucherModal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} byte-request`,
      size: 'lg',
    });


    voucherModal.componentInstance.data = this.layoutVoucherModal;

    voucherModal.result.then(isConfirm => {
      if (!isConfirm) { return; }
      this.exportPdfFile();
    }).catch(error => error);

  }

  exportPdfFile() {
    const { reference, data } = this.pdfLayout as IPrintedData;
    const pdfTile = this.translateService.instant('title-pdf:b2b-request');
    this.pdfService.pdfGenerate(`${reference}`, String(reference), pdfTile, 268, 'request-b2b', data);
  }

  getEmissionDate() {
    const date = moment().format('DD/MM/YYYY');
    const hour = moment().format('HH');
    const minute = moment().format('mm');

    const suffix = +hour <= 12 ? 'AM' : 'PM';

    const finalHour = `${hour}:${minute} ${suffix}`;

    return {
      hour: finalHour,
      date,
    };
  }

  resetDefaultStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
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
