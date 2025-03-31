// import { TestBed } from '@angular/core/testing';
// import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { StCommonTransactionService } from './st-common-transaction.service';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// import { iSignatureAccountMock, tableStructuredMockArray } from '../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction';
// import { MockNgbModalBuilder } from '../../../../../loan/modules/b2b-request/data/mock/b2b-request/modal.mock';
// import { EMPTY, Observable, of } from 'rxjs';
// import { UtilService } from 'src/app/service/common/util.service';

// describe('StCommonTransactionService', () => {
//   let service: StCommonTransactionService;
//   let modalService: jasmine.SpyObj<NgbModal>;
//   let utils: jasmine.SpyObj<UtilService>;

//   beforeEach(() => {
//     const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
//     const utilsSpy = jasmine.createSpyObj('UtilService', ['scrollToTop']);

//     TestBed.configureTestingModule({
//       declarations: [],
//       providers: [
//         { provide: NgbModal, useValue: modalServiceSpy },
//         { provide: UtilService, useValue: utilsSpy },
//       ],
//       imports: [
//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useClass: TranslateFakeLoader,
//           },
//         }),
//       ],
//     });

//     service = TestBed.inject(StCommonTransactionService);
//     modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
//     utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should get Transaction Status', () => {
//     const rta = service.getTransactionStatus(2);
//     expect(rta).toEqual('A');
//     const rta2 = service.getTransactionStatus(1);
//     expect(rta2).toEqual('F');
//     const rta3 = service.getTransactionStatus(0);
//     expect(rta3).toEqual('I');
//   });

//   it('should get Current Tab Position From Embbeded', () => {
//     const rta = service.getCurrentTabPositionFromEmbbeded('ADMITTED');
//     expect(rta).toEqual(0);
//     const rta2 = service.getCurrentTabPositionFromEmbbeded('TO_AUTHORIZE');
//     expect(rta2).toEqual(1);
//     const rta3 = service.getCurrentTabPositionFromEmbbeded('AUTHORIZED');
//     expect(rta3).toEqual(2);
//   });

//   it('should get Current Step', () => {
//     const rta = service.getCurrentStep(0);
//     expect(rta).toEqual('ADMITTED');
//     const rta2 = service.getCurrentStep(1);
//     expect(rta2).toEqual('TO_AUTHORIZE');
//     const rta3 = service.getCurrentStep(2);
//     expect(rta3).toEqual('AUTHORIZED');
//   });

//   it('should build Transaction Detail Response To Authorize', () => {
//     const rta = service.buildTransactionDetailResponseToAuthorize(iSignatureAccountMock[0]);

//     expect(rta.amount.length).toEqual(6);
//     expect(rta).toBeTruthy();
//     expect(rta.currency.length).toEqual(6);
//   });

//   it('should build Transaction Detail Response', () => {
//     const rta = service.buildTransactionDetailResponse(iSignatureAccountMock[0]);

//     expect(rta).toBeTruthy();
//     expect(rta.status).toEqual('success');
//   });

//   it('should modal Failed Transactions', () => {
//     const modalFaked = new MockNgbModalBuilder().result(Promise.resolve(true)).dismissed(new Observable()).componentInstance(EMPTY).build();
//     modalService.open.and.returnValue(modalFaked as NgbModalRef);
//     service.modalFailedTransactions(tableStructuredMockArray);
//     expect(modalService.open).toHaveBeenCalled();
// });
// });
