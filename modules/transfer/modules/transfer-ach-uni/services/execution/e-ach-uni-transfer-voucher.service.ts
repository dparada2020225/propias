import { Injectable } from '@angular/core';
import { IAchUniDPdf, IAchUniDVoucher, IAchUniMainLayoutResponse, IAchUniModalLayout, IAchUniVoucherLayout } from '../../interfaces/ach-uni-definition';
import { IAccount } from 'src/app/models/account.inteface';
import { AchUniFormValues } from '../../interfaces/ach-uni-transfer.interface';
import { EachUniTransferManagerService } from './e-ach-uni-transfer-manager.service';
import { TAchUniTransferManagerService } from '../definition/transaction/t-ach-uni-transfer-manager.service';
import { AdfFormatService, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { IHeadBandLayoutConfirm } from 'src/app/models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { AchUniPurpose } from '../../interfaces/ach-uni-purpose';
import { AchUniBank } from '../../interfaces/ach-uni-bank';
import { IPrint } from 'src/app/modules/transfer/interface/print-data-interface';

@Injectable({
  providedIn: 'root'
})
export class EachUniTransferVoucherService {

  private title: string | undefined = undefined;
  private subtitle: string | null = null;
  private fileNamePdf: string | null = null;
  private formValues: AchUniFormValues | null = null;
  reference: string | null = null;
  dateTime: string | null = null;

  sourceAccount!: IAccount;
  targetAccount!: IAccount;
  purpose!: AchUniPurpose;
  bank!: AchUniBank;

  private voucherLayout: IDataReading | null = null;
  private headbandLayout: IHeadBandAttribute[] = [];
  private pdfLayout: IPrint | null = null;
  private modalLayout: IConfirmationModal | null = null;

constructor(private transferManagerDefinition: TAchUniTransferManagerService,
            private utilWorkFlow: UtilWorkFlowService,
            private adfFormat: AdfFormatService,
) { }


voucherLayoutMainBuilder(startupParameters: IAchUniVoucherLayout) {
  const {
    title,
    subtitle,
    fileNamePdf,
    formValues,
    reference,
    dateTime,
    sourceAccount,
    targetAccount,
    purpose,
    bank, } = startupParameters ?? {};

  this.title = title;
  this.subtitle = subtitle;
  this.fileNamePdf = fileNamePdf;
  this.formValues = formValues;
  this.sourceAccount = sourceAccount;
  this.targetAccount = targetAccount;
  this.dateTime = dateTime;
  this.reference = reference;
  this.purpose = purpose;
  this.bank = bank;


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
  } as IAchUniMainLayoutResponse;
}

private layoutVoucherBuilder() {
  const voucher: IAchUniDVoucher = {
    title: this.title as never,
    subtitle: this.subtitle as never,
    transactionResponse: {
      referenceNumber: '',
      errorCode: '',
      errorDescription: ''
    },
    formValues: this.formValues as never,
    sourceAccount: this.sourceAccount,
    targetAccount: this.targetAccount,
    purpose: this.purpose,
    bank: this.bank,
    commission: this.formValues?.commission ?? '',
    reference: this.reference ?? '',
    dateTime: this.dateTime ?? ''
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
  const voucherPdf: IAchUniDPdf = {
    title: this.title as never,
    fileName: this.fileNamePdf as never,
    formValues: this.formValues as never,
    transactionResponse: {
      referenceNumber: '',
      errorCode: '',
      errorDescription: ''
    },
    sourceAccount: this.sourceAccount,
    targetAccount: this.targetAccount,
    purpose: this.purpose,
    bank: this.bank,
    commission: this.formValues?.commission ?? '',
    reference: this.reference ?? '',
    dateTime: this.dateTime ?? ''
  };

  this.pdfLayout = this.transferManagerDefinition.buildPDfDefinition(voucherPdf);
}

private layoutVoucherModalBuilder() {
  const voucherModal: IAchUniModalLayout = {
    formValues: this.formValues as never,
    transactionResponse: {
      referenceNumber: '',
      errorCode: '',
      errorDescription: ''
    },
    sourceAccount: this.sourceAccount,
    targetAccount: this.targetAccount,
    purpose: this.purpose,
    bank: this.bank,
    commission: this.formValues?.commission ?? '',
    reference: this.reference ?? '',
    dateTime: this.dateTime ?? ''
  };

  this.modalLayout = this.transferManagerDefinition.buildModalDefinition(voucherModal);
}

}
