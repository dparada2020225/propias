import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { StBisvService } from '../../../../transaction/st-bisv.service';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  StBisvSplitTransactionManagerService
} from '../../../../../../../services/manager/bisv/st-bisv-split-transaction-manager.service';
import { TmCommonService } from '../../../../../../../services/tm-common.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { ETMServiceCode } from '../../../../../../../enums/service-code.enum';
import { IFlowError } from '../../../../../../../../../models/error.interface';
import { ITransactionManagerAccountDetail } from '../../../../../../../interfaces/transaction-manger.interface';
import { IBisvNotifyAfpCrecerNpeRequest } from '../../../../../interfaces/bisv/st-afp.interface';

@Injectable({
  providedIn: 'root'
})
export class StAfpNpeService {

  constructor(
    private stBisvService: StBisvService,
    private stTransaction: SignatureTrackingService,
    private stSplitService: StBisvSplitTransactionManagerService,
    private tmCommonService: TmCommonService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.process(transaction, signatureType)
      .pipe(
        concatMap(() => this.notify(transaction))
      );
  }

  private process(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    });
  }

  private notify(transaction: ITMTransaction) {
    if (transaction.serviceCode === ETMServiceCode.PAYMENT_APF_CONFIA_NPE) {
      return this.manageNotifyForConfiaNPETransaction(transaction);
    }

    return this.manageNotifyForCrecerNPETransaction(transaction);
  }

  private manageNotifyForConfiaNPETransaction(transaction: ITMTransaction) {
    const detail = this.stSplitService.getDetailTransactionPaymentAFPConfiaNPE(transaction.request);

    return this.tmCommonService.getSourceAccount(detail.sourceAccount.trim())
      .pipe(
        concatMap((response) => {
          if (response.hasOwnProperty('error')) {
            const error = response as IFlowError;

            return throwError(() => ({
              error: {
                message: error.message,
              },
              status: 400,
              statusText: '',
            }));
          }

          const sourceAccountResponse = response as ITransactionManagerAccountDetail;
          const bodyRequest = {
            npe: detail.npe,
            id: detail.id,
            delinquency: detail.surcharge,
            currency: transaction?.currency ?? sourceAccountResponse.currency,
            amount: detail.amountParsed,
            reference: transaction.reference,
            dueDate: detail.dateParsed,
            account: detail.sourceAccount,
            accountName: sourceAccountResponse.name,
          } as IBisvNotifyAfpCrecerNpeRequest;

          return this.stBisvService.notifyAfpConfiaNpe(bodyRequest);
        })
      );
  }

  private manageNotifyForCrecerNPETransaction(transaction: ITMTransaction) {
    const detail = this.stSplitService.getDetailTransactionPaymentAFPCrecerNPE(transaction.request);

    return this.tmCommonService.getSourceAccount(detail.account.trim())
      .pipe(
        concatMap((response) => {
          if (response.hasOwnProperty('error')) {
            const error = response as IFlowError;

            return throwError(() => ({
              error: {
                message: error.message,
              },
              status: 400,
              statusText: '',
            }));
          }

          const sourceAccountResponse = response as ITransactionManagerAccountDetail;
          const bodyRequest = {
            npe: detail.npe,
            id: '0',
            delinquency: '0',
            currency: transaction?.currency ?? sourceAccountResponse.currency,
            amount: detail.amountParsed,
            reference: transaction.reference,
            dueDate: detail.dateParsed,
            account: detail.account,
            accountName: sourceAccountResponse.name,
          } as IBisvNotifyAfpCrecerNpeRequest;

          return this.stBisvService.notifyAfpCrecerNpe(bodyRequest);
        })
      );
  }
}
