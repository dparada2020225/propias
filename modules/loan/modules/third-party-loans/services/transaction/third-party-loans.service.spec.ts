import { TestBed } from '@angular/core/testing';

import { BankingAuthenticationService } from '@adf/security';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IConsultThirdPartyLoanMock, iConsultDetailTPLMock, iConsultNumberLoanMock, iConsultQuotasAmountMock, iCreateNumberLoansMock, iDeleteLoanMock, iGetReceiptBodyRequestMock, iLoansResponseMock, iPaymentExecuteMock, iReceiptResponseMock, iTPLAccountsBodyRequestMock, iThirdPartyLoanAssociateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { ThirdPartyLoansService } from './third-party-loans.service';

describe('ThirdPartyLoansService', () => {
  let service: ThirdPartyLoansService;
  let bankingService: jasmine.SpyObj<BankingAuthenticationService>;
  let httpController: HttpTestingController

  beforeEach(() => {
    const bankingServiceSpy = jasmine.createSpyObj('BankingAuthenticationService', ['encrypt'])
    TestBed.configureTestingModule({
      providers: [
        { provide: BankingAuthenticationService, useValue: bankingServiceSpy },
      ],
      imports: [
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(ThirdPartyLoansService);
    bankingService = TestBed.inject(BankingAuthenticationService) as jasmine.SpyObj<BankingAuthenticationService>;
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post associate Number Loan', (doneFn) => {
    service.associateNumberLoan(iCreateNumberLoansMock).subscribe({
      next: (data) => {
        expect(data).toEqual(iLoansResponseMock)
        doneFn();
      }
    })

    const url: string = '/v1/thirdparties/loan-payment';
    const req = httpController.expectOne(url);
    req.flush(iLoansResponseMock)
    expect(req.request.body).toEqual(iCreateNumberLoansMock)
    expect(req.request.method).toEqual('POST')
  })

  it('should post consult Third Party Loan', (doneFn) => {
    service.consultThirdPartyLoan(iConsultNumberLoanMock).subscribe({
      next: (value) => {
        expect(value).toEqual(IConsultThirdPartyLoanMock)
        doneFn();
      },
    })

    const url: string = '/v1/thirdparties/loan-payment/loan/validation';
    const req = httpController.expectOne(url);
    req.flush(IConsultThirdPartyLoanMock);
    expect(req.request.body).toEqual(iConsultNumberLoanMock)
    expect(req.request.method).toEqual('POST')
  })

  it('should update Associate Number Loan', (doneFn) => {
    service.updateAssociateNumberLoan(iCreateNumberLoansMock).subscribe({
      next: (data) => {
        expect(data).toEqual(iLoansResponseMock)
        doneFn();
      }
    })

    const url: string = '/v1/thirdparties/loan-payment';
    const req = httpController.expectOne(url);
    req.flush(iLoansResponseMock);
    expect(req.request.body).toEqual(iCreateNumberLoansMock)
    expect(req.request.method).toEqual('PUT')
  })

  it('should delete Loan', (doneFn) => {
    service.deleteLoan(iDeleteLoanMock).subscribe({
      next: (data) => {
        expect(data).toEqual(iLoansResponseMock)
        doneFn();
      }
    })

    const url: string = '/v1/thirdparties/loan-payment';
    const req = httpController.expectOne(url);
    req.flush(iLoansResponseMock);
    expect(req.request.body).toEqual(iDeleteLoanMock)
    expect(req.request.method).toEqual('DELETE')
  })

  it('should consult Detail', (doneFn) => {
    service.consultDetail(iConsultNumberLoanMock).subscribe({
      next: (value) => {
        expect(value).toEqual(iConsultDetailTPLMock)
        doneFn();
      },
    })

    const url: string = '/v1/thirdparties/loan-payment/detail';
    const req = httpController.expectOne(url);
    req.flush(iConsultDetailTPLMock);
    expect(req.request.body).toEqual(iConsultNumberLoanMock)
    expect(req.request.method).toEqual('POST')
  })

  it('should get Receipt', (doneFn) => {
    service.getReceipt(iGetReceiptBodyRequestMock).subscribe({
      next: (data) => {
        expect(data).toEqual(iReceiptResponseMock)
        doneFn();
      }
    })

    const url: string = '/v1/thirdparties/loan-payment/receipt';
    const req = httpController.expectOne(url);
    req.flush(iReceiptResponseMock);
    expect(req.request.body).toEqual(iGetReceiptBodyRequestMock)
    expect(req.request.method).toEqual('POST')
  })

  it('should get Third Party Loans Account', (doneFn) => {
    service.getThirdPartyLoansAccount(iTPLAccountsBodyRequestMock).subscribe({
      next: (data) => {
        expect(data).toEqual([iThirdPartyLoanAssociateMock])
        doneFn();
      }
    })

    const url: string = '/v1/thirdparties/loan-payment/pagination';
    const req = httpController.expectOne(url);
    req.flush([iThirdPartyLoanAssociateMock]);
    expect(req.request.body).toEqual(iTPLAccountsBodyRequestMock)
    expect(req.request.method).toEqual('POST')
  })

  it('should consult Quotas Payment', (doneFn) => {
    service.consultQuotasPayment(iConsultQuotasAmountMock).subscribe({
      next: (data) => {
        expect(data).toEqual(200)
        doneFn();
      }
    })

    const url: string = '/v1/thirdparties/loan-payment/installments/payment';
    const req = httpController.expectOne(url);
    req.flush(200);
    expect(req.request.body).toEqual(iConsultQuotasAmountMock)
    expect(req.request.method).toEqual('POST')
  })

  it('should payment Execute', (doneFn) => {

    bankingService.encrypt.and.returnValue('ADFRRT')

    service.paymentExecute(iPaymentExecuteMock, true, 'pl').subscribe({
      next: (data) => {
        expect(data).toEqual(200)
        doneFn();
      }
    })

    const url: string = '/v1/thirdparties/loan-payment/payment-execute';
    const req = httpController.expectOne(url);
    req.flush(200);
    expect(req.request.body).toEqual(iPaymentExecuteMock)
    expect(req.request.method).toEqual('POST')
  })

});
