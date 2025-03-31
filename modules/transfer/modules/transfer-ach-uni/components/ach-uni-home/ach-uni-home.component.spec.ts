// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { of } from 'rxjs';
// import { TranslateModule } from '@ngx-translate/core';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// import { AchUniHomeComponent } from './ach-uni-home.component';
// import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
// import { UtilService } from 'src/app/service/common/util.service';
// import { AchUniTransferService } from '../../services/transaction/ach-uni-transfer.service';
// import { AchUniTermsConditionsModalComponent } from '../ach-uni-terms-conditions-modal/ach-uni-terms-conditions-modal.component';
// import { AchUniStatusTermsResponse } from '../../interfaces/ach-uni-status-terms-response';

// class MockParameterManagementService {
//   sendParameters = jasmine.createSpy('sendParameters');
//   getParameter = jasmine.createSpy('getParameter').and.returnValue({ customerCode: '12345' });
// }

// class MockUtilService {
//   hideLoader = jasmine.createSpy('hideLoader');
// }

// class MockAchUniTransferService {
//   getStatusTermsConditions = jasmine.createSpy('getStatusTermsConditions').and.returnValue(of({ result: 'S' } as AchUniStatusTermsResponse));
// }

// fdescribe('AchUniHomeComponent', () => {
//   let component: AchUniHomeComponent;
//   let fixture: ComponentFixture<AchUniHomeComponent>;
//   let mockRouter = { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) };
//   let mockModalService = { open: jasmine.createSpy('open').and.returnValue({ result: Promise.resolve(true) }) };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [AchUniHomeComponent],
//       providers: [
//         { provide: UtilService, useClass: MockUtilService },
//         { provide: Router, useValue: mockRouter },
//         { provide: ParameterManagementService, useClass: MockParameterManagementService },
//         { provide: AchUniTransferService, useClass: MockAchUniTransferService },
//         { provide: NgbModal, useValue: mockModalService }
//       ],
//       imports: [TranslateModule.forRoot()],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AchUniHomeComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   // it('should handle Transfer365Movil click', () => {
//   //   component.handleTransferClick('Transfer365Movil');
//   //   expect(mockRouter.navigate).toHaveBeenCalledWith(['/transfer/ach-uni/transaction']);
//   // });

//   it('should handle UNI click with accepted terms', async () => {
//     component.handleTransferClick('UNI');
//     await fixture.whenStable();
//     expect(component.persistStepStateService.sendParameters).toHaveBeenCalledWith({
//       navigateStateParameters: null,
//       navigationProtectedParameter: 'ach_uni_transfer_transaction',
//     });
//     expect(mockRouter.navigate).toHaveBeenCalledWith(['/transfer/ach-uni/transaction']);
//   });

//   it('should handle UNI click with non-accepted terms', async () => {
//     component.achUniTransferService.getStatusTermsConditions = jasmine.createSpy('getStatusTermsConditions').and.returnValue(of({ result: 'F' } as AchUniStatusTermsResponse));
//     component.handleTransferClick('UNI');
//     await fixture.whenStable();
//     expect(mockModalService.open).toHaveBeenCalledWith(AchUniTermsConditionsModalComponent, { centered: true, windowClass: `custom-modal ${component.theme}`, size: 'lg' });
//   });

//   it('should get client code', () => {
//     const code = component.getClientCode();
//     expect(code).toBe('12345');
//   });

//   it('should log unknown value', () => {
//     spyOn(console, 'error');
//     component.handleTransferClick('Unknown');
//     expect(console.error).toHaveBeenCalledWith('Valor desconocido:', 'Unknown');
//   });

// });
