import {TestBed} from '@angular/core/testing';

import {PmpeTransactionService} from './pmpe-transaction.service';
import {ParameterManagementService} from "../../../../../service/navegation-parameters/parameter-management.service";
import {HandleTokenRequestService} from "../../../../../service/common/handle-token-request.service";
import {UtilService} from "../../../../../service/common/util.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {mockPromise} from "../../../../../../assets/testing";
import {SPPMRoutes} from "../../enums/pmp-routes.enum";
import {PmpTransactionService} from "../transaction/pmp-transaction.service";
import {PmpeBuilddataService} from "./pmpe-builddata.service";
import {UtilTransactionService} from "../../../../../service/common/util-transaction.service";

fdescribe('SppeTransactionService', () => {
  let service: PmpeTransactionService;
  let utils: jasmine.SpyObj<UtilService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let handleTokenRequest: jasmine.SpyObj<HandleTokenRequestService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let serviceTransactions: jasmine.SpyObj<PmpTransactionService>;
  let router: jasmine.SpyObj<Router>;
  let buildDataToTransfer: jasmine.SpyObj<PmpeBuilddataService>;
  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;

  beforeEach(() => {
    const utilsSpy = jasmine.createSpyObj('UtilService', ['scrollToTop', 'hideLoader', 'showLoader', 'hidePulseLoader', 'getProfile'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const handleTokenRequestSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isTokenRequired'])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const serviceTransactionsSpy = jasmine.createSpyObj('PmpTransactionService', ['sendFTPFile', 'payPayroll'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const buildDataToTransferSpy = jasmine.createSpyObj('PmpeBuilddataService', ['generateDataToPayPayroll', 'initData', 'buildFile'])
    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleResponseTransaction', 'handleErrorTransaction'])
    TestBed.configureTestingModule({
      providers: [
        { provide: UtilService, useValue: utilsSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: HandleTokenRequestService, useValue: handleTokenRequestSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: PmpTransactionService, useValue: serviceTransactionsSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PmpeBuilddataService, useValue: buildDataToTransferSpy },
        { provide: UtilTransactionService, useValue: utilTransactionSpy },
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

    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    handleTokenRequest = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    serviceTransactions = TestBed.inject(PmpTransactionService) as jasmine.SpyObj<PmpTransactionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    buildDataToTransfer = TestBed.inject(PmpeBuilddataService) as jasmine.SpyObj<PmpeBuilddataService>;
    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    service = TestBed.inject(PmpeTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  it('should navigateSuccessTransaction', () => {

    router.navigate.and.returnValue(mockPromise(true));

    service['navigateSuccessTransaction']({} as any);

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.VOUCHER_PAYMENT])
  })

});
