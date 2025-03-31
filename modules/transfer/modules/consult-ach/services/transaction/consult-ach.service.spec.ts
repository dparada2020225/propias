import { StorageService } from '@adf/security';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { iCACHDebitRegistersMock } from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {
  ICOResponseCredits,
  ICOResponseDebits,
  ICOTransactionCredit,
  ICOTransactionDebits,
} from '../../interfaces/consult-ach-definition.interface';
import { IMovementOperationResponse, ITypeOperationResponse } from '../../interfaces/transaction.interface';
import { ConsultAchService } from './consult-ach.service';

describe('ConsultAchService', () => {
  let service: ConsultAchService;
  let httpController: HttpTestingController;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConsultAchService, { provide: StorageService, useValue: storageServiceSpy }],
    });
    service = TestBed.inject(ConsultAchService);
    httpController = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should response with array of IMovementOperationResponse', (doneFn) => {
    const mockData: IMovementOperationResponse[] = [
      {
        code: '123456789',
        description: 'TEST',
      },
    ];

    service.getTypeMovement().subscribe((data) => {
      expect(data.length).toEqual(mockData.length);
      expect(data).toEqual(mockData);
      doneFn();
    });

    //http config
    const url = '/v1/ach/information/movements-type';
    const req = httpController.expectOne(url);
    req.flush(mockData);
    expect(req.request.method).toEqual('GET');
  });

  it('should response with array of ITypeOperationResponse', (doneFn) => {
    const mockData: ITypeOperationResponse[] = [
      {
        code: '852',
        description: 'test',
      },
    ];

    service.getTypeOperation().subscribe((data) => {
      expect(data.length).toEqual(mockData.length);
      expect(data).toEqual(mockData);
      doneFn();
    });

    //http config
    const url = '/v1/information/operation-type';
    const req = httpController.expectOne(url);
    req.flush(mockData);
    expect(req.request.method).toEqual('GET');
  });

  it('should search a transaction credit, and return object type ICOResponseCredits', (doneFn) => {
    storageService.getItem.and.returnValue(
      JSON.stringify({
        customerCode: '123',
      })
    );

    const mockData: ICOResponseCredits = {
      code: 782,
      message: 'Ok',
      credits: [
        {
          id: 789,
          creationDate: '2015',
          operation: 'credit',
          transfer: 'credit',
          senderBeneficiary: 'John',
          issuingDestination: 'John ach',
          status: 'asd',
          currency: 'USD',
          amount: '52',
        },
      ],
    };

    const dto: ICOTransactionCredit = {
      typeOperation: 'hola',
      filterValue: 'gatas',
      initDate: '2015',
      finalDate: '2016',
    };

    service.getTransactionCredit({ ...dto }).subscribe((data) => {
      expect(data).toEqual(mockData);
      doneFn();
    });

    //http config
    const url = '/v1/ach/information/ach-credits';
    const req = httpController.expectOne(url);
    req.flush(mockData);
    expect(req.request.body.customerCode).toEqual('123');
    expect(req.request.method).toEqual('POST');
  });

  it('should search a transaction credit, and return object type ICOResponseCredits but not exist localStorage', (doneFn) => {
    storageService.getItem.and.returnValue(
      JSON.stringify({
        notExist: true,
      })
    );

    const mockData: ICOResponseCredits = {
      code: 782,
      message: 'Ok',
      credits: [
        {
          id: 789,
          creationDate: '2015',
          operation: 'credit',
          transfer: 'credit',
          senderBeneficiary: 'John',
          issuingDestination: 'John ach',
          status: 'asd',
          currency: 'USD',
          amount: '52',
        },
      ],
    };

    const dto: ICOTransactionCredit = {
      typeOperation: 'hola',
      filterValue: 'gatas',
      initDate: '2015',
      finalDate: '2016',
    };

    service.getTransactionCredit({ ...dto }).subscribe((data) => {
      expect(data).toEqual(mockData);
      doneFn();
    });

    //http config
    const url = '/v1/ach/information/ach-credits';
    const req = httpController.expectOne(url);
    req.flush(mockData);
    expect(req.request.body.customerCode).toEqual('0');
    expect(req.request.method).toEqual('POST');
  });

  it('should search a transaction Credit Detail, and return a object with type getTransactionCreditDetail', (doneFn) => {
    const creditId = '1';
    const mockDataResponse: any = {
      code: 852,
      message: 'Transaction',
      id: 7,
      operation: 'getTransactionCreditDetail',
      transfer: 'detail',
      currency: 'USD',
      reference: 'ASDDF5',
      creationDate: '2017',
      senderBeneficiary: 'John',
      issuingDestination: 'si',
      statu: 'alta',
      amount: '789',
      operationDate: '2022',
      user: 'Carlos',
      debitAccount: '785230',
      debitAccountName: 'Principal',
      product: 'milk',
      beneficiaryAccount: '78545221',
      lot: 78452,
    };

    service.getTransactionCreditDetail(creditId).subscribe((data) => {
      expect(data).toEqual(mockDataResponse);
      doneFn();
    });

    //http config
    const url = `/v1/ach/information/ach-credit-detail`;
    const req = httpController.expectOne(url);
    req.flush(mockDataResponse);
    expect(req.request.body.creditId).toEqual(creditId);
    expect(req.request.method).toEqual('POST');
  });

  it('should search a Transaction Debits and return a object with type ICOResponseDebits', (doneFn) => {
    const mockDataResponse: ICOResponseDebits = {
      code: 78965,
      message: 'Transaction',
      debits: [iCACHDebitRegistersMock],
    };

    const dto: ICOTransactionDebits = {
      initDate: '2015',
      finalDate: '2016',
    };

    const body = {
      initialDate: dto.initDate,
      finalDate: dto.finalDate,
    };

    service.getTransactionDebits(dto).subscribe((data) => {
      expect(data).toEqual(mockDataResponse);
      doneFn();
    });

    //http config
    const url = '/v1/ach/information/ach-debits';
    const req = httpController.expectOne(url);
    req.flush(mockDataResponse);
    expect(req.request.body).toEqual(body);
    expect(req.request.method).toEqual('POST');
  });
});
