import {
  BankingAuthenticationService,
  OperationBuilder,
  SmartcoreCheckpointService,
  StorageService,
  TransactionBuilder
} from '@adf/security';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ERequestTypeHeader, ERequestTypeTransaction} from 'src/app/enums/transaction-header.enum';
import {SmartCoreService} from '../common/smart-core.service';
import {UtilTransactionService} from '../common/util-transaction.service';
import {environment} from "../../../environments/environment";
import {EProfile} from "../../enums/profile.enum";
import {ParameterManagementService} from "../navegation-parameters/parameter-management.service";

/**
 * @author Fabian Serrano
 * @date 13/04/21
 *
 */
@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  private userName!: string;

  constructor(
    private smartCore: SmartCoreService,
    private httpClient: HttpClient,
    private storageService: StorageService,
    private bankingService: BankingAuthenticationService,
    private utilTransaction: UtilTransactionService,
    private smartcoreCheckpointService: SmartcoreCheckpointService,
    private parameterManagement: ParameterManagementService,
  ) {
  }

  /**
   * @return service for manual synchronization
   * required parameters username, vclock1, vclock2
   */
  sendNewPassword(username: string, lastPasswordTemp: string, newPasswordTemp: string, tokenValue: string | undefined): Observable<any> {
    const lastPassword = this.bankingService.encrypt(lastPasswordTemp);
    const newPassword = this.bankingService.encrypt(newPasswordTemp);

    if (!username) {
      username = this.storageService.getItem('tempUsername');
    }

    const operation = this.callSmartCore();

    let headers;
    if (tokenValue !== undefined) {
      headers = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.CHANGE_PASSWORD, tokenValue, username.toString());
    } else {
      headers = new HttpHeaders().set(ERequestTypeHeader.PARAMETER, username.toString());
    }

    if (this.smartcoreCheckpointService.useSmartidV5) {
      headers = this.smartcoreCheckpointService.setCheckpointHeaderEncryted(operation, headers);
    }

    const userLoggedIn = this.storageService.getItem('userLoggedIn');

    // Se verifica que en el localStorage exista el item de usuario logueado.
    if (userLoggedIn) {
      let userLogged = JSON.parse(userLoggedIn);
      // Se verifica si el usuario está logueado
      if (userLogged) {
        const currentToken = this.storageService.getItem('currentToken');

        if (currentToken) {
          const sessionId_ = JSON.parse(currentToken)['app_id'];

          let sessionId = this.bankingService.encrypt(sessionId_);

          if (environment.profile === EProfile.SALVADOR) {
            const required = this.parameterManagement.getParameter('isTokenRequired');
            const headerValue = this.bankingService.encrypt(String(required)) as string;
            headers = headers.set('X-8070b', headerValue)
          }

          const json = {lastPassword, newPassword, sessionId};
          return this.httpClient.put(`/v1/reset-password/logged/${username}`, json, {headers: headers});
        } else {
          console.error('Error al recuperar "currentToken"');
        }
      } else {
        if (environment.profile === EProfile.SALVADOR) {
          const required = this.parameterManagement.getParameter('requiredToken');
          const headerValue = this.bankingService.encrypt(String(required)) as string;
          headers = headers.set('X-8070b', headerValue)
        }
        const json = {lastPassword, newPassword};
        return this.httpClient.put(`/v1/reset-password/exposed/${username}`, json, {headers: headers});
      }
    } else {
      if (environment.profile === EProfile.SALVADOR) {
        const required = this.parameterManagement.getParameter('requiredToken');
        const headerValue = this.bankingService.encrypt(String(required)) as string;
        headers = headers.set('X-8070b', headerValue)
      }
      const json = {lastPassword, newPassword};
      return this.httpClient.put(`/v1/reset-password/exposed/${username}`, json, {headers: headers});
    }

    return of('error of service');
  }

  callSmartCore() {
    const transaction = new TransactionBuilder().category('profile').type('Change password').build();

    const operation = new OperationBuilder().transaction(transaction).build();

    if (!this.smartcoreCheckpointService.useSmartidV5) {
      this.smartCore.personalizationOperation(operation);
    }

    return operation;
  }

  getUserName(): string {
    return this.userName;
  }

  sendUserName(value: any) {
    this.userName = value;
  }
}
