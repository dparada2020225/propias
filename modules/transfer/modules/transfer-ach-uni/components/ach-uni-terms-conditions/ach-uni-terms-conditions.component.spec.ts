// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { AchUniTermsConditionsComponent } from './ach-uni-terms-conditions.component';
// import { AchUniTransferService } from '../../services/transaction/ach-uni-transfer.service';
// import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
// import { UtilService } from 'src/app/service/common/util.service';
// import { Router } from '@angular/router';
// import { of } from 'rxjs';
// import { TranslateModule } from '@ngx-translate/core';

// fdescribe('AchUniTermsConditionsComponent', () => {
//   let component: AchUniTermsConditionsComponent;
//   let fixture: ComponentFixture<AchUniTermsConditionsComponent>;
//   let mockTransferService: jasmine.SpyObj<AchUniTransferService>;
//   let mockStorage: jasmine.SpyObj<ParameterManagementService>;
//   let mockRouter: jasmine.SpyObj<Router>;
//   let mockUtilService: jasmine.SpyObj<UtilService>;

//   beforeEach(async () => {
//     const transferServiceSpy = jasmine.createSpyObj('AchUniTransferService', ['acceptTermsConditions']);
//     const storageSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
//     const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
//     const utilServiceSpy = jasmine.createSpyObj('UtilService', ['hideLoader']);

//     await TestBed.configureTestingModule({
//       declarations: [AchUniTermsConditionsComponent],
//       imports: [
//         TranslateModule.forRoot()
//       ],
//       providers: [
//         { provide: AchUniTransferService, useValue: transferServiceSpy },
//         { provide: ParameterManagementService, useValue: storageSpy },
//         { provide: Router, useValue: routerSpy },
//         { provide: UtilService, useValue: utilServiceSpy }
//       ]
//     }).compileComponents();

//     mockTransferService = TestBed.inject(AchUniTransferService) as jasmine.SpyObj<AchUniTransferService>;
//     mockStorage = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
//     mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//     mockUtilService = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

//     fixture = TestBed.createComponent(AchUniTermsConditionsComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should return client code from storage', () => {
//     mockStorage.getParameter.and.returnValue({ customerCode: '12345' });
//     expect(component.ClientCode).toBe('12345');
//     expect(mockStorage.getParameter).toHaveBeenCalledWith('userInfo');
//   });

//   it('should handle nextStep successfully', () => {
//     const response = { errorCode: '0', errorDescription: '', referenceNumber: '123' };
//     mockTransferService.acceptTermsConditions.and.returnValue(of(response));

//     component.nextStep();

//     expect(mockTransferService.acceptTermsConditions).toHaveBeenCalledWith('12345', 'UNI');
//     expect(mockStorage.sendParameters).toHaveBeenCalledWith({
//       navigateStateParameters: null,
//       navigationProtectedParameter: 'TRANSACTION'
//     });
//     expect(mockRouter.navigate).toHaveBeenCalledWith(['default-transaction']);
//     expect(mockUtilService.hideLoader).toHaveBeenCalled();
//   });

//   it('should handle nextStep with error', () => {
//     const response = { errorCode: '1', errorDescription: 'Error occurred', referenceNumber: '123'};
//     mockTransferService.acceptTermsConditions.and.returnValue(of(response));

//     component.nextStep();

//     expect(mockTransferService.acceptTermsConditions).toHaveBeenCalledWith('12345', 'UNI');
//     expect(component.typeAlert).toBe('error');
//     expect(component.messageAlert).toBe('Error occurred');
//   });

//   it('should handle lastStep', () => {
//     component.lastStep();

//     expect(mockStorage.sendParameters).toHaveBeenCalledWith({
//       navigateStateParameters: null,
//       navigationProtectedParameter: null
//     });
//     expect(mockRouter.navigate).toHaveBeenCalledWith(['home']);
//     expect(mockUtilService.hideLoader).toHaveBeenCalled();
//   });

//   it('should show alert', () => {
//     component.showAlert('success', 'Operation successful');

//     expect(component.typeAlert).toBe('success');
//     expect(component.messageAlert).toBe('Operation successful');
//   });
// });
