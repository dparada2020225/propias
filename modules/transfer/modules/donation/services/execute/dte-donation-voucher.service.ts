import { AdfFormatService, DateTimeFormat, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { Injectable } from '@angular/core';

import { IDonationAccount, IDonationFormValues } from '../../interfaces/donation-account.interface';
import { IDonationVoucherBuilder, IDTDModal, IDTDPdf, IDTDVoucherBuilder, IDTDVoucherSample } from '../../interfaces/donation-definition.interface';
import { IPrint } from '../../../../interface/print-data-interface';
import { DtdTransferManagerService } from '../definition/dtd-transfer-manager.service';
import { IAccount } from 'src/app/models/account.inteface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IHeadBandLayoutConfirm } from 'src/app/models/util-work-flow.interface';


@Injectable({
  providedIn: 'root'
})
export class DteDonationVoucherService {

  reference!: string;
  dateTime: DateTimeFormat | null = null;
  formValues: IDonationFormValues | null = null;
  accountDebitedSelected: IAccount | null = null;
  accountFundationSelected: IDonationAccount | null = null;
  titlePdf: string = '';
  fileNamePdf: string = '';
  accountDebitList: IAccount[] = [];
  date!: string;

  layoutSampleVoucher: IDataReading | null = null;
  layoutModal: IConfirmationModal | null = null;
  headBandLayout: IHeadBandAttribute[] = [];
  pdfLayout: IPrint | null = null;
  isAmountFromST: boolean = false;

  constructor(
    private definitionServiceManager: DtdTransferManagerService,
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService,
  ) { }

  mainBuilderVoucherLayout(props: IDTDVoucherBuilder, isSignatureTrackingUpdate?: boolean) {
    const { reference, formValues, accountDebited, fundationAccount } = props ?? {};
    const { date, titlePdf, fileNamePdf } = props ?? {};


    this.dateTime = this.formatService.getFormatDateTime(date);
    this.reference = reference;
    this.formValues = formValues;
    this.accountDebitedSelected = accountDebited;
    this.accountFundationSelected = fundationAccount;
    this.titlePdf = titlePdf;
    this.fileNamePdf = fileNamePdf;
    this.isAmountFromST = props?.isAmountFromST ?? false;



    this.layoutVoucherBuilder(props, isSignatureTrackingUpdate);
    this.headBandLayoutBuilder();
    this.builderLayoutVoucherPdf();
    this.builderLayoutVoucherModal();

    return this.responseLayoutBuilder();
  }


  responseLayoutBuilder() {
    return {
      layoutVoucher: this.layoutSampleVoucher,
      headBandLayout: this.headBandLayout,
      layoutVoucherModal: this.layoutModal,
      pdfLayout: this.pdfLayout
    } as IDonationVoucherBuilder;
  }


  private layoutVoucherBuilder(properties: IDTDVoucherBuilder, isSignatureTrackingUpdate?: boolean): void {
    const voucher: IDTDVoucherSample = {
      accountDebited: this.accountDebitedSelected as IAccount,
      fundationAccount: this.accountFundationSelected as IDonationAccount,
      referenceNumber: this.reference,
      dateTime: this.dateTime?.fullFormat as string,
      amount: parseInt(this.formValues?.amount ?? ''),
      title: properties?.title,
      subtitle: properties?.subtitle,
      isAmountFromST: this.isAmountFromST,
    };
    this.layoutSampleVoucher = this.definitionServiceManager.builderLayoutVoucherStep2(voucher, isSignatureTrackingUpdate);
  }

  private headBandLayoutBuilder(): void {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.dateTime as never,
      reference: this.reference
    };
    this.headBandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  private builderLayoutVoucherPdf(): void {
    const voucherPdf: IDTDPdf = {
      title: this.titlePdf,
      fileName: this.fileNamePdf,
      date: this.dateTime as never,
      referenceNumber: this.reference,
      formValues: this.formValues as never,
      accountDebited: this.accountDebitedSelected as IAccount,
      fundationAccredit: this.accountFundationSelected as never
    };

    this.pdfLayout = this.definitionServiceManager.buildDonationTransferPdfStep5(voucherPdf);
  }

  private builderLayoutVoucherModal(): void {
    const voucherModal: IDTDModal = {
      dateTime: this.dateTime as never,
      reference: this.reference,
      accountDebited: this.accountDebitedSelected as IAccount,
      fundationAccount: this.accountFundationSelected as never,
      amount: parseInt(this.formValues?.amount ?? '')
    };

    this.layoutModal = this.definitionServiceManager.builderLayoutVoucherModalStep4(voucherModal);
  }


}
