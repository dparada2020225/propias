import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AchUniTermsConditionsModalComponent } from './ach-uni-terms-conditions-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckProfileService } from 'src/app/service/general/check-profile.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AchUniTransferProtectedNavigation } from '../../enums/ach-uni-navigation-parameter.enum';

fdescribe('AchUniTermsConditionsModalComponent', () => {
  let component: AchUniTermsConditionsModalComponent;
  let fixture: ComponentFixture<AchUniTermsConditionsModalComponent>;
  let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;
  let mockSpinner: jasmine.SpyObj<NgxSpinnerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCheckProfileService: jasmine.SpyObj<CheckProfileService>;
  let mockParameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let mockSecurityOptionService: jasmine.SpyObj<SecurityOptionService>;
  let mockStyleManagement: jasmine.SpyObj<StyleManagementService>;
  let mockUtilService: jasmine.SpyObj<UtilService>;

  beforeEach(async () => {
    mockActiveModal = jasmine.createSpyObj('NgbActiveModal', ['close']);
    mockSpinner = jasmine.createSpyObj('NgxSpinnerService', ['hide']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockCheckProfileService = jasmine.createSpyObj('CheckProfileService', ['postponeRegisterProfile']);
    mockParameterManagement = jasmine.createSpyObj('ParameterManagementService', ['sendParameters']);
    mockSecurityOptionService = jasmine.createSpyObj('SecurityOptionService', ['getProfile'], { getProfile: {} });
    mockStyleManagement = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication']);
    mockUtilService = jasmine.createSpyObj('UtilService', ['hideLoader']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [AchUniTermsConditionsModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: mockActiveModal },
        { provide: NgxSpinnerService, useValue: mockSpinner },
        { provide: Router, useValue: mockRouter },
        { provide: CheckProfileService, useValue: mockCheckProfileService },
        { provide: ParameterManagementService, useValue: mockParameterManagement },
        { provide: SecurityOptionService, useValue: mockSecurityOptionService },
        { provide: StyleManagementService, useValue: mockStyleManagement },
        { provide: UtilService, useValue: mockUtilService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchUniTermsConditionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set descriptionError if profile.error exists', () => {
    Object.defineProperty(mockSecurityOptionService, 'getProfile', { value: { error: { message: 'Error message' } } });
    component.ngOnInit();
    expect(component.descriptionError).toBe('Error message');
  });

  it('should set descriptionError if profile.error.error exists', () => {
    Object.defineProperty(mockSecurityOptionService, 'getProfile', { value: { error: { error: 'Detailed error' } } });
    component.ngOnInit();
    expect(component.descriptionError).toBe('Detailed error');
  });

  it('should handle skip(1) correctly', () => {
    component.skip(1);
    expect(mockActiveModal.close).toHaveBeenCalledWith('Close click');
  });

  it('should handle skip(2) correctly', (done) => {
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    component.skip(2);
    expect(mockSpinner.hide).toHaveBeenCalledWith('main-spinner');
    expect(mockActiveModal.close).toHaveBeenCalledWith('Close click');
    expect(mockParameterManagement.sendParameters).toHaveBeenCalledWith({
      navigateStateParameters: null,
      navigationProtectedParameter: AchUniTransferProtectedNavigation.TRANSACTION,
    });

    setTimeout(() => {
      expect(mockUtilService.hideLoader).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should handle skip(else) correctly', () => {
    component.skip(3);
    expect(mockSpinner.hide).toHaveBeenCalledWith('main-spinner');
  });

  it('should show alert with openAler', () => {
    component.openAler('error', 'Error message');
    expect(component.showAlert).toBeTrue();
    expect(component.typeAlert).toBe('error');
    expect(component.messageAlert).toBe('Error message');
  });

  it('should handle clickout event correctly', () => {
    const mockEvent = {
      target: document.createElement('div')
    };

    spyOn(component['eRef'].nativeElement, 'contains').and.returnValue(false);
    mockCheckProfileService.postponeRegisterProfile.and.returnValue(of({}));

    component.clickout(mockEvent);

    expect(mockCheckProfileService.postponeRegisterProfile).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalledWith('main-spinner');
  });

  it('should handle error in clickout event', () => {
    const mockEvent = {
      target: document.createElement('div')
    };

    spyOn(component['eRef'].nativeElement, 'contains').and.returnValue(false);
    mockCheckProfileService.postponeRegisterProfile.and.returnValue(throwError({ error: { message: 'Error' } }));

    component.clickout(mockEvent);

    expect(mockCheckProfileService.postponeRegisterProfile).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalledWith('main-spinner');
    expect(component.showAlert).toBeTrue();
    expect(component.typeAlert).toBe('error');
    expect(component.messageAlert).toBe('Error');
  });

  it('should handle error with missing message in clickout event', () => {
    const mockEvent = {
      target: document.createElement('div')
    };

    spyOn(component['eRef'].nativeElement, 'contains').and.returnValue(false);
    mockCheckProfileService.postponeRegisterProfile.and.returnValue(throwError({}));

    component.clickout(mockEvent);

    expect(mockCheckProfileService.postponeRegisterProfile).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalledWith('main-spinner');
    expect(component.showAlert).toBeTrue();
    expect(component.typeAlert).toBe('error');
    expect(component.messageAlert).toBeUndefined();
  });

  it('should close modal and navigate on responseRegisterProfile', () => {
    component.responseRegisterProfile();
    expect(mockActiveModal.close).toHaveBeenCalledWith('Close click');
    expect(mockParameterManagement.sendParameters).toHaveBeenCalledWith({ product: undefined });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/' + component.home]);
  });

  it('should return correct value for corporateImageApplication', () => {
    mockStyleManagement.corporateImageApplication.and.returnValue(true);
    expect(component.corporateImageApplication()).toBeTrue();
    expect(mockStyleManagement.corporateImageApplication).toHaveBeenCalled();
  });
});
