import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenizerAccountsService } from '../../token/tokenizer-accounts.service';
import { AccountBalanceService } from './account-balance.service';

describe('AccountBalanceService', () => {
  let service: AccountBalanceService;
  let tokenizerEncrypt: jasmine.SpyObj<TokenizerAccountsService>;
  let httpController: HttpTestingController;


  beforeEach(() => {

    const tokenizerEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer'])

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenizerAccountsService, useValue: tokenizerEncryptSpy },
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(AccountBalanceService);

    httpController = TestBed.inject(HttpTestingController);
    tokenizerEncrypt = TestBed.inject(TokenizerAccountsService) as jasmine.SpyObj<TokenizerAccountsService>;
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Account Balance', (doneFn) => {
    const dto = '8525845'
    const dataMock = 'ok'
    tokenizerEncrypt.tokenizer.and.returnValue(dto)

    service.getAccountBalance(dto).subscribe((data) => {
      expect(data).toEqual(dataMock)
      doneFn()
    })

    const url = '/v1/inquiries/account-balance';
    const req = httpController.expectOne(url);
    req.flush(dataMock)
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual({ account: dto })
  })

  it('should get Detail Reservation', (doneFn) => {
    const dto = { account: '33699', type: '1' };
    const dataMock = 'OK';
    tokenizerEncrypt.tokenizer.and.returnValue('33699');

    service.getDetailReservation(dto.account, dto.type).subscribe((data) => {
      expect(data).toEqual(dataMock)
      doneFn()
    })

    const url = '/v1/inquiries/clearing';
    const req = httpController.expectOne(url);
    req.flush(dataMock)
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual({ account: dto.account, type: dto.type });
  })

});
