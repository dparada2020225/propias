import {TestBed} from '@angular/core/testing';

import {UtilTransactionService} from './util-transaction.service';
import {BankingAuthenticationService} from "@adf/security";
import {HandleTokenRequestService} from "./handle-token-request.service";
import {TranslateService} from "@ngx-translate/core";

describe('UtilTransactionService', () => {
  let service: UtilTransactionService;

  let bankingService: jasmine.SpyObj<BankingAuthenticationService>;
  let handleTokenRequest: jasmine.SpyObj<HandleTokenRequestService>;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {

    const bankingServiceSpy = jasmine.createSpyObj('BankingAuthenticationService', ['encrypt'])
    const handleTokenRequestSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isSetHeaderTokenRequired'])
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])

    TestBed.configureTestingModule({
      providers: [
        {provide: BankingAuthenticationService, useValue: bankingServiceSpy},
        {provide: HandleTokenRequestService, useValue: handleTokenRequestSpy},
        {provide: TranslateService, useValue: translateSpy},
      ]
    });

    bankingService = TestBed.inject(BankingAuthenticationService) as jasmine.SpyObj<BankingAuthenticationService>;
    handleTokenRequest = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    service = TestBed.inject(UtilTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
