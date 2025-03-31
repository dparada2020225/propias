import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {IOnBoarding, IOnBoardingLow} from '../../models/onboarding.interface';
import {IRedirectRegionalConnectionRequest, IRegionalConnectionResponse} from 'src/app/enums/regional-connection.enum';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HomePrivateService {

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    private httpClient: HttpClient) {
  }

  public getLoadAccountsParameter(): Observable<any> {
    return this.httpClient.get(`/v1/agreement/agreement/global-variable/${environment.coreVariable}`).pipe(map((data: any) => {
      return data && data.value === 'S';
    }));
  }

  public getAvailableProducts(): Observable<any> {
    return this.httpClient.get('/v1/inquiries/account-product/all');
  }

  public getAccountsByProduct(productType: string, subProductType: string, currency: string): Observable<any> {
    const requestBody = {
      productType, subProductType, currency
    };

    return this.httpClient.post('/v1/inquiries/account-product/detail', requestBody
    );

  }

  getOnBoardingDetail() {
    return this.httpClient.get<IOnBoarding>('/v1/on-boarding/');
  }


  onBoardingLow() {
    return this.httpClient.put<IOnBoardingLow>('/v1/on-boarding/low', '');
  }


  getTokenForRegionalConnection() {
    return this.httpClient.post<IRegionalConnectionResponse>('/v1/sec-profile/new-security-profile/regional-connection', null);
  }

  regionalConnectionLoginStatus(description: string) {
    const requestBody = {
      description
    }

    return this.httpClient.post('/v1/sec-profile/new-security-profile/regional-connection/login', requestBody);
  }

  redirectToReginalConnection(URL: string, params: IRedirectRegionalConnectionRequest) {
    const form = this.document.createElement("form");
    form.method = "POST";
    form.target = "_top";
    form.action = URL;
    for (let prop in params) {
      const input = this.document.createElement("input");
      input.type = "hidden";
      input.name = prop;
      input.value = params[prop];
      form.append(input);
    }
    this.document.body.appendChild(form);
    form.submit();
  }

}
