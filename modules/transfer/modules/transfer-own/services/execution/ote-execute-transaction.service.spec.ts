import {TestBed} from '@angular/core/testing';

import {OteExecuteTransactionService} from './ote-execute-transaction.service';
import {UtilTransactionService} from "../../../../../../service/common/util-transaction.service";
import {HandleTokenRequestService} from "../../../../../../service/common/handle-token-request.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UtilService} from "../../../../../../service/common/util.service";
import {OtdTransferVoucherManagerService} from "../definition/manager/otd-transfer-voucher-manager.service";
import {OwnTransferService} from "../transaction/own-transfer.service";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {Router} from "@angular/router";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

describe('OteExecuteTransactionService', () => {
  let service: OteExecuteTransactionService;

  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;
  let handleTokenRequest: jasmine.SpyObj<HandleTokenRequestService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let util: jasmine.SpyObj<UtilService>;
  let OtdTransferVoucherManager: jasmine.SpyObj<OtdTransferVoucherManagerService>;
  let ownTransferService: jasmine.SpyObj<OwnTransferService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {

    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleErrorTransaction', 'handleResponseTransaction'])
    const handleTokenRequestSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isTokenRequired'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'hidePulseLoader', 'scrollToTop', 'showLoader'])
    const OtdTransferVoucherManagerSpy = jasmine.createSpyObj('OtdTransferVoucherManagerService', ['buildAccountToExecuteTransferStep3'])
    const ownTransferServiceSpy = jasmine.createSpyObj('OwnTransferService', ['ownTransfer'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    TestBed.configureTestingModule({
      providers: [
        { provide: UtilTransactionService, useValue: utilTransactionSpy },
        { provide: HandleTokenRequestService, useValue: handleTokenRequestSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: OtdTransferVoucherManagerService, useValue: OtdTransferVoucherManagerSpy },
        { provide: OwnTransferService, useValue: ownTransferServiceSpy },
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(OteExecuteTransactionService);

    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    handleTokenRequest = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    OtdTransferVoucherManager = TestBed.inject(OtdTransferVoucherManagerService) as jasmine.SpyObj<OtdTransferVoucherManagerService>;
    ownTransferService = TestBed.inject(OwnTransferService) as jasmine.SpyObj<OwnTransferService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
