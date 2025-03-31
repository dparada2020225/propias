import {TestBed} from '@angular/core/testing';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {AtdUtilService} from '../../../transfer-ach/services/atd-util.service';
import {BtdTransactionManagerService} from '../definition/transaction/btd-transaction-manager.service';
import {BulkTransactionService} from '../transaction/bulk-transfer-transaction.service';
import {BteTransactionService} from './bte-transaction.service';
import {HandleTokenRequestService} from "../../../../../../service/common/handle-token-request.service";
import {TransferACHService} from "../../../transfer-ach/services/transaction/transfer-ach.service";
import {Router} from "@angular/router";
import {FindServiceCodeService} from "../../../../../../service/common/find-service-code.service";
import {
  StBtProcessManagerService
} from "../../../../../transaction-manager/modules/signature-tracking/services/execution/utils/st-bt-process-manager.service";

describe('BteTransactionService', () => {
  let service: BteTransactionService;

  let btTransactionService: jasmine.SpyObj<BulkTransactionService>;
  let transactionDefinitionManager: jasmine.SpyObj<BtdTransactionManagerService>;
  let achUtils: jasmine.SpyObj<AtdUtilService>;
  let utils: jasmine.SpyObj<UtilService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let handleTokenRequest: jasmine.SpyObj<HandleTokenRequestService>;
  let achTransaction: jasmine.SpyObj<TransferACHService>;
  let router: jasmine.SpyObj<Router>;
  let findServiceCode: jasmine.SpyObj<FindServiceCodeService>;
  let stBTProcessManagerService: jasmine.SpyObj<StBtProcessManagerService>;

  beforeEach(() => {
    const btTransactionServiceSpy = jasmine.createSpyObj('BulkTransactionService', ['codLote', 'bulkTransfer', 'preTransfer', 'saveTransaction'])
    const transactionDefinitionManagerSpy = jasmine.createSpyObj('BtdTransactionManagerService', ['dataToExecuteTransaction', 'dataToExecutePreTransfer'])
    const achUtilsSpy = jasmine.createSpyObj('AtdUtilService', ['getTargetAccountForMassiveTransferenceMap'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'getProfile', 'getTokenType'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const handleTokenRequestSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isTokenRequired'])
    const achTransactionSpy = jasmine.createSpyObj('TransferACHService', ['transactionLimits'])
    const routerSpy = jasmine.createSpyObj('Router', ['url'])
    const findServiceCodeSpy = jasmine.createSpyObj('FindServiceCodeService', ['getServiceCode'])
    const stBTProcessManagerServiceSpy = jasmine.createSpyObj('StBtProcessManagerService', ['handleErrorToTransactionLimits'])

    TestBed.configureTestingModule({
      providers: [
        { provide: BulkTransactionService, useValue: btTransactionServiceSpy },
        { provide: BtdTransactionManagerService, useValue: transactionDefinitionManagerSpy },
        { provide: AtdUtilService, useValue: achUtilsSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: HandleTokenRequestService, useValue: handleTokenRequestSpy },
        { provide: TransferACHService, useValue: achTransactionSpy },
        { provide: Router, useValue: routerSpy },
        { provide: FindServiceCodeService, useValue: findServiceCodeSpy },
        { provide: StBtProcessManagerService, useValue: stBTProcessManagerServiceSpy },
      ],
    });

    service = TestBed.inject(BteTransactionService);
    btTransactionService = TestBed.inject(BulkTransactionService) as jasmine.SpyObj<BulkTransactionService>;
    transactionDefinitionManager = TestBed.inject(BtdTransactionManagerService) as jasmine.SpyObj<BtdTransactionManagerService>;
    achUtils = TestBed.inject(AtdUtilService) as jasmine.SpyObj<AtdUtilService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    handleTokenRequest = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
    achTransaction = TestBed.inject(TransferACHService) as jasmine.SpyObj<TransferACHService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    findServiceCode = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    stBTProcessManagerService = TestBed.inject(StBtProcessManagerService) as jasmine.SpyObj<StBtProcessManagerService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
