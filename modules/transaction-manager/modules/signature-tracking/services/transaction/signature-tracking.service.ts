import {  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IMultipleRequestResponse } from '../../interfaces/signature-tracking.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import {
  ISignatureTrackingModify,
  ISignatureTrackingParam, ISignatureTrackingProcess, ISTProcessWithToken,
  ISTSendParametersBodyRequest
} from '../../interfaces/st-service.interface';
import { ETransactionParams, ETransactionStatus } from '../../enum/st-common.enum';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { ITMTransaction } from '../../../../interfaces/tm-transaction.interface';
import {
  ICashierCheckRequest,
  ICreditCardPayments,
  ICreditPurchaseDisbursements,
  IDivideItAllUp,
  IForeignCurrencyAuction,
  IPaymentOfBulkServices,
  IPaymentOfPayroll,
  IPaymentOfProvidersRequest,
  IPaymentOFServices,
  IPaymentOfTaxesRequest, IPaymentProvidersDetail,
  IPurchaseForeignCurrency
} from '../../interfaces/st-process.interface';
import { map } from 'rxjs/operators';
import { FeatureManagerService } from '../../../../../../service/common/feature-manager.service';
import moment from 'moment';



/**
 * @author Fabian Serrano
 * @date 19/04/22
 *
 */
@Injectable({
  providedIn: 'root'
})
export class SignatureTrackingService {
  private PROCESS_WITH_TOKEN_SERVICE = '/v1/signature-tracking/process';

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService,
    private featureManager: FeatureManagerService,
  ) { }

  update(account: ISignatureTrackingModify) {
    return this.http.put<IMultipleRequestResponse>('/v1/signature-tracking/modify', account);
  }

  delete(parameters: ISignatureTrackingParam) {
    const params = new HttpParams()
      .set(ETransactionParams.TRANSACTION_CODE, parameters.transactionCode)
      .set(ETransactionParams.SIGNATURE_TYPE, parameters.signatureType)
      .set(ETransactionParams.TRANSACTION_STATUS, parameters.transactionStatus);

    return this.http.delete<IMultipleRequestResponse>('/v1/signature-tracking/', {
      params
    });
  }

  send(parameters: ISTSendParametersBodyRequest) {
    return this.http.put<IMultipleRequestResponse>('/v1/signature-tracking/send', parameters);

  }

  process(parameters: ISignatureTrackingProcess, isMultiple: boolean = false) {
    let params: HttpParams;

    if (isMultiple) {
      params = new HttpParams()
        .set(ETransactionParams.TRANSACTION_CODE, parameters.transactionCode)
        .set(ETransactionParams.SIGNATURE_TYPE, parameters.signatureType)
        .set(ETransactionParams.MULTIPLE_TRANSACTION, 'true');
    } else {
      params = new HttpParams()
        .set(ETransactionParams.TRANSACTION_CODE, parameters.transactionCode)
        .set(ETransactionParams.SIGNATURE_TYPE, parameters.signatureType);
    }

    return this.http.put<IMultipleRequestResponse>('/v1/signature-tracking/simple/process', null, {
      params
    });
  }

  processWithToken(parameters: ISTProcessWithToken) {
    const { isTokenRequired, tokenValue, typeTransaction, bodyRequest } = parameters;

    const params = new HttpParams()
      .set(ETransactionParams.TRANSACTION_CODE, bodyRequest.transactionCode)
      .set(ETransactionParams.SIGNATURE_TYPE, bodyRequest.signatureType);

    const headers = this.utilTransaction.addHeaderByToken({
      typeTransaction: typeTransaction as ERequestTypeTransaction,
      token: tokenValue,
      isTokenRequired,
      service: this.PROCESS_WITH_TOKEN_SERVICE,
      serviceCode: parameters.serviceCode,
    });

    return this.http.put<IMultipleRequestResponse>(this.PROCESS_WITH_TOKEN_SERVICE, null, {
      params,
      headers,
    });
  }

  authorize(parameters: ISignatureTrackingParam) {
    const params = new HttpParams()
      .set(ETransactionParams.TRANSACTION_CODE, parameters.transactionCode)
      .set(ETransactionParams.SIGNATURE_TYPE, parameters.signatureType)
      .set(ETransactionParams.TRANSACTION_STATUS, parameters.transactionStatus);

    return this.http.put<IMultipleRequestResponse>('/v1/signature-tracking/authorize', null, {
      params
    });
  }

  toReturn(parameters: ISignatureTrackingParam) {
    const params = new HttpParams()
      .set(ETransactionParams.TRANSACTION_CODE, parameters.transactionCode)
      .set(ETransactionParams.SIGNATURE_TYPE, parameters.signatureType)
      .set(ETransactionParams.TRANSACTION_STATUS, parameters.transactionStatus);

    return this.http.put<IMultipleRequestResponse>('/v1/signature-tracking/return', null, {
      params
    });
  }

  getAll(transactionStatus: string): Observable<ITMTransaction[]> {
    const requestBody = {
      transactionStatus,
    };


    return this.http.post<ITMTransaction[]>('/v1/signature-tracking/all', requestBody).pipe(
      map((response) => this.mappedNoMultipleTransactionList(transactionStatus, response))
    );
  }

  exchangeCurrencyAuction(bodyRequest: IForeignCurrencyAuction) {
    return this.http.post('/v1/signature-tracking/multiple-trx/currency-auction', bodyRequest);
  }

  exchangeCurrencyPurchase(bodyRequest: IPurchaseForeignCurrency) {
    return this.http.post('/v1/signature-tracking/multiple-trx/currency-purchase', bodyRequest);
  }

  cashierCheckRequest(bodyRequest: ICashierCheckRequest) {
    return this.http.post('/v1/signature-tracking/multiple-trx/check-request', bodyRequest);
  }

  creditPurchaseDisbursements(bodyRequest: ICreditPurchaseDisbursements) {
    return this.http.post('/v1/signature-tracking/multiple-trx/loan-disbursement', bodyRequest);
  }

  divideItAllUp(bodyRequest: IDivideItAllUp) {
    return this.http.post('/v1/signature-tracking/multiple-trx/divide-all', bodyRequest);
  }

  paymentOfBulkServices(bodyRequest: IPaymentOfBulkServices) {
    return this.http.post('/v1/signature-tracking/massive-service-payment', bodyRequest);
  }

  paymentOfPayroll(bodyRequest: IPaymentOfPayroll) {
    return this.http.post('/v1/signature-tracking/multiple-trx/form-payment', bodyRequest);
  }

  creditCardPayments(bodyRequest: ICreditCardPayments) {
    return this.http.post('/v1/signature-tracking/credit-card-payment', bodyRequest);
  }

  paymentOfServices(bodyRequest: IPaymentOFServices) {
    return this.http.post('/v1/signature-tracking/multiple-trx/service-payment', bodyRequest);
  }

  paymentOfTaxes(bodyRequest: IPaymentOfTaxesRequest) {
    return this.http.post('/v1/signature-tracking/multiple-trx/taxes-payment', bodyRequest);
  }

  paymentOfProviders(bodyRequest: IPaymentOfProvidersRequest) {
    return this.http.post<IPaymentProvidersDetail>('/v1/massive-transferences/ach-providers-transaction', bodyRequest);
  }

  private mappedNoMultipleTransactionList(status: string, transactionList: ITMTransaction[] | null) {
    if (!transactionList) return [];

    return [...transactionList].sort((a, b) => {
      return  moment(a['interfaceDate'], 'DD-MM-YYYY HH:mm:ss').isBefore(moment(b['interfaceDate'], 'DD-MM-YYYY HH:mm:ss')) ? -1 : 1
      }
    );
  }

  private mappedTransactionList(status: string, transactionList: ITMTransaction[] | null) {
    if (!transactionList) return [];

    if (!this.featureManager.isStBisvMultipleEnabled()) return  transactionList;

    if (status !== ETransactionStatus.TO_AUTHORIZE) return transactionList.map(transaction => {
      return {
        ...transaction,
        disabled: false,
      }
    });

    return transactionList.map(transaction => {
      const user = transaction.creator;
      const isSigned = transaction.signatory.some((userName) => {
        return userName.user.includes((user))
      });

      const isSignedFromProperty = transaction.userSignature === 'S';

      return {
        ...transaction,
        disabled: isSigned || isSignedFromProperty,
      }
    });
  }
}
