import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AchUniStatusTermsResponse } from '../../interfaces/ach-uni-status-terms-response';
import { AchUniBank } from '../../interfaces/ach-uni-bank';
import { AchUniPurpose } from '../../interfaces/ach-uni-purpose';
import { Observable } from 'rxjs';
import { AchUniCommisionResponse } from '../../interfaces/ach-uni-commision-response';
import { AchUniTransferDetails } from '../../interfaces/ach-uni-transfer-details';
import { AchUniTransferExecutionResponse } from '../../interfaces/ach-uni-transfer-execution-response';
import { AchUniLimitForUserResponse, LimitTransferClientCurrency } from '../../interfaces/ach-uni-limits-response';
import { AchUniTermsConditionResponse } from '../../interfaces/ach-uni-terms-condition-response';
import { AchUniParametersExecuteTransaction } from '../../interfaces/ach-uni-parameters-Execute-transaction';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { I365TransferRequest } from '../../../../interface/365-transfer.interface';

@Injectable({
  providedIn: 'root'
})
export class AchUniTransferService {

  constructor(private http: HttpClient, private utilTransaction: UtilTransactionService) { }

  getStatusTermsConditions(serviceType: string, clientNumber: string) {
    const params = new HttpParams()
      .set('clientNumber', clientNumber)
      .set('serviceType', serviceType);

    return this.http.get<AchUniStatusTermsResponse>(`/v1/ach/uni/information/terms-status`, {
      params,
    });
  }

  acceptTermsConditions(clientNumber: string, serviceType: string): Observable<AchUniTermsConditionResponse> {
    return this.http.post<AchUniTermsConditionResponse>('/v1/ach/uni/information/terms-and-conditions',
    { clientNumber: clientNumber, serviceType: serviceType});
  }

  getCommissionCalculation(clientNumber: string): Observable<AchUniCommisionResponse> {
    const params = new HttpParams()
      .set('clientNumber', clientNumber);
    return this.http.get<AchUniCommisionResponse>(`/v1/ach/uni/information/commission`, {
      params
    });
  }

  getListBanks(clientNumber: string): Observable<AchUniBank[]> {
    const params = new HttpParams()
      .set('clientNumber', clientNumber);
    return this.http.get<AchUniBank[]>(`/v1/ach/uni/information/banks`, {
      params
    });
  }

  getListPurpose(): Observable<AchUniPurpose[]> {
    return this.http.get<AchUniPurpose[]>('/v1/ach/uni/information/purpose', {
      params: { }
    });
  }

  getLimistTransferForUser(clientNumber: string, currency: string): Observable<AchUniLimitForUserResponse> {
    const body = {
      clientNumber: clientNumber,
      currency: currency
    }
    return this.http.post<AchUniLimitForUserResponse>(`/v1/ach/uni/information/user-transfer-limit`, body);
  }

  getLimitTransferForClientTypeAndCurrency(clientType: string, currency: string, clientNumber: string): Observable<LimitTransferClientCurrency> {
    const body = {
      clientType: clientType,
      currency: currency,
      clientNumber: clientNumber
    }
    return this.http.post<LimitTransferClientCurrency>(`/v1/ach/uni/information/client-type-transfer-limit`, body);
  }

  executeTransferAchUni(transferDetails: AchUniTransferDetails): Observable<AchUniTransferExecutionResponse> {
    return this.http.post<AchUniTransferExecutionResponse>('/v1/ach/uni/information/transfer', transferDetails);
  }

  achUniTransfer(isTokenRequired: boolean, data: I365TransferRequest, tokenValue: string | null) {
    const headers = this.utilTransaction.addHeaderByToken({
      service: '/v1/ach/uni/information/transfer',
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue as string,
      isTokenRequired,
    });

    return this.http.post<any>('/v1/ach/uni/information/transfer', data, {
      headers,
    });
  }
}
