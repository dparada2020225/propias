import { TestBed } from '@angular/core/testing';

import { BankingAuthenticationService } from '@adf/security';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { TokenizerAccountsService } from './tokenizer-accounts.service';

describe('TokenizerAccountsService', () => {
  let service: TokenizerAccountsService;
  let bankingService: jasmine.SpyObj<BankingAuthenticationService>;
  beforeEach(() => {

    const bankingServiceSpy = jasmine.createSpyObj('BankingAuthenticationService', ['encrypt'])

    TestBed.configureTestingModule({
      providers: [
        { provide: BankingAuthenticationService, useValue: bankingServiceSpy },
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TokenizerAccountsService);
    bankingService = TestBed.inject(BankingAuthenticationService) as jasmine.SpyObj<BankingAuthenticationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encrypt data if environment.tokenize = true', () => {
    const account = '7825512'
    environment.tokenize = true;
    service.tokenizer(account)
    expect(bankingService.encrypt).toHaveBeenCalledWith(account);
  })

  it('should not encrypt data if environment.tokenize = false', () => {
    const account = '7825512'
    environment.tokenize = false;
    const res = service.tokenizer(account)
    expect(bankingService.encrypt).not.toHaveBeenCalled();
    expect(res).toEqual(account)
  })

});
