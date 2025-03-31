import { Injectable } from '@angular/core';
import { AdfFormatService, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { IAchFormValues } from '../../interfaces/ach-transfer.interface';

import { AtdTransferManagerService } from '../definition/transaction/atd-transfer-manager.service';
import {
  IATDPdf,
  IATDVoucher,
  IATEMainLayoutResponse, IATEModalLayout,
  IATEVoucherLayout
} from '../../interfaces/ach-transfer-definition.inteface';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { IAchAccount } from '../../interfaces/ach-account-interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IPrint } from '../../../../interface/print-data-interface';


@Injectable({
  providedIn: 'root'
})
export class AteTransferVoucherService {
  private title: string | undefined = undefined;
  private subtitle: string | null = null;
  private fileNamePdf: string | null = null;
  private formValues: IAchFormValues | null = null;
  reference: string | null = null;
  dateTime: string | null = null;

  private voucherLayout: IDataReading | null = null;
  private headbandLayout: IHeadBandAttribute[] = [];
  private modalLayout: IConfirmationModal | null = null;
  private pdfLayout: IPrint | null = null;
  private sourceAccount!: IAccount;
  private targetAccount!: IAchAccount;

  constructor(
    private transferManagerDefinition: AtdTransferManagerService,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
  ) { }

  voucherLayoutMainBuilder(startupParameters: IATEVoucherLayout) {
    const {
      title,
      subtitle,
      fileNamePdf,
      formValues,
      reference,
      dateTime,
      sourceAccount,
      targetAccount } = startupParameters ?? {};

    this.title = title;
    this.subtitle = subtitle;
    this.fileNamePdf = fileNamePdf;
    this.formValues = formValues;
    this.sourceAccount = sourceAccount;
    this.targetAccount = targetAccount;
    this.dateTime = dateTime;
    this.reference = reference;


    this.layoutVoucherBuilder();
    this.headBandLayoutBuilder();
    this.layoutVoucherPDfBuilder();
    this.layoutVoucherModalBuilder();

    return this.responseLayoutMainBuilder();
  }

  private responseLayoutMainBuilder() {
    return {
      voucherLayout: this.voucherLayout,
      headBandLayout: this.headbandLayout,
      voucherModalLayout: this.modalLayout,
      pdfLayout: this.pdfLayout,
    } as IATEMainLayoutResponse;
  }

  private layoutVoucherBuilder() {
    const voucher: IATDVoucher = {
      title: this.title as never,
      subtitle: this.subtitle as never,
      transactionResponse: {
        dateTime: this.dateTime as never,
        reference: this.reference as never,
      },
      formValues: this.formValues as never,
      sourceAccount: this.sourceAccount,
      targetAccount: this.targetAccount,
    };

    this.voucherLayout = this.transferManagerDefinition.buildVoucherDefinition(voucher);
  }

  private headBandLayoutBuilder() {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(this.dateTime as never),
      reference: this.reference as never,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  private layoutVoucherPDfBuilder() {
    const voucherPdf: IATDPdf = {
      title: this.title as never,
      fileName: this.fileNamePdf as never,
      formValues: this.formValues as never,
      transactionResponse: {
        dateTime: this.dateTime as never,
        reference: this.reference as never,
      },
      sourceAccount: this.sourceAccount,
      targetAccount: this.targetAccount,
    };

    this.pdfLayout = this.transferManagerDefinition.buildPDfDefinition(voucherPdf);
  }

  private layoutVoucherModalBuilder() {
    const voucherModal: IATEModalLayout = {
      formValues: this.formValues as never,
      transactionResponse: {
        dateTime: this.dateTime as never,
        reference: this.reference as never,
      },
      sourceAccount: this.sourceAccount,
      targetAccount: this.targetAccount,
    };

    this.modalLayout = this.transferManagerDefinition.buildModalDefinition(voucherModal);
  }
}
