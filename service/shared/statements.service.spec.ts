import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { iAccount } from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import { IAccount } from '../../models/account.inteface';
import { TokenizerAccountsService } from '../token/tokenizer-accounts.service';
import { EEntryType, StatementsService } from './statements.service';

describe('StatementsService', () => {
  let service: StatementsService;
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
    service = TestBed.inject(StatementsService);

    httpController = TestBed.inject(HttpTestingController);
    tokenizerEncrypt = TestBed.inject(TokenizerAccountsService) as jasmine.SpyObj<TokenizerAccountsService>;
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a new window with the PDF file', () => {
    spyOn(window, 'open');
    service.downloadPdf();
    expect(window.open).toHaveBeenCalledWith('assets/pdf-test.pdf', '_blank');
  });

  it('should get Data', () => {
    const dto = 'test';
    const dataMock = 'hola'

    service.getData(dto).subscribe((data) => {
      expect(data).toEqual(dataMock);
    })

    const url = '/v1/inquiries/account-statement'
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.body).toEqual(dto)
    expect(req.request.method).toEqual('POST')
  })

  it('should get Detail For Notes', () => {
    const accountMock = '752425'
    tokenizerEncrypt.tokenizer.and.returnValue(accountMock)

    const dto = { account: accountMock, date: '21/06/2023', reference: 'OSDJ', currency: 'USD', agency: '1', sequence: '2' }
    const dataMock = 'Exito'

    service.getDetailForNotes(dto.account, dto.date, dto.reference, dto.currency, dto.agency, dto.sequence).subscribe((data) => {
      expect(data).toEqual(dataMock)
      expect(tokenizerEncrypt.tokenizer).toHaveBeenCalled();
    })

    const url = '/v1/inquiries/note';
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.body).toEqual(dto);
    expect(req.request.method).toEqual('POST');
  })

  it('should get Detail For Deposits', () => {
    const accountMock = '752425'
    tokenizerEncrypt.tokenizer.and.returnValue(accountMock)

    const dto = { account: accountMock, date: '21', time: '10:10:10', reference: 'KDSFO', sequence: '4' }

    const dataMock = 'Petición exitosa'

    service.getDetailForDeposits(dto.account, dto.date, dto.time, dto.reference, dto.sequence).subscribe((data) => {
      expect(data).toEqual(dataMock)
      expect(tokenizerEncrypt.tokenizer).toHaveBeenCalled();
    })

    const url = '/v1/inquiries/deposit-detail';
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.body).toEqual(dto);
    expect(req.request.method).toEqual('POST');
  })

  it('should get Accounts', () => {
    const dto = { service: 'transfer', entryType: '1', product: '1' };
    const dataMock = '200 succesfully'

    service.getAccounts(dto.service, dto.entryType, dto.product).subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = `/v1/agreement/agreement/accounts?service=${dto.service}&entryType=${dto.entryType}&product=${dto.product}`;
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.method).toEqual('GET');
  })

  it('should get Accounts Without Product', () => {

    const dto = { service: 'transfer', entryType: EEntryType.DEBIT };
    const dataMock: IAccount[] = [iAccount]

    service.getAccountsWithoutProduct(dto.service, dto.entryType).subscribe((data) => {
      expect(data).toEqual(dataMock);
    })

    const url = `/v1/agreement/agreement/accounts-service?service=${dto.service}&entryType=${dto.entryType}`;
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.method).toEqual('GET');
  })

  it('should retrieve mnemonics from cache if available', () => {
    const mnemonic = 'test';
    const expectedResponse = ['test1', 'test2'];
    service['mnemonics'].set(mnemonic, expectedResponse);

    service.getMenmonics(mnemonic).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });
  });

  it('should retrieve mnemonics from API if not available in cache', () => {
    const mnemonic = 'test';
    const expectedResponse = ['test1', 'test2'];

    service.getMenmonics(mnemonic).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpController.expectOne('/v1/agreement/agreement/mnemonics?mnemonic=test');
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

});
