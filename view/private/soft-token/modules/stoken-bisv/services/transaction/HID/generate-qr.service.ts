import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import { IGenerateQrSToken, IQrValue } from '../../../interfaces/stkn-bisv.interface';

@Injectable({
  providedIn: 'root'
})
export class GenerateQrService {

  constructor(
    private http : HttpClient,
    private utilTransaction: UtilTransactionService
  ) { }


  generateQR(request: IGenerateQrSToken, token: string): Observable <IQrValue>{

    const headers = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.AUTHENTICATION, token);

    return this.http.post<IQrValue>('/v1/soft-token/generate-qr', request, {
      headers: headers
    })
  }


  generateQRExposed(request: IGenerateQrSToken, token: string): Observable <IQrValue>{

    const headers = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.AUTHENTICATION, token);

    return this.http.post<IQrValue>('/v1/soft-token/passless/generate-qr', request, {
      headers: headers
    })
  }
}
