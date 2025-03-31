// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Router, ActivatedRoute } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Location } from '@angular/common';
// import { of, throwError } from 'rxjs';
// import { TranslateModule } from '@ngx-translate/core';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// import { AchUniConfirmationComponent } from './ach-uni-confirmation.component';
// import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
// import { UtilService } from 'src/app/service/common/util.service';
// import { TransferACHService } from '../../../transfer-ach/services/transaction/transfer-ach.service';
// import { TAchUniTransferManagerService } from '../../services/definition/transaction/t-ach-uni-transfer-manager.service';
// import { AtdUtilService } from '../../../transfer-ach/services/atd-util.service';
// import { StBuildUpdateBodyRequestService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
// import { HandleTokenRequestService } from 'src/app/service/common/handle-token-request.service';
// import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
// import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
// import { StBtProcessManagerService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/utils/st-bt-utils.service';
// import { SignatureTrackingService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';

// class MockParameterManagementService {
//   getParameter = jasmine.createSpy('getParameter').and.returnValue({
//     accountDebited: {},
//     bank: {},
//     accountDestination: {},
//     purpose: {},
//     formValues: {}
//   });
//   sendParameters = jasmine.createSpy('sendParameters');
// }

// class MockUtilService {
//   hideLoader = jasmine.createSpy('hideLoader');
//   scrollToTop = jasmine.createSpy('scrollToTop');
//   getProfile = jasmine.createSpy('getProfile').and.returnValue('byte-theme');
//   showLoader = jasmine.createSpy('showLoader');
//   getTokenType = jasmine.createSpy('getTokenType').and.returnValue('TOKEN_TYPE');
// }

// class MockHandleTokenRequestService {
//   isTokenRequired = jasmine.createSpy('isTokenRequired').and.returnValue(true);
// }

// fdescribe('AchUniConfirmationComponent', () => {
//   let component: AchUniConfirmationComponent;
//   let fixture: ComponentFixture<AchUniConfirmationComponent>;
//   let mockRouter = { navigate: jasmine.createSpy('navigate') };
//   let mockLocation = { back: jasmine.createSpy('back') };
//   let mockModalService = { open: jasmine.createSpy('open').and.returnValue({ componentInstance: {}, result: Promise.resolve({}) }) };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [AchUniConfirmationComponent],
//       providers: [
//         { provide: UtilService, useClass: MockUtilService },
//         { provide: Router, useValue: mockRouter },
//         { provide: Location, useValue: mockLocation },
//         { provide: ParameterManagementService, useClass: MockParameterManagementService },
//         { provide: TransferACHService, useValue: {} },
//         { provide: TAchUniTransferManagerService, useValue: {} },
//         { provide: AtdUtilService, useValue: {} },
//         { provide: StBuildUpdateBodyRequestService, useValue: {} },
//         { provide: HandleTokenRequestService, useClass: MockHandleTokenRequestService },
//         { provide: UtilTransactionService, useValue: {} },
//         { provide: FindServiceCodeService, useValue: {} },
//         { provide: StBtProcessManagerService, useValue: {} },
//         { provide: SignatureTrackingService, useValue: {} },
//         { provide: NgbModal, useValue: mockModalService },
//         { provide: ActivatedRoute, useValue: { snapshot: { data: { view: 'CONFIRMATION' } } } }
//       ],
//       imports: [TranslateModule.forRoot()],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AchUniConfirmationComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize with default values', () => {
//     expect(component.view).toBe('CONFIRMATION');
//     expect(component.accountSelectedDebited).toBeDefined();
//     expect(component.bankSelected).toBeDefined();
//     expect(component.accountSelectedDestination).toBeDefined();
//     expect(component.purposeSelected).toBeDefined();
//     expect(component.formValues).toBeDefined();
//     expect(component.typeAlert).toBeUndefined();
//     expect(component.messageAlert).toBeUndefined();
//   });

//   it('should get custom show class', () => {
//     component.typeAlert = 'info';
//     component.messageAlert = 'Test message';
//     expect(component.customShow).toBe('custom_show');
//   });

//   it('should check if token is required', () => {
//     expect(component.isTokenRequired).toBe(true);
//   });

//   it('should initialize state and hide loader on init', () => {
//     expect(component.persistStepStateService.getParameter).toHaveBeenCalledWith('navigateStateParameters');
//     expect(component.util.hideLoader).toHaveBeenCalled();
//   });

//   // it('should handle back navigation for DEFAULT view mode', () => {
//   //   component.view = 'DEFAULT';
//   //   component.lastStep();
//   //   expect(component.persistStepStateService.sendParameters).toHaveBeenCalledWith({
//   //     navigationProtectedParameter: 'TRANSFER_FORM',
//   //   });
//   //   expect(mockLocation.back).toHaveBeenCalled();
//   // });

//   it('should handle back navigation for SIGNATURE_TRACKING_UPDATE view mode', () => {
//     component.view = 'SIGNATURE_TRACKING_UPDATE';
//     component.lastStep();
//     expect(component.persistStepStateService.sendParameters).toHaveBeenCalledWith({
//       navigationProtectedParameter: 'TRANSFER_FORM_UPDATE_MODE',
//     });
//     expect(mockLocation.back).toHaveBeenCalled();
//   });

//   it('should show alert', () => {
//     component.showAlert('info', 'Test message');
//     expect(component.typeAlert).toBe('info');
//     expect(component.messageAlert).toBe('Test message');
//   });

//   // it('should build confirmation voucher', () => {
//   //   spyOn(component['transactionDefinitionManager'], 'buildVoucherConfirmation').and.returnValue({});
//   //   component.buildConfirmationVoucher('title', 'subtitle');
//   //   expect(component['transactionDefinitionManager'].buildVoucherConfirmation).toHaveBeenCalled();
//   //   expect(component.voucherConfirmation).toBeDefined();
//   // });

//   // it('should execute transaction and open token modal', () => {
//   //   spyOn(component, 'openTokenModal').and.callThrough();
//   //   component.handleExecuteTransaction();
//   //   expect(component.openTokenModal).toHaveBeenCalled();
//   // });

//   it('should open token modal', async () => {
//     spyOn(component, 'handleResponseTransaction');
//     component.openTokenModal();
//     const modalRef = mockModalService.open.calls.mostRecent().returnValue;
//     await modalRef.result;
//     expect(mockModalService.open).toHaveBeenCalled();
//     expect(component.handleResponseTransaction).toHaveBeenCalled();
//   });

//   // it('should handle execute transaction', () => {
//   //   spyOn(component, 'executeTransaction').and.returnValue(of({}));
//   //   spyOn(component, 'handleResponseTransaction');
//   //   component.executeTransaction('token').subscribe(response => {
//   //     expect(response).toEqual({});
//   //   });
//   // });

//   it('should handle response transaction', () => {
//     spyOn(component, 'scrollToTop');
//     component.handleResponseTransaction({ status: 200 } as any);
//     expect(component.scrollToTop).toHaveBeenCalled();
//   });

//   it('should scroll to top', () => {
//     component.scrollToTop();
//     expect(component.util.scrollToTop).toHaveBeenCalled();
//   });
// });
