import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SmartCoreService } from '../common/smart-core.service';
import { AccountSmartCoreBuilder, BankingAuthenticationService, OperationBuilder, TransactionBuilder } from '@adf/security';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { environment } from 'src/environments/environment';
import { FeatureManagerService } from '../common/feature-manager.service';
import { UtilTransactionService } from '../common/util-transaction.service';

/**
 * @author Fabian Serrano
 * @date 03/05/21
 *
 * Servicio para la obtencion de las contraseña
 */
@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  profile = environment.profile;

  constructor(
    private httpClient: HttpClient,
    private smartCore: SmartCoreService,
    private bankingService: BankingAuthenticationService,
    private managementMethod: FeatureManagerService,
    private utilTransaction: UtilTransactionService
    ) {}

  /**
   * @return Servicio para obtener contraseña
   */

  getPassword(userName: string, isEmailOption: boolean , isTokenRequired?: string, tokenValue?: string, ): Observable<any> {

    const header = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.CHANGE_PASSWORD, tokenValue ?? '', userName);
    const headersService = isTokenRequired ? header : {}
    const optionToRecoverPassword = isEmailOption ? 'sendemail' : 'sendsms';

    this.callSmartCore(userName);
    let call: any;
    if (this.managementMethod.implementMethod()) {
      call = this.httpClient.post(`/v1/reset-password/${userName}/${optionToRecoverPassword}`, null, {
        headers: headersService,
      });
    }else{
      call = this.httpClient.post(`/v1/reset-password/${userName}/${optionToRecoverPassword}`, userName);
    }
    return call;
  }


  getInfoTokenUser(username: string): Observable<any> {
    const userEncrypt = this.bankingService.encrypt(username);
    return this.httpClient.post('/v1/exposed/agreement/user', {
      username: userEncrypt,
    });
  }

  callSmartCore(userName: string) {
    const transaction = new TransactionBuilder().category('Profile').type('Reset Password').build();

    const account = new AccountSmartCoreBuilder().client(userName).build();

    const operation = new OperationBuilder().transaction(transaction).account(account).build();

    this.smartCore.personalizationOperation(operation);
  }
}
