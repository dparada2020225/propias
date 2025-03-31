import {
  AdfFormatService,
  DateTimeFormat,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute
} from '@adf/components';
import { Injectable } from '@angular/core';
import { IAccount } from 'src/app/models/account.inteface';
import { IHeadBandLayoutConfirm } from 'src/app/models/util-work-flow.interface';
import { IOTDVoucher, IOTDVoucherModal, IOTDVoucherPdf } from '../../interfaces/own-transfer-definition.interface';
import { IOTEVoucherLayoutRenponce, IOTEVoucherLayoutRequest } from '../../interfaces/own-transfer-execution.interface';
import { ILayoutVoucherSimple, IOwnAccount } from '../../interfaces/own-transfer.interface';
import { IPrint } from '../../../../interface/print-data-interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { OtdTransferVoucherManagerService } from '../definition/manager/otd-transfer-voucher-manager.service';

@Injectable({
  providedIn: 'root',
})
export class OteTransferVoucherService {
  reference!: string;
  dateTime!: DateTimeFormat;
  formValues!: ILayoutVoucherSimple;
  accountDebited!: IAccount;
  accountCredit!: IAccount;
  titlePdf!: string;
  fileNamePdf!: string;
  accountDebitList: IOwnAccount[] = [];
  date!: string;
  title!: string;
  subtitle!: string;
  layoutJsonVoucher: IDataReading | null = null;
  headBandLayout: IHeadBandAttribute[] = [];
  layoutJsonVoucherModal!: IConfirmationModal;
  pdfLayout!: IPrint;

  constructor(
    private definitionServiceManager: OtdTransferVoucherManagerService,
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService
  ) {}

  voucherLayoutsMainBuilder(builderParameters: IOTEVoucherLayoutRequest): IOTEVoucherLayoutRenponce {
    const date = builderParameters?.date;
    this.dateTime = this.formatService.getFormatDateTime(date);
    this.reference = builderParameters?.reference;
    this.formValues = builderParameters?.formValues;
    this.accountDebited = builderParameters?.accountDebited;
    this.accountCredit = builderParameters?.accountCredit;
    this.titlePdf = builderParameters?.titlePdf;
    this.fileNamePdf = builderParameters?.fileNamePdf;
    this.title = builderParameters?.title;
    this.subtitle = builderParameters?.subtitle;

    this.layoutVoucherBuilder();
    this.headBandLayoutBuilder();
    this.builderLayoutVoucherPdf();
    this.builderLayoutVoucherModal();

    return this.responceVoucherLayoutsMainBuilder();
  }

  private responceVoucherLayoutsMainBuilder(): IOTEVoucherLayoutRenponce {
    return {
      layoutJsonVoucher: this.layoutJsonVoucher,
      headBandLayout: this.headBandLayout,
      layoutJsonVoucherModal: this.layoutJsonVoucherModal,
      pdfLayout: this.pdfLayout,
    };
  }

  private layoutVoucherBuilder(): void {
    const voucher: IOTDVoucher = {
      accountDebited: this.accountDebited,
      accountCredit: this.accountCredit,
      reference: this.reference,
      dateTime: this.dateTime.fullFormat,
      formValues: this.formValues,
      title: this.title,
      subtitle: this.subtitle,
    };

    this.layoutJsonVoucher = this.definitionServiceManager.builderLayoutVoucherStep3(voucher);
  }

  private headBandLayoutBuilder(): void {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.dateTime,
      reference: this.reference,
      numberAccount: this.accountDebited.account
    };

    this.headBandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  private builderLayoutVoucherPdf(): void {
    const voucherPdf: IOTDVoucherPdf = {
      title: this.titlePdf,
      fileName: this.fileNamePdf,
      date: this.dateTime,
      reference: this.reference,
      formValues: this.formValues,
      accountToDebited: this.accountDebited,
      accountToCredit: this.accountCredit,
    };

    this.pdfLayout = this.definitionServiceManager.buildOwnTransferPdfStep5(voucherPdf);
  }

  private builderLayoutVoucherModal(): void {
    const voucherModal: IOTDVoucherModal = {
      dateTime: this.dateTime,
      reference: this.reference,
      accountDebited: this.accountDebited,
      accountAccredit: this.accountCredit,
      amount: this.formValues?.amount,
      comment: this.formValues?.comment as never,
    };

    this.layoutJsonVoucherModal = this.definitionServiceManager.builderLayoutVoucherModalStep4(voucherModal);
  }
}
