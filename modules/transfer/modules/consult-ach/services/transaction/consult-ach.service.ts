import { StorageService } from '@adf/security';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ICOResponseCredits,
  ICOResponseDebits,
  ICOTransactionCredit,
  ICOTransactionDebits
} from '../../interfaces/consult-ach-definition.interface';
import { ICOTransactionCreditDetail } from '../../interfaces/navigate-parameters.interface';
import { IMovementOperationResponse, ITypeOperationResponse } from '../../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class ConsultAchService {
  constructor(private http: HttpClient, private storageService: StorageService) {}

  getTypeMovement() {
    return this.http.get<IMovementOperationResponse[]>('/v1/ach/information/movements-type');
  }

  getTypeOperation() {
    return this.http.get<ITypeOperationResponse[]>('/v1/information/operation-type');
  }

  getTransactionCredit(request: ICOTransactionCredit): Observable<any> {
    const info = JSON.parse(this.storageService.getItem('userInformation'));
    let customerCode: any;

    if (info) {
      customerCode = info?.customerCode;
    }

    const body = {
      customerCode: customerCode ?? '0',
      initialDate: request.initDate,
      finalDate: request.finalDate,
      filterType: request.typeOperation,
      filterValue: request.filterValue,
    };

    return this.http.post<ICOResponseCredits>('/v1/ach/information/ach-credits', body);
  }

  getTransactionCreditDetail(creditId: string): Observable<ICOTransactionCreditDetail> {
    return this.http.post<ICOTransactionCreditDetail>('/v1/ach/information/ach-credit-detail', { creditId });
  }

  getTransactionDebits(request: ICOTransactionDebits): Observable<ICOResponseDebits> {
    const body = {
      initialDate: request.initDate,
      finalDate: request.finalDate,
    };

    return this.http.post<ICOResponseDebits>('/v1/ach/information/ach-debits', body);
  }
}
