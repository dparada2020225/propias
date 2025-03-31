import { Injectable } from '@angular/core';
import {
  AdfFormatService,
  DateTimeFormat,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute
} from '@adf/components';
import { IAccount } from '../../../../../../models/account.inteface';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';

import { IBTDVoucherBuilder, IBulkTransferVoucherDefinitionParameters } from '../../interfaces/btd-voucher.interface';
import { BtdTransactionManagerService } from '../definition/transaction/btd-transaction-manager.service';
import { IBulkTransferModal, ICurrentFile } from '../../models/bulk-transfer.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IPrint } from '../../../../interface/print-data-interface';

@Injectable({
  providedIn: 'root'
})
export class BteVoucherService {

  private reference!: string;
  private dateTime: string | null = null;
  private sourceAccount: IAccount | null = null;
  private title: string = '';
  private subtitle: string = '';

  private layoutSampleVoucher: IDataReading | null = null;
  private layoutModal: IConfirmationModal | null = null;
  private headBandLayout: IHeadBandAttribute[] = [];
  private pdfLayout: IPrint | null = null;
  private currentFile: ICurrentFile | null = null;
  private dateTimeFormatted: DateTimeFormat | null = null;

  constructor(
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService,
    private transactionDefinitionManager: BtdTransactionManagerService
  ) {
  }

  buildVoucherScreen(startupParameters: IBTDVoucherBuilder) {
    const { reference, currentFile, sourceAccount } = startupParameters ?? {};

    const { date } = startupParameters ?? {};
    this.dateTime = date;
    this.reference = reference;
    this.sourceAccount = sourceAccount;
    this.currentFile = currentFile;
    this.title = startupParameters.title ?? '';
    this.subtitle = startupParameters.subtitle ?? '';
    this.dateTimeFormatted = this.formatService.getFormatDateTime(this.dateTime);

    this.buildVoucher();
    this.buildModalLayout();
    this.buildHeadBandLayout();


    return this.responseLayoutBuilder();
  }


  private responseLayoutBuilder() {
    return {
      layoutVoucher: this.layoutSampleVoucher,
      headBandLayout: this.headBandLayout,
      layoutVoucherModal: this.layoutModal,
      pdfLayout: this.pdfLayout
    };
  }



  private buildVoucher() {
   const parameters: IBulkTransferVoucherDefinitionParameters = {
     currentFile: this.currentFile as never,
     reference: this.reference,
     datetime: this.dateTime as never,
     sourceAccount: this.sourceAccount as never,
    tittle: this.title,
    subtitle: this.subtitle
   };


   this.layoutSampleVoucher = this.transactionDefinitionManager.buildVoucherLayout(parameters);

  }

  private buildHeadBandLayout() {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.formatService.getFormatDateTime(this.dateTime as never),
      reference: this.reference
    };

    this.headBandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  private buildModalLayout() {
    const modalProperties: IBulkTransferModal = {
      dateTime: this.dateTimeFormatted as never,
      sourceAccount: this.sourceAccount as never,
      reference: this.reference,
      currentFile: this.currentFile as never,
    };

    this.layoutModal = this.transactionDefinitionManager.buildModalLayout(modalProperties);
  }
}
