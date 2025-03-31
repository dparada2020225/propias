import {TestBed} from '@angular/core/testing';

import {PmpTransactionService} from './pmp-transaction.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {IGetThirdTransferResponse} from "../../../../transfer/modules/transfer-third/interfaces/third-transfer-service";
import {
  iGetThirdTransferResponseMock
} from "../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";
import {
  ISaveDataPayroll,
  ISPPCorrelativePayroll,
  ISPPFileResponseMasiveAccounts
} from "../../interfaces/pmp-state.interface";
import {
  iBodyRequestPayroll,
  iGetPayedPayrollDetailBodyRequestMock,
  iPayedPayrollDetailResponseMock,
  iPayrollPaySuccessMock,
  iSaveDataPayrollMock,
  iSaveDataPayrollResponseMock,
  iSPPCorrelativePayrollMock,
  iSPPFileResponseMasiveAccountsMock
} from "../../../../../../assets/mocks/modules/payroll/payroll.mock";
import {UtilTransactionService} from "../../../../../service/common/util-transaction.service";
import {IPayrollPaySuccess, ISaveDataPayrollResponse} from "../../interfaces/pmpe-transaction.interface";
import {GetPayedPayrollDetailBodyRequest} from "../../interfaces/pmp-load-form.interface";
import {PayedPayrollDetailResponse} from "../../interfaces/pmp-payed-payroll.interface";
import {IPayPayroll} from "../../interfaces/pmp-payment-home.interface";
import {IBodyRequest} from "../../../../../models/token.interface";

describe('SppTransactionService', () => {
  let service: PmpTransactionService;
  let httpController: HttpTestingController;
  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;


  beforeEach(() => {

    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['addHeaderByToken'])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: UtilTransactionService, useValue: utilTransactionSpy },
      ]
    });
    service = TestBed.inject(PmpTransactionService);
    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should consult acccount', () => {

    const dto:string = '785425';
    const responseMock:IGetThirdTransferResponse = iGetThirdTransferResponseMock;

    service.consult(dto).subscribe(data => {
      expect(data).toEqual(responseMock)
    })

    const url:string = `/v1/thirdparties/general-info`;
    const req = httpController.expectOne(url);
    req.flush(responseMock);
    expect(req.request.method).toEqual('POST');
  })

  it('should get Payroll To Payment', () => {
    const response:any = 'test';

    service.getPayrollToPayment(12 as any).subscribe(data => {
      expect(data).toEqual(response)
    })

    const url:string = '/v1/payroll-payment/get-participants';
    const req = httpController.expectOne(url);
    req.flush(response);
  })

  it('should get Payroll To Payment By Id', () => {
    const response:any = 'test';
    const dto:number = 48569;

    service.getOperatedPayroll(dto, dto).subscribe(data => {
      expect(data).toEqual(response)
    })

    const url:string = '/v1/payroll-payment/get';
    const req = httpController.expectOne(url);
    req.flush(response);
  })

  it('should validate multy accounts', () => {
    const dto:string[] = ['7757575777'];
    const response:ISPPFileResponseMasiveAccounts[] = [iSPPFileResponseMasiveAccountsMock];


    service.consultMultipliAccounts(dto).subscribe(data => {
      expect(data).toEqual(response);
    })

    const url:string = '/v1/payroll-payment/accounts-validation';
    const req = httpController.expectOne(url);
    req.flush(response);
    expect(req.request.method).toEqual("POST")
    expect(req.request.body).toEqual({accounts: dto})
  })

  it('should getHistoryPayrollPayment', () => {

    const payrollNumber:string = '41544445';
    const res = 'ok';

    service.getHistoryPayrollPayment(payrollNumber).subscribe(data => {
      expect(data).toEqual(res)
    })

    const url:string = '/v1/payroll-payment/inquiry';
    const req = httpController.expectOne(url);
    req.flush(res);
    expect(req.request.method).toEqual("POST");

  })

  it('should generateCorrelative', () => {

    const res:ISPPCorrelativePayroll = iSPPCorrelativePayrollMock;

    service.generateCorrelative().subscribe(data => {
      expect(data).toEqual(res)
    })

    const url:string = '/v1/payroll-payment/correlative';
    const req = httpController.expectOne(url);
    req.flush(res);
    expect(req.request.method).toEqual("POST");

  })

  it('should saveParticipantPayroll', () => {
    const dto:ISaveDataPayroll = iSaveDataPayrollMock
    const res:ISaveDataPayrollResponse = iSaveDataPayrollResponseMock;

    service.saveParticipantPayroll(dto).subscribe(data => {
      expect(data).toEqual(res)
    })

    const url:string = '/v1/payroll-payment/save-participants';
    const req = httpController.expectOne(url);
    req.flush(res);
    expect(req.request.method).toEqual("POST");
  })

  it('should getPayedPayrollDetail', () => {
    const dto:GetPayedPayrollDetailBodyRequest = iGetPayedPayrollDetailBodyRequestMock
    const res:PayedPayrollDetailResponse = iPayedPayrollDetailResponseMock;

    service.getPayedPayrollDetail(dto).subscribe(data => {
      expect(data).toEqual(res)
    })

    const url:string = '/v1/payroll-payment/get';
    const req = httpController.expectOne(url);
    req.flush(res);
    expect(req.request.method).toEqual("POST");
  })

  it('should sendFTPFile', () => {
    const dto:FormData = {} as any;
    const res:any = 'no responde bien';

    service.sendFTPFile(dto).subscribe(data => {
      expect(data).toEqual(res)
    })

    const url:string = '/v1/payroll-payment/upload-file';
    const req = httpController.expectOne(url);
    req.flush(res);
    expect(req.request.method).toEqual("POST");
  })


  it('should payPayroll', () => {
    const dto:IBodyRequest<IPayPayroll> = iBodyRequestPayroll;
    const res:IPayrollPaySuccess = iPayrollPaySuccessMock;

    service.payPayroll(dto).subscribe(data => {
      expect(data).toEqual(res)
    })

    const url:string = '/v1/payroll-payment';
    const req = httpController.expectOne(url);
    req.flush(res);
    expect(req.request.method).toEqual("POST");
  })

});
