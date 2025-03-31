import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { IProcessSTOperations } from '../../../interfaces/st-transfer.interface';
import { ESTTransactionStatus } from '../../../enum/st-common.enum';
import { FeatureManagerService } from '../../../../../../../service/common/feature-manager.service';
import { ModalTokenComponent } from '../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../../../../service/common/util.service';
import { TypeTokenEnum } from '../../../../../../../enums/token.enum';

@Injectable({
  providedIn: 'root'
})
export class SttAuthorizeService {
  private authorizeSuccessCode: string = HttpStatusCode.SIGNATURE_TRACKING_AUTHORIZATION;

  constructor(
    private transactionService: SignatureTrackingService,
    private stCommonTransaction: StCommonTransactionService,
    private featureManager: FeatureManagerService,
    private modalService: NgbModal,
    private utils: UtilService,
  ) { }

  private main(authorizeProperties: IProcessSTOperations) {
    this.utils.showLoader();
    const bodyRequest = this.stCommonTransaction.buildBodyRequestToAllOperations({
      transaction: authorizeProperties?.transaction,
      signatureType: authorizeProperties?.signatureType,
      transactionStatus: authorizeProperties?.transactionStatus,
    });

    this.transactionService.authorize(bodyRequest)
      .subscribe({
        next: (response) => {
          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              message: authorizeProperties.message as string,
              status: ESTTransactionStatus.SUCCESS,
              position: authorizeProperties.position,
              action: authorizeProperties.action,
              data: {
                ...response,
                code: '0043',
              },
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error?.error?.code === this.authorizeSuccessCode) {
            this.stCommonTransaction.handleResponseProcessOperation({
              outPutResponse: {
                message: error?.error?.message ?? authorizeProperties.message,
                status: ESTTransactionStatus.SUCCESS,
                position: authorizeProperties.position,
                action: authorizeProperties.action,
                data: null
              }
            });

            return;
          }

          const message = error?.error?.message ?? 'error:signature_tracking_authorize';

          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              status: ESTTransactionStatus.FAILED,
              position: authorizeProperties.position,
              action: authorizeProperties.action,
              data: null,
              message,
            }
          });
        },
      });
  }

  authorizeExecute(authorizeProperties: IProcessSTOperations) {
    if (this.featureManager.isStBisvMultipleEnabled()) {
      return this.openTokenModal(authorizeProperties);
    }

    this.main(authorizeProperties);
  }

  private openTokenModal(authorizeProperties: IProcessSTOperations) {
    const typeToken = this.utils.getTokenType();

    if (typeToken === TypeTokenEnum.SMS) {
      return this.main(authorizeProperties);
    }

    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} own-modal sm-600`,
      size: 'lg',
    });

    modal.result
      .then((result) => {
        if (!result) return;

        this.main(authorizeProperties);
      })
      .catch((error) => error);
  }
}
