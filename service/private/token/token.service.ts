import { StorageService } from '@adf/security';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EProfile } from '../../../enums/profile.enum';

/**
 * @author Fabian Serrano
 * @date 24/03/21
 *
 * Servicios para la interacción de token
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public errorLoggingEvent: EventEmitter<any> = new EventEmitter();

  constructor(private httpClient: HttpClient, private storageService: StorageService) {}

  notifyErrorToLogin(message: string) {
    this.errorLoggingEvent.emit(message);
  }

  /**
   * @return service to obtain token type
   */
  getTokenTypenc(): Observable<any> {
    return this.httpClient.get('/v1/tokens/types', { observe: 'response' });
  }

  /**
   * @return service to obtain token validation according to its status
   */
  getTokenValidate(token: string): Observable<any> {
    if (!environment.encryptionEnabled) {
      return this.httpClient.post<any>(`/v1/tokens/validate`, token);
    } else {
      const tokenJson = { token };
      return this.httpClient.post<any>(`/v1/tokens/validate-token`, tokenJson);
    }
  }

  tokenGenerate(typeTransaction: string, user?: string) {
    const username = this.storageService.getItem('currentUser');
    if (environment.profile === EProfile.PANAMA) {
      return this.executeExposedGenerateToken( typeTransaction , user! || username);
    } else {
      const userLoggedIn = this.storageService.getItem('currentToken');
      if (environment.profile !== EProfile.SALVADOR || (environment.profile === EProfile.SALVADOR && userLoggedIn)) {
        return this.executeGenerateToken(username, typeTransaction);
      } else {
         return this.executeExposedGenerateToken(typeTransaction, user! || username);
      }
    }
  }


  executeGenerateToken(username: string, typeTransaction: string) {
    return this.httpClient
      .post<any>(`/v1/tokens/generate-token`, {
        transaction: typeTransaction ? typeTransaction : '',
      })
      .pipe(map((res) => res));
  }

  executeExposedGenerateToken(typeTransaction: string, username: string) {
    return this.httpClient
      .post<any>(`/v1/exposed/tokens/generate-token`, {
        transaction: typeTransaction ? typeTransaction : '',
        username: username ? username : '',
      })
      .pipe(map((res) => res));
  }

  validateOTPStokenSV(token: string): Observable<any>{
    return this.httpClient.post<any>('/v1/tokens/validate-soft-token', { token });
  }

}
