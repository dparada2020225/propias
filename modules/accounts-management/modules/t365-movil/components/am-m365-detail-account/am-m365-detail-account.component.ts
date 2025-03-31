import { Component, OnInit } from '@angular/core';
import { AdfConfirmationModalComponent, AdfFormatService, IConfirmationModal, IDataReading } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { AmdM365DetailService } from '../../services/definition/amd-m365-detail.service';
import { AM365VoucherBuilder } from '../../interfaces/voucher.interface';
import { IAM365DetailState } from '../../interfaces/state.interface';
import { AM365UrlCollection } from '../../enum/url-collection.enum';
import { IPrintData, PrintDataBuilder } from '../../../../../transfer/interface/print-data-interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AmpAchCreateService } from '../../../ach/services/print/amp-ach-create.service';
import { TranslateService } from '@ngx-translate/core';
import { AmdM365ModalService } from '../../services/definition/amd-m365-modal.service';
import moment from 'moment/moment';
import { M365RouteProtectedParameters } from '../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-m365-detail-account',
  templateUrl: './am-m365-detail-account.component.html',
  styleUrls: ['./am-m365-detail-account.component.scss']
})
export class AmM365DetailAccountComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;
  pdfData!: Array<IPrintData>;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private voucherDefinitionService: AmdM365DetailService,
    private modalService: NgbModal,
    private modalDefinitionService: AmdM365ModalService,
    private pdfCreateService: AmpAchCreateService,
    private translate: TranslateService,
    private adfFormat: AdfFormatService,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.buildProofModal();
    this.utils.hideLoader();
  }

  initDefinition() {
    const { account } = this.parameterManagement.getParameter<IAM365DetailState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new AM365VoucherBuilder()
      .bankName(account.bankName)
      .name(account.name)
      .email(account.email)
      .numberPhone(account.account)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
    });
  }

  getEmissionDate() {
    const date = moment().format('DD/MM/YYYY');
    const hour = moment().format('HH');
    const minute = moment().format('mm');
    const seconds = moment().format('ss');


    const finalHour = `${hour}${minute}${seconds}`;

    return {
      hour: finalHour,
      date: date.split('/').join(''),
    };
  }

  buildProofModal() {
    const { account } = this.parameterManagement.getParameter<IAM365DetailState>(PROTECTED_PARAMETER_STATE);
    const { hour, date } = this.getEmissionDate();

    const accountDetail = new AM365VoucherBuilder()
      .bankName(account.bankName)
      .name(account.name)
      .email(account.email)
      .numberPhone(account.account)
      .build();

    this.voucherModalLayout = this.modalDefinitionService.buildModalLayoutForCreateOperation({
      account: accountDetail,
      transactionResponse: {
        reference: '',
        dateTime: `${date}${hour}`,
      },
      title: 'ac:365_title_detail_account_proof_modal',
    });

    const keys = {
      numberPhone: 'ac:365_label_beneficiary_number_phone',
      name: 'ac:365_label_beneficiary_name',
      bankName: 'account_credit_bank',
      email: 'notify_toEmail',
      status: 'status'
    }

    this.pdfData = Object.entries(accountDetail).map(([key, value]) => {
      if (keys[key] && value) {
        return new PrintDataBuilder()
          .label(keys[key])
          .value(`${value}`)
          .build();
      }

      return new PrintDataBuilder().build();
    });
  }

  openProofModal(): void {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv am-ach`,
      size: `lg`,
    });

    modal.componentInstance.data = this.voucherModalLayout;

    modal.result
      .then((isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }
        this.exportFile();
      })
      .catch((error) => error);
  }

  exportFile() {
    const { hour, date } = this.getEmissionDate();
    const fileName = this.translate.instant('ac:365_file_name_detail_account') + Date.now();
    const title = 'ac:365_title_detail_account_proof_modal';
    this.pdfCreateService.pdfGenerate({
      referenceNumber: '',
      use365Pdf: true,
      date: this.adfFormat.getFormatDateTime(`${date}${hour}`),
    }, '', fileName, 268, title, this.pdfData, true);
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: null,
    });
    this.router.navigate([AM365UrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    this.openProofModal();
  }
}
