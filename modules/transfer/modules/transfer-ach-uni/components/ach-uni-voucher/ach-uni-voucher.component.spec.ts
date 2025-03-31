// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ActivatedRoute } from '@angular/router';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { of } from 'rxjs';
// import { AchUniVoucherComponent } from './ach-uni-voucher.component';
// import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
// import { TransfersPrintService } from 'src/app/modules/transfer/prints/transfers-print.service';
// import { UtilService } from 'src/app/service/common/util.service';
// import { EachUniTransferManagerService } from '../../services/execution/e-ach-uni-transfer-manager.service';
// import { AchUniTransactionViewMode } from '../../enums/AchUniTransactionViewMode.enum';
// import { IAccount } from 'src/app/models/account.inteface';
// import { IPrint } from 'src/app/modules/transfer/interface/print-data-interface';
// import { IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
// import { IAchUniMainLayoutResponse } from '../../interfaces/ach-uni-definition';

// fdescribe('AchUniVoucherComponent', () => {
//   let component: AchUniVoucherComponent;
//   let fixture: ComponentFixture<AchUniVoucherComponent>;
//   let mockModalService: jasmine.SpyObj<NgbModal>;
//   let mockPersistStepStateService: jasmine.SpyObj<ParameterManagementService>;
//   let mockPdfService: jasmine.SpyObj<TransfersPrintService>;
//   let mockTransactionExecuteManagerDefinition: jasmine.SpyObj<EachUniTransferManagerService>;
//   let mockTranslateService: jasmine.SpyObj<TranslateService>;
//   let mockUtilService: jasmine.SpyObj<UtilService>;

//   beforeEach(async () => {
//     mockModalService = jasmine.createSpyObj('NgbModal', ['open']);
//     const mockModalRef = {
//       componentInstance: { data: null },
//       result: Promise.resolve(true),
//     } as NgbModalRef;
//     mockModalService.open.and.returnValue(mockModalRef);

//     mockPersistStepStateService = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
//     mockPersistStepStateService.getParameter.and.returnValue({
//       accountDebited: { account: '12345' } as IAccount,
//       accountDestination: { account: '67890' } as IAccount,
//       bank: { code: '001', description: 'Bank 1' },
//       purpose: { code: '002', description: 'Purpose 1' },
//       formValues: { originAccount: '12345', amount: '100', bank: '001', destinationAccount: '67890', purpose: '002', comment: 'Test', commission: '10' },
//       transactionResponse: { dateTime: '2023-01-01T12:00:00', referenceNumber: 'ABC123' },
//       typeTransaction: 'DEFAULT',
//       position: 1
//     });

//     mockPdfService = jasmine.createSpyObj('TransfersPrintService', ['pdfGenerate']);

//     mockTransactionExecuteManagerDefinition = jasmine.createSpyObj('EachUniTransferManagerService', ['buildVoucherScreen']);
//     mockTransactionExecuteManagerDefinition.buildVoucherScreen.and.returnValue({
//       pdfLayout: {
//         account: '12345',
//         items: [],
//         fileName: 'test.pdf',
//         title: 'Test Title',
//         reference: 'ABC123'
//       } as IPrint,
//       voucherLayout: {} as IDataReading,
//       voucherModalLayout: { } as IConfirmationModal,

//       headBandLayout: [] as IHeadBandAttribute[]
//     });

//     mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant', 'get']);
//     mockTranslateService.instant.and.callFake((key: string) => key);
//     mockTranslateService.get.and.callFake((key: string) => of(key));

//     mockUtilService = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader', 'getProfile']);

//     await TestBed.configureTestingModule({
//       declarations: [AchUniVoucherComponent],
//       imports: [
//         RouterTestingModule,
//         TranslateModule.forRoot()
//       ],
//       providers: [
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             snapshot: {
//               data: {
//                 view: AchUniTransactionViewMode.VOUCHER,
//                 associatedAccounts: [
//                   { account: '12345', alias: 'My Account' }
//                 ]
//               }
//             }
//           }
//         },
//         { provide: NgbModal, useValue: mockModalService },
//         { provide: ParameterManagementService, useValue: mockPersistStepStateService },
//         { provide: TransfersPrintService, useValue: mockPdfService },
//         { provide: EachUniTransferManagerService, useValue: mockTransactionExecuteManagerDefinition },
//         { provide: TranslateService, useValue: mockTranslateService },
//         { provide: UtilService, useValue: mockUtilService }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(AchUniVoucherComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize with data from route', () => {
//     component.ngOnInit();
//     expect(component.view).toBe(AchUniTransactionViewMode.VOUCHER);
//     expect(component.associatedAccounts.length).toBe(1);
//   });

//   it('should initialize definitions correctly', () => {
//     component.initDefinition();
//     expect(mockPersistStepStateService.getParameter).toHaveBeenCalledWith('navigateStateParameters');
//     expect(component.accountSelectedDebited?.account).toBe('12345');
//     expect(component.accountSelectedDestination.account).toBe('67890');
//   });

//   it('should build voucher correctly', () => {
//     component.voucherDefinitionForDefaultTransaction();
//     expect(mockTransactionExecuteManagerDefinition.buildVoucherScreen).toHaveBeenCalled();
//     expect(component.voucherLayout).toBeTruthy();
//     expect(component.voucherModalLayout).toBeTruthy();
//     expect(component.pdfLayout).toBeTruthy();
//     expect(component.headbandLayout.length).toBe(0);
//   });

//   it('should show alert', () => {
//     component.showAlert('success', 'success message');
//     expect(component.typeAlert).toBe('success');
//     expect(component.messageAlert).toBe('success message');
//   });

//   it('should hide alert', () => {
//     component.hiddenAlert();
//     expect(component.typeAlert).toBeUndefined();
//     expect(component.messageAlert).toBeUndefined();
//   });

//   it('should open modal and export file on confirm', async () => {
//     await component.openProofACHTransactionModal();
//     expect(mockModalService.open).toHaveBeenCalled();
//     expect(mockPdfService.pdfGenerate).toHaveBeenCalled();
//   });

//   it('should navigate back to home', () => {
//     component.back();
//     expect(mockUtilService.showLoader).toHaveBeenCalled();
//   });

//   it('should export file', () => {
//     component.exportFile();
//     expect(mockPdfService.pdfGenerate).toHaveBeenCalled();
//   });

//   it('should reset storage', () => {
//     component.resetStorage();
//     expect(mockPersistStepStateService.sendParameters).toHaveBeenCalledWith({
//       achParametersForm: null,
//       navigationProtectedParameter: undefined,
//       navigateStateParameters: null
//     });
//   });
// });
