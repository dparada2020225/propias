// import { TestBed } from '@angular/core/testing';

// import { StRejectService } from './st-reject.service';
// import { TmCommonService } from '../../../../../services/tm-common.service';
// import { StCommonTransactionService } from '../st-common-transaction.service';
// import { TmdNavigateOperationService } from '../../../../../services/tmd-navigate-operation.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import {
//   iSTOperationStartupParameters,
//   iSTOperationStartupParametersNull,
// } from '../../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction';
// describe('StRejectService', () => {
//   let service: StRejectService;

//   let transactionManagerCommon: jasmine.SpyObj<TmCommonService>;
//   let stCommonTransaction: jasmine.SpyObj<StCommonTransactionService>;
//   let navigateOperationManager: jasmine.SpyObj<TmdNavigateOperationService>;
//   let spinner: jasmine.SpyObj<NgxSpinnerService>;
//   let signatureTrackingService: jasmine.SpyObj<SignatureTrackingService>;

//   beforeEach(() => {
//     const transactionManagerCommonSpy = jasmine.createSpyObj('TmCommonService', [
//       'isSupportedTransaction',
//       'handleNavigateToEmbbededBanking',
//     ]);
//     const stCommonTransactionSpy = jasmine.createSpyObj('StCommonTransactionService', [
//       'getCurrentStep',
//       'modalFailedTransactions',
//       'getTransactionStatus',
//       'buildTransactionDetailResponse',
//     ]);
//     const navigateOperationManagerSpy = jasmine.createSpyObj('TmdNavigateOperationService', ['goToOperationTransaction']);
//     const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
//     const signatureTrackingServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['toReturn']);
//     const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter']);

//     TestBed.configureTestingModule({
//       providers: [
//         StRejectService,
//         { provide: TmCommonService, useValue: transactionManagerCommonSpy },
//         { provide: StCommonTransactionService, useValue: stCommonTransactionSpy },
//         { provide: TmdNavigateOperationService, useValue: navigateOperationManagerSpy },
//         { provide: NgxSpinnerService, useValue: spinnerSpy },
//         { provide: SignatureTrackingService, useValue: signatureTrackingServiceSpy },
//       ],
//       imports: [HttpClientTestingModule],
//     });

//     transactionManagerCommon = TestBed.inject(TmCommonService) as jasmine.SpyObj<TmCommonService>;
//     stCommonTransaction = TestBed.inject(StCommonTransactionService) as jasmine.SpyObj<StCommonTransactionService>;
//     navigateOperationManager = TestBed.inject(TmdNavigateOperationService) as jasmine.SpyObj<TmdNavigateOperationService>;
//     spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
//     signatureTrackingService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;

//     service = TestBed.inject(StRejectService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should get loading, currentMessage and message ', () => {
//     expect(service.loading).toBeTruthy();
//     expect(service.currentMessage).toBeNull();
//     expect(service.message).toBeDefined();
//   });

//   it('should reject function is funcionality', () => {
//     service.reject(iSTOperationStartupParameters);
//     expect(transactionManagerCommon.handleNavigateToEmbbededBanking).toHaveBeenCalled();
//   });

//   it('should reject function is funcionality when isSupportedTransaction = true', () => {
//     transactionManagerCommon.isSupportedTransaction.and.returnValue(true);
//     service.reject(iSTOperationStartupParameters);
//     expect(navigateOperationManager.goToOperationTransaction).toHaveBeenCalled();
//   });

//   it('should reject function is funcionality when null', () => {
//     service.reject(iSTOperationStartupParametersNull);
//     expect(service.reject).toBeTruthy();
//   });

//   it('should send function varios', () => {
//     expect(service.reject).toBeTruthy();
//   });
// });
