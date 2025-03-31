import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenService } from '../service/private/token/token.service';


/**
 * @author Fabian Serrano
 * @date 24/03/21
 *
 */
@Injectable({
  providedIn: 'root'
})
export class TokenResolver implements Resolve<Observable<any>>{

  constructor(
    private tokenService: TokenService,
    private storageService: StorageService
  ) { }

  resolve(): Observable<any> {

    const currentToken = this.storageService.getItem('currentToken');
    if (currentToken) {
      return JSON.parse(currentToken)['typeToken'];
    } else {
      return of('Error token resolver');
    }
  }
}