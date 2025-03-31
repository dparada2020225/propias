import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SignatureTrackingService } from '../../../transaction/signature-tracking.service';
import { StCommonTransactionService } from '../../st-common-transaction.service';
import { IStartupParametersToMultipleProcessTransaction } from '../../../../interfaces/st-process-multiple.interface';
import { ISignatureTrackingServiceResponse } from '../../../../interfaces/signature-tracking.interface';
import { ETMServiceCode } from '../../../../../../enums/service-code.enum';
import { StThirdPartyTransferService } from '../../definitions/bisv/multiple/st-third-party-transfer.service';
import { StAfpNpeService } from '../../definitions/bisv/multiple/st-afp-npe.service';
import { StCreditCardService } from '../../definitions/bisv/multiple/st-credit-card.service';
import { StBisvAchTransferenceService } from '../../definitions/bisv/multiple/st-bisv-ach-transference.service';
import { StTreasuryNpePaymentService } from '../../definitions/bisv/multiple/st-treasury-npe-payment.service';
import {
  StBisvAchMassiveTransferenceService
} from '../../definitions/bisv/multiple/st-bisv-ach-massive-transference.service';


@Injectable({
  providedIn: 'root'
})
export class StProcessMultipleSvService {

  constructor(
    private stTransaction: SignatureTrackingService,
    private stCommonTransaction: StCommonTransactionService,
    private stThirdPartyTransactionService: StThirdPartyTransferService,
    private stPaymentAfpNpeService: StAfpNpeService,
    private stPaymentOfCreditCard: StCreditCardService,
    private stPaymentACH: StBisvAchTransferenceService,
    private stPaymentACHMultiple: StBisvAchMassiveTransferenceService,
    private stTreasuryPaymentNpe: StTreasuryNpePaymentService,
  ) { }

  executeTransactionMap(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected } = startupParameters;
    const transaction = this.transactionWitPostProcessService[transactionSelected.serviceCode];

    if (!transaction) {
      return this.processTransactionSimple(startupParameters);
    }

    return transaction(startupParameters);
  }

  private transactionWitPostProcessService: Record<string, (startupParameters: IStartupParametersToMultipleProcessTransaction) => Observable<ISignatureTrackingServiceResponse>> = {
    [ETMServiceCode.THIRD_TRANSFER]: (startupParameters: IStartupParametersToMultipleProcessTransaction) => this.executeThirdPartyTransfer(startupParameters),
    [ETMServiceCode.PAYMENT_APF_CONFIA_NPE]: (startupParameters: IStartupParametersToMultipleProcessTransaction) => this.executePaymentAfpWithNpe(startupParameters),
    [ETMServiceCode.PAYMENT_APF_CRECER_NPE]: (startupParameters: IStartupParametersToMultipleProcessTransaction) => this.executePaymentAfpWithNpe(startupParameters),
    [ETMServiceCode.PAYMENT_OF_CREDIT_CARD]: (startupParameters: IStartupParametersToMultipleProcessTransaction) => this.executePaymentCreditCard(startupParameters),
    [ETMServiceCode.PAYMENT_OF_CREDIT_CARD_THIRD_PARTIES]: (startupParameters: IStartupParametersToMultipleProcessTransaction) => this.executePaymentCreditCard(startupParameters),
    [ETMServiceCode.ACH_TRANSFER_MANAGER]: (startupParameters: IStartupParametersToMultipleProcessTransaction) => this.executeACH(startupParameters),
    [ETMServiceCode.ACH_MASSIVE_TRANSFERENCE]: (startupParameters: IStartupParametersToMultipleProcessTransaction) => this.executeACHUniMultiple(startupParameters),
    [ETMServiceCode.TREASURY_PAYMENT_NPE]: (startupParameters: IStartupParametersToMultipleProcessTransaction) => this.executeTreasuryPaymentNpe(startupParameters),
  }

  private processTransactionSimple(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.stTransaction.process({
        transactionCode: transactionSelected?.reference,
        signatureType: signatureType,
      }, false)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeThirdPartyTransfer(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected } = startupParameters;
    return this.stThirdPartyTransactionService.executeMultiple(transactionSelected)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executePaymentAfpWithNpe(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;
    return this.stPaymentAfpNpeService.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executePaymentCreditCard(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;
    return this.stPaymentOfCreditCard.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeACH(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;
    return this.stPaymentACH.execute(transactionSelected, signatureType)
      .pipe(
        map((response) => {
          console.log(response);
          return this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)
        }),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeACHUniMultiple(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;
    return this.stPaymentACHMultiple.execute({
      signatureType,
      transaction: transactionSelected,
      sourceAccount: undefined,
      loteDetail: undefined,
      })
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeTreasuryPaymentNpe(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.stTreasuryPaymentNpe.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }
}
