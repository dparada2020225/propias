import {TestBed} from '@angular/core/testing';

import {OwnTransferService} from './own-transfer.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {IResponseOwnTransfers} from '../../interfaces/own-transfer-respoce.interface';
import {
  iExecuteOwnTransferMock,
  iResponseOwnTransfersMock
} from 'src/assets/mocks/modules/transfer/service/own-transfer/own.data.mock';
import {UtilTransactionService} from "../../../../../../service/common/util-transaction.service";
import {IBodyRequest} from "../../../../../../models/token.interface";
import {IExecuteOwnTransfer} from "../../interfaces/own-transfer.interface";

describe('OwnTransferService', () => {
  let service: OwnTransferService;
  let httpController: HttpTestingController;
  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;


  beforeEach(() => {

    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['addHeaderByToken'])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UtilTransactionService, useValue: utilTransactionSpy },
      ]
    });
    service = TestBed.inject(OwnTransferService);
    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return IResponseOwnTransfers', () => {
    const dto: IBodyRequest<IExecuteOwnTransfer> = {
      bodyRequest: iExecuteOwnTransferMock,
      token: '575433351',
      isTokenRequired: true
    };
    const dataMock: IResponseOwnTransfers = iResponseOwnTransfersMock;

    service.ownTransfer(dto).subscribe((data) => {
      expect(data).toEqual(dataMock);
    });

    const url = `/v1/transferences/own`;
    const req = httpController.expectOne(url);
    req.flush(dataMock);
    expect(req.request.method).toEqual('POST');
  });

});
