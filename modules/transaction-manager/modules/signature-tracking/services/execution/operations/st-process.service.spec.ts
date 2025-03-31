import {TestBed} from '@angular/core/testing';
import {TmCommonService} from '../../../../../services/tm-common.service';
import {StCommonTransactionService} from '../st-common-transaction.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {UtilService} from "../../../../../../../service/common/util.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FeatureManagerService} from "../../../../../../../service/common/feature-manager.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {StProcessService} from "./st-process.service";
import { TmdNavigateOperationService } from 'src/app/modules/transaction-manager/services/core/bp/tmd-navigate-operation.service';

describe('StProcessService', () => {
  let service: StProcessService;

  let transactionManagerCommon: jasmine.SpyObj<TmCommonService>;
  let stCommonTransaction: jasmine.SpyObj<StCommonTransactionService>;
  let navigateOperationManager: jasmine.SpyObj<TmdNavigateOperationService>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let utils: jasmine.SpyObj<UtilService>;
  let featureManager: jasmine.SpyObj<FeatureManagerService>;

  beforeEach(() => {
    const transactionManagerCommonSpy = jasmine.createSpyObj('TmCommonService', ['isSupportedTransaction', 'handleNavigateToEmbbededBanking'])
    const stCommonTransactionSpy = jasmine.createSpyObj('StCommonTransactionService', ['parseTransactionFromResponseToTransaction', 'getCurrentStep', 'modalFailedTransactions'])
    const navigateOperationManagerSpy = jasmine.createSpyObj('TmdNavigateOperationService', ['goToOperationTransaction'])
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hidePulseLoader', 'showPulseLoader', 'showLoader'])
    const featureManagerSpy = jasmine.createSpyObj('FeatureManagerService', ['isSignatureTrackingMultipleOperationsEnabled'])

    TestBed.configureTestingModule({
      providers: [
        { provide: TmCommonService, useValue: transactionManagerCommonSpy },
        { provide: StCommonTransactionService, useValue: stCommonTransactionSpy },
        { provide: TmdNavigateOperationService, useValue: navigateOperationManagerSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: FeatureManagerService, useValue: featureManagerSpy },
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

    transactionManagerCommon = TestBed.inject(TmCommonService) as jasmine.SpyObj<TmCommonService>;
    stCommonTransaction = TestBed.inject(StCommonTransactionService) as jasmine.SpyObj<StCommonTransactionService>;
    navigateOperationManager = TestBed.inject(TmdNavigateOperationService) as jasmine.SpyObj<TmdNavigateOperationService>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    // stProcessMultipleTransactionManager = TestBed.inject(StProcessMultipleTransactionManagerService) as jasmine.SpyObj<StProcessMultipleTransactionManagerService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    featureManager = TestBed.inject(FeatureManagerService) as jasmine.SpyObj<FeatureManagerService>;

    service = TestBed.inject(StProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
