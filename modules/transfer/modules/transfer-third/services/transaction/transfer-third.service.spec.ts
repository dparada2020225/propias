import {TestBed} from '@angular/core/testing';

import {TransferThirdService} from './transfer-third.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UtilTransactionService} from "../../../../../../service/common/util-transaction.service";
import {
  iAddFavoriteThirdMock,
  iCrateAccountThirdTransferResponseMock,
  iCreateThirdMock,
  iGetThirdTransferResponseMock,
  iThirdTransferMock,
  iThirdTransfersAccountsMock,
  iTransferThirdMock,
  iUpdateThirdMock
} from "../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";
import {IAddFavoriteThird} from "../../interfaces/third-crud.interface";
import {IThirdTransfer, IThirdTransfersAccounts} from "../../../../interface/transfer-data-interface";
import {BankingAuthenticationService} from "@adf/security";
import {ITTRAddAccountRequest} from "../../interfaces/crud/add-third-interface";
import {HttpHeaders} from "@angular/common/http";
import {ERequestTypeHeader} from "../../../../../../enums/transaction-header.enum";
import {
  ICrateAccountThirdTransferResponse,
  IGetThirdTransferResponse,
  ITransferThird
} from "../../interfaces/third-transfer-service";
import {ITTRUpdateAccountRequest} from "../../interfaces/crud/update-third-interface";
import {ITTRDeleteAccountRequest} from "../../interfaces/crud/delete-third-interface";


describe('TransferThirdService', () => {
  let service: TransferThirdService;
  let controller: HttpTestingController;
  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;
  let bankingService: jasmine.SpyObj<BankingAuthenticationService>;

  beforeEach(() => {

    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['addHeaderByToken'])
    const bankingServiceSpy = jasmine.createSpyObj('BankingAuthenticationService', ['encrypt'])

    TestBed.configureTestingModule({
      providers: [
        {provide: UtilTransactionService, useValue: utilTransactionSpy},
        {provide: BankingAuthenticationService, useValue: bankingServiceSpy},
        TransferThirdService
      ],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(TransferThirdService);
    controller = TestBed.inject(HttpTestingController)
    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    bankingService = TestBed.inject(BankingAuthenticationService) as jasmine.SpyObj<BankingAuthenticationService>;
  });

  afterEach(() => {
    controller.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post associateAccount', () => {
    const token: string = '#"$Ddf'
    const headers = new HttpHeaders().set(ERequestTypeHeader.TOKEN_VALUE, token)
    utilTransaction.addHeaderByToken.and.returnValue(headers)
    const dto: ITTRAddAccountRequest = {
      bodyRequest: iCreateThirdMock,
      isTokenRequired: true,
      token
    }
    const response: ICrateAccountThirdTransferResponse = iCrateAccountThirdTransferResponseMock;

    service.associateAccount(dto).subscribe((re) => {
      expect(re).toEqual(response)
    })

    const url: string = '/v1/thirdparties';
    const req = controller.expectOne(url);
    req.flush(response)
    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get(ERequestTypeHeader.TOKEN_VALUE)).toEqual(token)
  })

  it('should update account', () => {
    const token: string = '8547#"#$'
    const numberAccount: string = '010010012254'

    const headers = new HttpHeaders().set(ERequestTypeHeader.TYPE_TRANSACTION, token)
    utilTransaction.addHeaderByToken.and.returnValue(headers)

    const dto: ITTRUpdateAccountRequest = {
      bodyRequest: iUpdateThirdMock,
      isTokenRequired: false,
      token,
      numberAccount
    }
    const response = 'bien';

    service.update(dto).subscribe(res => {
      expect(res?.body).toEqual(response)
    })

    const url: string = '/v1/thirdparties';
    const req = controller.expectOne(url);
    req.flush(response)

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(dto.bodyRequest);
  })

  it('should delete account', () => {

    const token: string = '8547#"#$'
    const numberAccount: string = '010010012254'
    bankingService.encrypt.and.returnValue(numberAccount);

    const headers = new HttpHeaders().set(ERequestTypeHeader.TYPE_TRANSACTION, token)
    utilTransaction.addHeaderByToken.and.returnValue(headers)

    const dto: ITTRDeleteAccountRequest = {
      numberAccount,
      token,
      isTokenRequired: true
    }

    const responseMock: string = 'ok'

    service.delete(dto).subscribe(res => {
      expect(res.body).toEqual(responseMock)
    })

    const url: string = `/v1/thirdparties/account/${numberAccount}`;
    const req = controller.expectOne(url);
    req.flush(responseMock);

    expect(req.request.method).toEqual('DELETE');
  })

  it('should delete Favorite account', () => {
    const dto: string = '653125612';
    const responseMock: string = 'favorite delete';
    bankingService.encrypt.and.returnValue(dto)

    service.deleteFavorite(dto).subscribe((response) => {
      expect(response).toEqual(responseMock)
    })

    const url: string = `/v1/favorites/thirdparties/account/${dto}`;
    const req = controller.expectOne(url);
    req.flush(responseMock);
    expect(req.request.method).toEqual('DELETE');
  })

  it('should add Favorite', () => {
    const dto: IAddFavoriteThird = iAddFavoriteThirdMock;
    const responseMock: string = 'add favorite Success';

    service.addFavorite(dto).subscribe((response) => {
      expect(response).toEqual(responseMock)
    })

    const url: string = `/v1/favorites/thirdparties`;
    const req = controller.expectOne(url);
    req.flush(responseMock);
    expect(req.request.method).toEqual('POST')
  })

  it('should get third', () => {
    const number: string = '455454552';
    bankingService.encrypt.and.returnValue(number);
    const response: IGetThirdTransferResponse = iGetThirdTransferResponseMock;

    service.getThird(number).subscribe(res => {
      expect(res).toEqual(response)
    })

    const url: string = `/v1/thirdparties/general-info/${number}`;
    const req = controller.expectOne(url);
    req.flush(response);

    expect(req.request.method).toEqual('GET')
  })

  it('should getTransferThird', () => {
    const token: string = '&%$45'
    const headers = new HttpHeaders().set(ERequestTypeHeader.TOKEN_VALUE, token)
    utilTransaction.addHeaderByToken.and.returnValue(headers)
    const isTokenRequired: boolean = true;
    const dto: IThirdTransfer = {...iThirdTransferMock};
    const response: ITransferThird = {...iTransferThirdMock};

    service.getTransferThird(isTokenRequired, dto, token).subscribe(res => {
      expect(res).toEqual(response)
    })

    const url: string = '/v1/transferences/third';
    const req = controller.expectOne(url);
    req.flush(response);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dto)

  })

  it('should getAssociatedThirdAccounts', () => {
    const responseMock: IThirdTransfersAccounts[] = [iThirdTransfersAccountsMock]

    service.getAssociatedThirdAccounts().subscribe((response) => {
      expect(response).toEqual(responseMock);
    })

    const url: string = '/v1/thirdparties';
    const req = controller.expectOne(url);
    req.flush(responseMock);
    expect(req.request.method).toEqual('GET');
  })

  it('should getTransferThirdFavoriteAccount', () => {
    const responseMock: IThirdTransfersAccounts[] = [iThirdTransfersAccountsMock];

    service.getTransferThirdFavoriteAccount().subscribe((response) => {
      expect(response).toEqual(responseMock);
    })

    const url: string = '/v1/favorites/thirdparties';
    const req = controller.expectOne(url);
    req.flush(responseMock);

    expect(req.request.method).toEqual('GET')
  })

});
