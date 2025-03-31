import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';

@Injectable({
  providedIn: 'root'
})
export class ChangeDeviceService {

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService
  ) { }

  changeDevice(req: any, token: string): Observable<any> {

    const headers = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.AUTHENTICATION, token);

    return this.http.post<any>('/v1/soft-token/change-device', req, {headers: headers});
  }
}
