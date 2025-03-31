import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IStBISVCreditCardPaymentNotifyRequest } from '../../interfaces/bisv/st-credit-card-payment.interface';
import { IBisvNotifyAfpCrecerNpeRequest } from '../../interfaces/bisv/st-afp.interface';
import { IStACHGenericNotifyRequest, STACHMassiveNotificationRequest } from '../../interfaces/bisv/st-ach.interface';

@Injectable({
  providedIn: 'root'
})
export class StBisvService {

  constructor(
    private http: HttpClient,
  ) { }

  notifyCreditCardPayment(parameters: IStBISVCreditCardPaymentNotifyRequest) {
    return this.http.post('/v1/signature-tracking/multiple-trx/credit-card-payment', parameters);
  }

  notifyAfpCrecerNpe(parameters: IBisvNotifyAfpCrecerNpeRequest) {
    return this.http.post('/v1/signature-tracking/multiple-trx/afp-grow-npe', parameters);
  }

  notifyAfpConfiaNpe(parameters: IBisvNotifyAfpCrecerNpeRequest) {
    return this.http.post('/v1/signature-tracking/multiple-trx/afp-trusts-npe', parameters);
  }

  getTransactionDetailTreasuryPayment(transactionId: string) {
    return this.http.post('/v1/ranch-payment/inquiry', {
      transaction: transactionId,
    });
  }

  saveTreasuryPaymentNPEIntoDb() {
    return this.http.post('/v1/ranch-payment/inquiry', { });
  }

  achMassiveNotify(parameters: STACHMassiveNotificationRequest) {
    return this.http.post('/v1/signature-tracking/multiple-trx/ach-uni', parameters);
  }

  achGenericNotify(bodyRequest: IStACHGenericNotifyRequest) {
    return this.http.post('/v1/massive-transferences/uni/multiple-notification', bodyRequest);
  }
}
