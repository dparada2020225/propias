import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CorrelativeResponse } from '../../interfaces/ach-uni-voucher-definition.interface';
import { Observable } from 'rxjs';
import { ITMUploadUniTrfRequest } from '../../interfaces/ach-uni-tm-transaction';

@Injectable({
  providedIn: 'root'
})
export class TmAchUniVoucherDataService {

constructor(private http: HttpClient) { }

  getCorrelative(): Observable<CorrelativeResponse> {
    return this.http.get<CorrelativeResponse>(`/v1/massive-transferences/uni/generate-correlative`, {});
  }

  fileTransferFTP(bodyRequest: ITMUploadUniTrfRequest) {
    const { uploadFile } = bodyRequest;
    return this.http.post<any>('/v1/file-transfer/upload-file', uploadFile, {
      params: {
        mnemonic: 'UNITRF',
      }
    });
  }

}
