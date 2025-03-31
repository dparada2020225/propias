import {TestBed} from '@angular/core/testing';

import {Router} from '@angular/router';
import {
  SignatureTrackingService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {iReceiptResponseMock, iTPLPEModifyPaymentStateMock} from 'src/assets/mocks/modules/loan/loan.data.mock';
import {mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {
  iMultipleRequestResponseMock
} from '../../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {ThirdPartyLoansService} from '../../transaction/third-party-loans.service';
import {TppleModifyPaymentService} from './tpple-modify-payment.service';
import {
  StBuildUpdateBodyRequestService
} from "../../../../../../transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('TppleModifyPaymentService', () => {
  let service: TppleModifyPaymentService;
  let tplPaymentService: jasmine.SpyObj<ThirdPartyLoansService>;
  let transactionService: jasmine.SpyObj<SignatureTrackingService>;
  let stBuildUpdateBodyRequest: jasmine.SpyObj<StBuildUpdateBodyRequestService>;
  let utils: jasmine.SpyObj<UtilService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tplPaymentServiceSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['getReceipt'])
    const transactionServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['update'])
    const stBuildUpdateBodyRequestSpy = jasmine.createSpyObj('StBuildUpdateBodyRequestService', ['buildBodyToUpdateThirdPartyLoan'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader', 'scrollToTop', 'parseCustomNumber'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    TestBed.configureTestingModule({
      providers: [
        { provide: ThirdPartyLoansService, useValue: tplPaymentServiceSpy },
        { provide: SignatureTrackingService, useValue: transactionServiceSpy },
        { provide: StBuildUpdateBodyRequestService, useValue: stBuildUpdateBodyRequestSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    });
    service = TestBed.inject(TppleModifyPaymentService);
    tplPaymentService = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    transactionService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;
    stBuildUpdateBodyRequest = TestBed.inject(StBuildUpdateBodyRequestService) as jasmine.SpyObj<StBuildUpdateBodyRequestService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute', () => {
    router.navigate.and.returnValue(mockPromise(true));
    transactionService.update.and.returnValue(mockObservable(iMultipleRequestResponseMock));
    tplPaymentService.getReceipt.and.returnValue(mockObservable(iReceiptResponseMock));
    service.execute(iTPLPEModifyPaymentStateMock);
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/stm-voucher']);
    expect(parameterManagement.sendParameters).toHaveBeenCalled();
  });

  it('should execute but have error', () => {
    router.navigate.and.returnValue(mockPromise(true));
    tplPaymentService.getReceipt.and.returnValue(
      mockObservableError({
        error: {
          code: 404,
        },
      })
    );
    service.execute(iTPLPEModifyPaymentStateMock);
    expect(utils.hideLoader).toHaveBeenCalled();
    expect(utils.scrollToTop).toHaveBeenCalled();
  });
});
