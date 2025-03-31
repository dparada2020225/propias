// import { TestBed } from '@angular/core/testing';
// import { TmCommonService } from '../../../../../services/tm-common.service';

// import { StSendService } from './st-send.service';
// import { StCommonTransactionService } from '../st-common-transaction.service';
// import { TmdNavigateOperationService } from '../../../../../services/tmd-navigate-operation.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import {
//   iSTOperationStartupParameters,
//   iSTOperationStartupParametersNull,
// } from '../../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction';

// describe('StSendService', () => {
//   let service: StSendService;

//   let transactionManagerCommon4: jasmine.SpyObj<TmCommonService>;
//   let stCommonTransaction4: jasmine.SpyObj<StCommonTransactionService>;
//   let navigateOperationManager4: jasmine.SpyObj<TmdNavigateOperationService>;
//   let spinner4: jasmine.SpyObj<NgxSpinnerService>;
//   let signatureTrackingService4: jasmine.SpyObj<SignatureTrackingService>;

//   beforeEach(() => {
//     const transactionManagerCommonSpy = jasmine.createSpyObj('TmCommonService', [
//       'isSupportedTransaction',
//       'handleNavigateToEmbbededBanking',
//     ]);
//     const stCommonTransactionSpy = jasmine.createSpyObj('StCommonTransactionService', [
//       'getCurrentStep',
//       'modalFailedTransactions',
//       'buildTransactionDetailResponse',
//     ]);
//     const navigateOperationManagerSpy = jasmine.createSpyObj('TmdNavigateOperationService', ['goToOperationTransaction']);
//     const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
//     const signatureTrackingServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['send']);

//     TestBed.configureTestingModule({
//       providers: [
//         StSendService,
//         { provide: TmCommonService, useValue: transactionManagerCommonSpy },
//         { provide: StCommonTransactionService, useValue: stCommonTransactionSpy },
//         { provide: TmdNavigateOperationService, useValue: navigateOperationManagerSpy },
//         { provide: NgxSpinnerService, useValue: spinnerSpy },
//         { provide: SignatureTrackingService, useValue: signatureTrackingServiceSpy },
//       ],
//       imports: [HttpClientTestingModule],
//     });

//     transactionManagerCommon4 = TestBed.inject(TmCommonService) as jasmine.SpyObj<TmCommonService>;
//     stCommonTransaction4 = TestBed.inject(StCommonTransactionService) as jasmine.SpyObj<StCommonTransactionService>;
//     navigateOperationManager4 = TestBed.inject(TmdNavigateOperationService) as jasmine.SpyObj<TmdNavigateOperationService>;
//     spinner4 = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
//     signatureTrackingService4 = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;

//     service = TestBed.inject(StSendService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should get loadingTransaction, currentMessage and messageAlert ', () => {
//     expect(service.loadingTransaction).toBeTruthy();
//     expect(service.currentMessage).toBeNull();
//     expect(service.messageAlert).toBeDefined();
//   });

//   it('should send function be functionality', () => {
//     service.send(iSTOperationStartupParameters);
//     expect(transactionManagerCommon4.isSupportedTransaction).toHaveBeenCalled();
//     expect(transactionManagerCommon4.handleNavigateToEmbbededBanking).toHaveBeenCalled();
//   });

//   it('should reject function is functionality when isSupportedTransaction = true', () => {
//     transactionManagerCommon4.isSupportedTransaction.and.returnValue(true);
//     service.send(iSTOperationStartupParameters);
//     expect(navigateOperationManager4.goToOperationTransaction).toHaveBeenCalled();
//   });

//   it('should reject function is functionality when null', () => {
//     transactionManagerCommon4.isSupportedTransaction.and.returnValue(true);
//     service.send(iSTOperationStartupParametersNull);
//     expect(service.send).toBeTruthy();
//   });

//   it('should send function varios', () => {
//     expect(service.send).toBeTruthy();
//   });
// });
