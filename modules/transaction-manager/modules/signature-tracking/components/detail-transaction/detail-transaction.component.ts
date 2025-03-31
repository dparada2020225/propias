import { ITableStructure } from '@adf/components';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISignatureTrackingServiceResponse } from '../../interfaces/signature-tracking.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { EProfile } from '../../../../../../enums/profile.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-detail-transaction',
  templateUrl: './detail-transaction.component.html',
  styleUrls: ['./detail-transaction.component.scss'],
})
export class DetailTransactionComponent  {
  private profile = this.utils.getProfile();

  @Input() tableStructured: ITableStructure<ISignatureTrackingServiceResponse> | null = null;
  @Input() countSuccessTransaction = 0;
  @Input() countFailedTransaction = 0;

  get isShowDetailStatusTransaction() {
    return this.profile === EProfile.SALVADOR
  }

  get subtitleText() {
    const successMessageMultiple = this.translate.instant('label:success_transaction_multiple');
    const successMessageSingleTrx = this.translate.instant('label:success_transaction');
    const failedMessageMultiple = this.translate.instant('label:failed_transaction_multiple');
    const failedMessageSingleTrx = this.translate.instant('label:failed_transaction');
    const successMessage = this.countSuccessTransaction === 1 ? successMessageSingleTrx : successMessageMultiple;
    const failedMessage = this.countFailedTransaction === 1 ? failedMessageSingleTrx : failedMessageMultiple;

    return `${this.countSuccessTransaction} ${successMessage}; ${this.countFailedTransaction} ${failedMessage}`
  }

  constructor(
    private activeModal: NgbActiveModal,
    private utils: UtilService,
    private translate: TranslateService,
  ) {}

  closeModal() {
    this.activeModal.close();
  }
}
