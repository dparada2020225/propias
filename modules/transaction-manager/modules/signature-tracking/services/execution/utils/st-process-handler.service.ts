import { Injectable } from '@angular/core';
import { ISignatureTrackingProcess, ISTProcessWithToken } from '../../../interfaces/st-service.interface';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';

@Injectable({
  providedIn: 'root'
})
export class StProcessHandlerService {

  constructor(
    private stTransaction: SignatureTrackingService,
  ) { }

  processTransactionWithoutToken(parameters: ISignatureTrackingProcess, isMultiple = false) {
    const { transactionCode, signatureType } = parameters;

    return this.stTransaction.process({
      signatureType,
      transactionCode,
    }, isMultiple);
  }

  processTransactionWithToken(parameters: ISTProcessWithToken) {
    return this.stTransaction.processWithToken({
      ...parameters,
    });
  }
}
