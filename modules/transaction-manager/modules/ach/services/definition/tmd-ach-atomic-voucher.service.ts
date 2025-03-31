import { Injectable } from '@angular/core';
import { TmdAchAtomicDetailService } from './tmd-ach-atomic-detail.service';
import { TmdAchAtomicModalService } from './tmd-ach-atomic-modal.service';
import { TmdAchAtomicDetailPdfService } from './tmd-ach-atomic-detail-pdf.service';
import { ITMConsultAtomicACHVoucherParameters } from '../../interfaces/voucher.interface';

@Injectable({
  providedIn: 'root'
})
export class TmdAchAtomicVoucherService {

  constructor(
    private voucherTransactionDefinitionService: TmdAchAtomicDetailService,
    private modalTransactionDefinitionService: TmdAchAtomicModalService,
    private pdfLayoutService: TmdAchAtomicDetailPdfService,
  ) { }

  buildVoucher(parameters: ITMConsultAtomicACHVoucherParameters) {
    const { transaction, typeService } = parameters;

    const voucherLayout = this.voucherTransactionDefinitionService.buildTransactionLayout({
      transaction: transaction,
      typeService,
    });

    const modalLayout = this.modalTransactionDefinitionService.buildModalLayoutForAtomicACHTransactionDetail({
      transaction: transaction,
      title: 'tm:ach:title_proof_transaction_detail',
      typeService,
    });

    const pdfLayout = this.pdfLayoutService.buildLayoutPdf({
      transaction: transaction,
      title: 'tm:ach:title_proof_transaction_detail',
      fileName: 'tm:ach:title_ach_detail_filename',
      typeService,
    });

    return {
      voucherLayout,
      modalLayout,
      pdfLayout,
    }
  }
}
