import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * @author Fabian Serrano
 * @date 24/03/21
 *
 * Service for secure identity calls
 */
@Injectable({
  providedIn: 'root',
})
export class SecureIndentityService {
  constructor(private httpClient: HttpClient) {}

  /**
   * @return service for manual synchronization
   * required parameters username, vclock1, vclock2
   */
  manualSync(vclock1: number, vclock2: number): Observable<any> {
    let json = { vclock1, vclock2 };
    return this.httpClient.post('/v1/facephi/secure-identity/otp/sync/manual', json);
  }

  getAutoSync(otp: number) {
    let json = { otp };
    return this.httpClient.post('/v1/facephi/secure-identity/otp/sync/auto', json, { observe: 'response' });
  }
}
