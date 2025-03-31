// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { of } from 'rxjs';

// import { AchUniTransactionComponent } from './ach-uni-transaction.component';
// import { UtilService } from 'src/app/service/common/util.service';
// import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
// import { EachUniTransferManagerService } from '../../services/execution/e-ach-uni-transfer-manager.service';
// import { AchUniAttributeForm } from '../../enums/ach-uni-attribute-form.enum';
// import { AchUniTransferUrlNavigationCollection } from '../../enums/ach-uni-navigation-parameter.enum';

// class MockUtilService {
//   hideLoader = jasmine.createSpy('hideLoader');
//   showLoader = jasmine.createSpy('showLoader');
//   removeLayoutSelect = jasmine.createSpy('removeLayoutSelect');
// }

// class MockParameterManagementService {
//   sendParameters = jasmine.createSpy('sendParameters');
//   getParameter = jasmine.createSpy('getParameter').and.returnValue({ customerCode: '12345' });
// }

// class MockEachUniTransferManagerService {
//   buildFormScreenBuilder = jasmine.createSpy('buildFormScreenBuilder').and.returnValue({
//     transferFormLayout: {},
//     transferForm: new FormBuilder().group({
//       [AchUniAttributeForm.SOURCE_ACCOUNT]: [''],
//       [AchUniAttributeForm.AMOUNT]: [''],
//       [AchUniAttributeForm.BANK]: [''],
//       [AchUniAttributeForm.DESTINATION_ACCOUNT]: [''],
//       [AchUniAttributeForm.PURPOSE]: ['']
//     }),
//     optionList: [],
//     error: null
//   });

//   handleChangeDestinationAccount = jasmine.createSpy('handleChangeDestinationAccount').and.returnValue({
//     accountDestionation: {},
//     transferFormLayout: {}
//   });

//   handleChangeBank = jasmine.createSpy('handleChangeBank').and.returnValue({
//     bank: {},
//     transferFormLayout: {}
//   });

//   handleChangeDebitedAccount = jasmine.createSpy('handleChangeDebitedAccount').and.returnValue({
//     accountDebited: {},
//     transferFormLayout: {}
//   });
// }

// // fdescribe('AchUniTransactionComponent', () => {
// //   let component: AchUniTransactionComponent;
// //   let fixture: ComponentFixture<AchUniTransactionComponent>;
// //   let mockRouter = { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) };
// //   let mockActivatedRoute = {
// //     snapshot: {
// //       data: {
// //         view: 'transaction',
// //         sourceAccountList: [],
// //         targetAccountList: [],
// //         getBankList: [],
// //         getPurposeList: [],
// //         getCommissionCalculation: { commissionValue: 10 }
// //       }
// //     }
// //   };

// //   beforeEach(async () => {
// //     await TestBed.configureTestingModule({
// //       declarations: [AchUniTransactionComponent],
// //       providers: [
// //         { provide: UtilService, useClass: MockUtilService },
// //         { provide: Router, useValue: mockRouter },
// //         { provide: ActivatedRoute, useValue: mockActivatedRoute },
// //         { provide: ParameterManagementService, useClass: MockParameterManagementService },
// //         { provide: EachUniTransferManagerService, useClass: MockEachUniTransferManagerService }
// //       ],
// //       imports: [ReactiveFormsModule, TranslateModule.forRoot()],
// //       schemas: [CUSTOM_ELEMENTS_SCHEMA]
// //     }).compileComponents();
// //   });

// //   beforeEach(() => {
// //     fixture = TestBed.createComponent(AchUniTransactionComponent);
// //     component = fixture.componentInstance;
// //     fixture.detectChanges();
// //   });

// //   it('should create', () => {
// //     expect(component).toBeTruthy();
// //   });

// //   it('should initialize with default values', () => {
// //     expect(component.view).toBe('transaction');
// //     expect(component.utils.hideLoader).toHaveBeenCalled();
// //   });

// //   it('should initialize form on TRANSACTION view', () => {
// //     component.view = 'transaction';
// //     component.initDefinition();
// //     expect(component.transferForm).toBeDefined();
// //     expect(component.transferFormLayout).toBeDefined();
// //   });

// //   it('should handle account debited change', () => {
// //     const spy = spyOn(component, 'handleAccountDebitedChange');
// //     component.transferForm.get(AchUniAttributeForm.SOURCE_ACCOUNT)?.setValue('12345');
// //     expect(spy).toHaveBeenCalledWith('12345');
// //   });

// //   it('should handle amount change', () => {
// //     const spy = spyOn(component, 'changeForm');
// //     component.transferForm.get(AchUniAttributeForm.AMOUNT)?.setValue(1000);
// //     expect(spy).toHaveBeenCalled();
// //   });

// //   it('should handle bank change', () => {
// //     const spy = spyOn(component, 'handleBankChange');
// //     component.transferForm.get(AchUniAttributeForm.BANK)?.setValue('001');
// //     expect(spy).toHaveBeenCalledWith('001');
// //   });

// //   it('should handle destination account change', () => {
// //     const spy = spyOn(component, 'handleDestinationAccountChange');
// //     component.transferForm.get(AchUniAttributeForm.DESTINATION_ACCOUNT)?.setValue('67890');
// //     expect(spy).toHaveBeenCalledWith('67890');
// //   });

// //   it('should set custom option list', () => {
// //     const options = [{ name: 'Test', value: '001' }];
// //     component.setCustomOptionList(AchUniAttributeForm.PURPOSE, options);
// //     expect(component.purposeOptions).toEqual(options);
// //     expect(component.transferForm.get(AchUniAttributeForm.PURPOSE)?.value).toBe('');
// //   });

// //   it('should show alert', () => {
// //     component.showAlert('error', 'Test error');
// //     expect(component.typeAlert).toBe('error');
// //     expect(component.messageAlert).toBe('Test error');
// //   });

// //   it('should go to confirmation', () => {
// //     const spy = spyOn(component, 'goToConfirmation');
// //     component.view = 'transaction';
// //     component.nextStep();
// //     expect(spy).toHaveBeenCalled();
// //   });

// //   it('should not go to confirmation if form is invalid', () => {
// //     const spy = spyOn(component, 'goToConfirmation');
// //     component.transferForm.get(AchUniAttributeForm.SOURCE_ACCOUNT)?.setValidators(Validators.required);
// //     component.transferForm.get(AchUniAttributeForm.SOURCE_ACCOUNT)?.updateValueAndValidity();
// //     component.nextStep();
// //     expect(spy).not.toHaveBeenCalled();
// //     expect(component.transferForm.touched).toBeTrue();
// //   });

// //   // it('should navigate to home on last step', () => {
// //   //   component.lastStep();
// //   //   expect(mockRouter.navigate).toHaveBeenCalledWith([AchUniTransferUrlNavigationCollection.HOME]);
// //   //   expect(component.persistStepStateService.sendParameters).toHaveBeenCalledWith({
// //   //     navigationProtectedParameter: null,
// //   //     navigateStateParameters: null,
// //   //   });
// //   // });

// //   // it('should reset storage', () => {
// //   //   component.resetStorage();
// //   //   expect(component.persistStepStateService.sendParameters).toHaveBeenCalledWith({
// //   //     navigationProtectedParameter: null,
// //   //     navigateStateParameters: null,
// //   //   });
// //   // });

// //   it('should navigate to confirmation page', () => {
// //     component.goToConfirmation();
// //     expect(component.utils.showLoader).toHaveBeenCalled();
// //     expect(mockRouter.navigate).toHaveBeenCalledWith([AchUniTransferUrlNavigationCollection.DEFAULT_CONFIRMATION]);
// //     expect(component.utils.hideLoader).toHaveBeenCalled();
// //   });
// });
