// import { TestBed } from '@angular/core/testing';
// import { TmCommonService } from '../../../../../services/tm-common.service';

// import { StAuthorizeService } from './st-authorize.service';
// import { StCommonTransactionService } from '../st-common-transaction.service';
// import { TmdNavigateOperationService } from '../../../../../services/tmd-navigate-operation.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
// import {
//   iSTProcessOperationStartupParameters,
//   iSTProcessOperationStartupParametersNull,
// } from '../../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction';

// describe('StAuthorizeService', () => {
//   let service: StAuthorizeService;

//   let transactionManagerCommon1: jasmine.SpyObj<TmCommonService>;
//   let stCommonTransaction1: jasmine.SpyObj<StCommonTransactionService>;
//   let navigateOperationManager1: jasmine.SpyObj<TmdNavigateOperationService>;
//   let spinner1: jasmine.SpyObj<NgxSpinnerService>;
//   let signatureTrackingService1: jasmine.SpyObj<SignatureTrackingService>;

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
//     const signatureTrackingServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['authorize']);

//     TestBed.configureTestingModule({
//       providers: [
//         StAuthorizeService,
//         { provide: TmCommonService, useValue: transactionManagerCommonSpy },
//         { provide: StCommonTransactionService, useValue: stCommonTransactionSpy },
//         { provide: TmdNavigateOperationService, useValue: navigateOperationManagerSpy },
//         { provide: NgxSpinnerService, useValue: spinnerSpy },
//         { provide: SignatureTrackingService, useValue: signatureTrackingServiceSpy },
//       ],
//       imports: [
//         HttpClientTestingModule,
//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useClass: TranslateFakeLoader,
//           },
//         }),
//       ],
//     });

//     transactionManagerCommon1 = TestBed.inject(TmCommonService) as jasmine.SpyObj<TmCommonService>;
//     stCommonTransaction1 = TestBed.inject(StCommonTransactionService) as jasmine.SpyObj<StCommonTransactionService>;
//     navigateOperationManager1 = TestBed.inject(TmdNavigateOperationService) as jasmine.SpyObj<TmdNavigateOperationService>;
//     spinner1 = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
//     signatureTrackingService1 = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;

//     service = TestBed.inject(StAuthorizeService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should get loading, currentMessage and message ', () => {
//     expect(service.loading).toBeTruthy();
//     expect(service.currentMessage).toBeNull();
//     expect(service.message).toBeDefined();
//   });

//   it('should reject function is functionality', () => {
//     service.authorize(iSTProcessOperationStartupParameters);
//     expect(transactionManagerCommon1.handleNavigateToEmbbededBanking).toHaveBeenCalled();
//   });

//   it('should reject function is functionality when isSupportedTransaction = true', () => {
//     transactionManagerCommon1.isSupportedTransaction.and.returnValue(true);
//     service.authorize(iSTProcessOperationStartupParameters);
//     expect(navigateOperationManager1.goToOperationTransaction).toHaveBeenCalled();
//   });

//   it('should reject function varios', () => {
//   });

//   it('should reject function', () => {
//     service.authorize(iSTProcessOperationStartupParametersNull);
//     expect(service.authorize).toBeTruthy();
//   });
// });
