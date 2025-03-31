import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpHeaders } from '@angular/common/http';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import {
  iACHAddAccountRequestParametersMock,
  iACHLimitsRequestBodyMock,
  iACHLimitsResponseMock,
  iACHScheduleResponseMock,
  iAchAccountMock,
  iAchCrudTransactionResponseMock,
  iAchTransactionRequestBodyMock,
  iAddFavoriteACHMock,
  iMassiveMessageMock,
  iUpdateAchMock,
  mockIACHSettings,
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import { EACHTypeSchedule } from '../../enum/transfer-ach.enum';
import { IAchAccount } from '../../interfaces/ach-account-interface';
import { IACHLimitsRequestBody, IACHLimitsResponse } from '../../interfaces/ach-limits.interface';
import { IACHScheduleResponse, IAchTransactionRequestBody, IMassiveMessage } from '../../interfaces/ach-transaction.interface';
import { IAddFavoriteACH } from '../../interfaces/ach-transfer.interface';
import { IACHAddAccountRequestParameters, IAchCrudTransactionResponse } from '../../interfaces/crud/crud-create.interface';
import { IACHSettings } from '../../interfaces/settings.interface';
import { TransferACHService } from './transfer-ach.service';

describe('TransferACHService', () => {
  let service: TransferACHService;
  let httpController: HttpTestingController;
  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;

  beforeEach(() => {
    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['addHeaderByToken']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransferACHService, { provide: UtilTransactionService, useValue: utilTransactionSpy }],
    });
    service = TestBed.inject(TransferACHService);
    httpController = TestBed.inject(HttpTestingController);
    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get associate account', (doneFn) => {
    const mockData: IAchAccount[] = [iAchAccountMock];

    service.associatedAccounts('7').subscribe((data) => {
      expect(data).toEqual(mockData);
      expect(data.length).toEqual(mockData.length);
      doneFn();
    });

    //http config
    const url = '/v1/ach';
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
  });

  it('should post an ach Transfer and token required', (doneFn) => {
    const headers = new HttpHeaders().set('headerTest', 'valueTestHeader');

    utilTransaction.addHeaderByToken.and.returnValue(headers);

    const isTokenRequiered: boolean = true;
    const dto: IAchTransactionRequestBody = iAchTransactionRequestBodyMock;
    const tokenValue: string = 'dsassee';

    const responseService: string = '2000';

    service.achTransfer(isTokenRequiered, dto, tokenValue).subscribe((data) => {
      expect(data).toEqual(responseService);
      doneFn();
    });

    //http config
    const url = '/v1/massive-transferences/credit-transfer';
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('headerTest')).toEqual('valueTestHeader');
    req.flush(responseService);
  });

  it('should add favorite', (doneFn) => {
    const dto: IAddFavoriteACH = iAddFavoriteACHMock;
    const resposeMock: string = '200';

    service.addFavorite(dto).subscribe((data) => {
      expect(data).toEqual(resposeMock);
      doneFn();
    });
    //http config
    const url = '/v1/favorites/ach';
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(resposeMock);
  });

  it('should delete favorite', (doneFn) => {
    const numberAccount: string = '788565';
    const responeMock: string = 'response fake';

    service.deleteFavorite(numberAccount).subscribe((data) => {
      expect(data).toEqual(responeMock);
      doneFn();
    });

    //http Config
    const url = `/v1/favorites/ach/${numberAccount}`;
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.urlWithParams).toContain(`${numberAccount}`);
    req.flush(responeMock);
  });

  it('should post create Account Ach', (doneFn) => {
    const dto: IACHAddAccountRequestParameters = iACHAddAccountRequestParametersMock;
    const responseMock: IAchCrudTransactionResponse = iAchCrudTransactionResponseMock;

    const headers = new HttpHeaders().set('headerTestAch', 'valueTestHeaderAch');
    utilTransaction.addHeaderByToken.and.returnValue(headers);

    service.createAccountAch({ ...dto }).subscribe((data) => {
      expect(data).toEqual(responseMock);
      doneFn();
    });

    //http Config
    const url = '/v1/ach';
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dto.bodyRequest);
    expect(req.request.headers.get('headerTestAch')).toEqual('valueTestHeaderAch');
    req.flush(responseMock);
  });

  it('should update Account Ach', (doneFn) => {
    const mockData: IAchCrudTransactionResponse = iAchCrudTransactionResponseMock;
    const dto = {
      bank: '0',
      account: '789',
      updateAch: iUpdateAchMock,
    };

    service.updateAccountAch(dto.updateAch, dto.bank, dto.account).subscribe((data) => {
      expect(data).toEqual(mockData);
      doneFn();
    });

    //http Config
    const url = `/v1/ach/${dto.bank}/${dto.account}`;
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(dto.updateAch);
    req.flush(mockData);
  });

  it('should delete Account Ach', (doneFn) => {
    const mockData: IAchCrudTransactionResponse = iAchCrudTransactionResponseMock;
    const dto = {
      bank: 1,
      account: '741',
    };

    service.deleteAccountAch(dto.bank, dto.account).subscribe((data) => {
      expect(data).toEqual(mockData);
      doneFn();
    });

    //http Config
    const url = `/v1/ach/${dto.bank}/${dto.account}`;
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.urlWithParams).toContain(`${dto.bank}/${dto.account}`);
    req.flush(mockData);
  });

  it('shoul get ach Settings', (doneFn) => {
    const mockResponse: IACHSettings[] = [mockIACHSettings];

    service.achSettings().subscribe((data) => {
      expect(data).toEqual(mockResponse);
      doneFn();
    });

    //http Config
    const url = '/v1/transferences/ach/configuration';
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should get Schedule', (doneFn) => {
    const dto: EACHTypeSchedule = EACHTypeSchedule.ACH;
    const responseMock: IACHScheduleResponse[] = [iACHScheduleResponseMock];

    service.getSchedule(dto).subscribe((data) => {
      expect(data).toEqual(responseMock);
      doneFn();
    });

    const url: string = '/v1/massive-transferences/schedules';
    const req = httpController.expectOne(url);

    expect(req.request.method).toEqual('POST');
    req.flush(responseMock);
  });

  it('should post commissionMessages', (doneFn) => {
    const responseMock: IMassiveMessage[] = [iMassiveMessageMock];

    service.commissionMessages().subscribe((data) => {
      expect(data).toEqual(responseMock);
      doneFn();
    });

    const url: string = '/v1/massive-transferences/commission-messages';
    const req = httpController.expectOne(url);

    expect(req.request.method).toEqual('POST');

    req.flush(responseMock);
  });

  it('should post transactionLimits', (doneFn) => {
    const dto: IACHLimitsRequestBody = iACHLimitsRequestBodyMock;
    const responseMock: IACHLimitsResponse = iACHLimitsResponseMock;

    service.transactionLimits(dto).subscribe((data) => {
      expect(data).toEqual(responseMock);
      doneFn();
    });

    const url: string = '/v1/transferences/ach-limits';
    const req = httpController.expectOne(url);

    expect(req.request.method).toEqual('POST');

    req.flush(responseMock);
  });
});
