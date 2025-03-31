import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { iB2bConsultationAccountsMock, iB2bConsultationDetailMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bConsultationTransactionService } from './b2b-consultation-transaction.service';

describe('B2bConsultationTransactionService', () => {
  let service: B2bConsultationTransactionService;
  let tokenizerAccount: jasmine.SpyObj<TokenizerAccountsService>;
  let httpClient: HttpTestingController;

  beforeEach(() => {
    const tokenizerAccountSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer'])
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenizerAccountsService, useValue: tokenizerAccountSpy },
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(B2bConsultationTransactionService);
    tokenizerAccount = TestBed.inject(TokenizerAccountsService) as jasmine.SpyObj<TokenizerAccountsService>;
    httpClient = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpClient.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get b2b List', () => {
    service.b2bList().subscribe({
      next(value) {
        expect(value).toEqual([iB2bConsultationAccountsMock])
      },
    })

    const url: string = '/v1/back-to-back';
    const req = httpClient.expectOne(url);
    req.flush([iB2bConsultationAccountsMock])
    expect(req.request.method).toEqual('GET');
  })

  it('should b2b Detail', () => {

    const account:string = '45755'
    tokenizerAccount.tokenizer.and.returnValue(account);

    service.b2bDetail(account).subscribe({
      next(value) {
        expect(value).toEqual(iB2bConsultationDetailMock)
      },
    })

    const url: string = '/v1/back-to-back/detail';
    const req = httpClient.expectOne(url);
    req.flush(iB2bConsultationDetailMock)
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      account
    })
  })

});
