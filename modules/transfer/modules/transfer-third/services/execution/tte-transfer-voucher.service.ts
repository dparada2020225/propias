import { AdfFormatService, DateTimeFormat, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { Injectable } from '@angular/core';
import { IAccount } from '../../../../../../models/account.inteface';
import { IPrint } from '../../../../interface/print-data-interface';
import { IOTEVoucherLayoutRenponce } from '../../../transfer-own/interfaces/own-transfer-execution.interface';

import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import { IThirdTransfersAccounts } from '../../../../interface/transfer-data-interface';
import { ITTEVoucherLayoutRequest } from '../../interfaces/third-transfer-execution.interface';
import {
  IPdfLayout,
  IThirdTransferConfirmationVoucher,
  IThirdTransferFormValues,
  IThirdTransferModal,
} from '../../interfaces/third-transfer.interface';
import { TtdTransferManagerService } from '../definition/transaction/manager/ttd-transfer-manager.service';

@Injectable({
  providedIn: 'root',
})
export class TteTransferVoucherService {
  reference!: string;
  dateTime!: DateTimeFormat;
  formValues!: IThirdTransferFormValues;
  accountDebited!: IAccount;
  accountCredit!: IThirdTransfersAccounts;
  titlePdf!: string;
  fileNamePdf!: string;
  accountDebitList: IAccount[] = [];
  date!: string;
  title!: string;
  subtitle!: string;

  layoutJsonVoucher: IDataReading | null = null;
  headBandLayout: IHeadBandAttribute[] = [];
  layoutJsonVoucherModal!: IConfirmationModal;
  pdfLayout!: IPrint;
  userName: string = '';

  constructor(
    private definitionServiceManager: TtdTransferManagerService,
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService,
    private util: UtilService
  ) {}

  voucherLayoutsMainBuilder(builderParameters: ITTEVoucherLayoutRequest): IOTEVoucherLayoutRenponce {
    const {
      date: currentDate,
      reference,
      formValues,
      accountDebited,
      accountCredit,
      titlePdf,
      fileNamePdf,
      title,
      subtitle,
    } = builderParameters ?? {};

    this.dateTime = this.formatService.getFormatDateTime(currentDate);
    this.reference = reference;
    this.formValues = formValues;
    this.accountDebited = accountDebited;
    this.accountCredit = accountCredit;
    this.titlePdf = titlePdf;
    this.fileNamePdf = fileNamePdf;
    this.title = title;
    this.subtitle = subtitle;
    this.userName = this.util.getUserName();

    this.layoutVoucherBuilder();
    this.headBandLayoutBuilder();
    this.builderLayoutVoucherPdf();
    this.builderLayoutVoucherModal();

    return this.responseVoucherLayoutsMainBuilder();
  }

  private responseVoucherLayoutsMainBuilder(): IOTEVoucherLayoutRenponce {
    return {
      layoutJsonVoucher: this.layoutJsonVoucher,
      headBandLayout: this.headBandLayout,
      layoutJsonVoucherModal: this.layoutJsonVoucherModal,
      pdfLayout: this.pdfLayout,
    };
  }

  private layoutVoucherBuilder(): void {
    const voucher: IThirdTransferConfirmationVoucher = {
      accountDebited: this.accountDebited,
      accountCredit: this.accountCredit,
      reference: this.reference,
      date: this.dateTime.fullFormat,
      formValues: this.formValues,
      title: this.title,
      subtitle: this.subtitle,
    };

    this.layoutJsonVoucher = this.definitionServiceManager.buildTransferConfirmationStep4(voucher);
  }

  private headBandLayoutBuilder(): void {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.dateTime,
      reference: this.reference,
    };

    this.headBandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  private builderLayoutVoucherPdf(): void {
    const voucherPdf: IPdfLayout = {
      title: this.titlePdf,
      fileName: this.fileNamePdf,
      date: this.dateTime,
      referenceNumber: this.reference,
      formValues: this.formValues,
      accountToDebited: this.accountDebited,
      accountToCredit: this.accountCredit,
    };

    this.pdfLayout = this.definitionServiceManager.buildTransferPdfStep5(voucherPdf);
  }

  private builderLayoutVoucherModal(): void {
    const voucherModal: IThirdTransferModal = {
      accountDebited: this.accountDebited,
      accountCredit: this.accountCredit,
      dateTime: this.dateTime,
      reference: this.reference,
      userName: this.userName,
      formValues: this.formValues,
    };

    this.layoutJsonVoucherModal = this.definitionServiceManager.buildTransferModalStep5(voucherModal);
  }
}
