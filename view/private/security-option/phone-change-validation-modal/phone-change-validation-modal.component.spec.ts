import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfButtonComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { clickElement, mockObservable, mockObservableError } from 'src/assets/testing';
import { PhoneChangeValidationModalComponent } from './phone-change-validation-modal.component';

describe('PhoneChangeValidationModalComponent', () => {
  let component: PhoneChangeValidationModalComponent;
  let fixture: ComponentFixture<PhoneChangeValidationModalComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let securityOptionService: jasmine.SpyObj<SecurityOptionService>;

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss'])
    const securityOptionServiceSpy = jasmine.createSpyObj('SecurityOptionService', ['getPhone', 'validateAffiliation'])

    await TestBed.configureTestingModule({
      declarations: [PhoneChangeValidationModalComponent, TranslatePipe, AdfButtonComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: SecurityOptionService, useValue: securityOptionServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PhoneChangeValidationModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    securityOptionService = TestBed.inject(SecurityOptionService) as jasmine.SpyObj<SecurityOptionService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send Code', () => {
    spyOn(component, 'handleValidateAffiliation')
    component.phoneChangeForm.patchValue({
      code: '1234567890'
    })
    component.showConfirmation = false;
    clickElement(fixture, 'adf-button')
    fixture.detectChanges();
    expect(component.loading).toBeTruthy();
    expect(component.handleValidateAffiliation).toHaveBeenCalled();
  })

  it('should send Code but form is not valid', () => {
    component.showConfirmation = false;
    clickElement(fixture, 'adf-button')
    fixture.detectChanges();
    expect(component.loading).toBeFalsy()
    expect(component.phoneChangeForm.markAllAsTouched).toBeTruthy();
  })

  it('should send Code have error', () => {
    component.showConfirmation = true;
    clickElement(fixture, 'adf-button')
    fixture.detectChanges();
    expect(activeModal.close).toHaveBeenCalled();
  })

  it('should handle Validate Affiliation', () => {
    securityOptionService.validateAffiliation.and.returnValue(mockObservable({}))
    component.handleValidateAffiliation();
    expect(securityOptionService.validateAffiliation).toHaveBeenCalled();
    expect(component.loading).toBeFalsy();
    expect(component.showConfirmation).toBeTruthy();
    expect(component.responseCode).toEqual('0')
  })

  it('should handle Validate Affiliation with error http', () => {
    securityOptionService.validateAffiliation.and.returnValue(mockObservableError({ error: { code: '500', message: 'error http' } }))
    component.handleValidateAffiliation();
    expect(securityOptionService.validateAffiliation).toHaveBeenCalled();
    expect(component.loading).toBeFalsy();
    expect(component.showConfirmation).toBeTruthy();
    expect(component.responseCode).toEqual('500')
    expect(component.errorMessage).toEqual('error http')
  })

  it('should set Alert', () => {
    component.setAlert('alert', 'alert test');
    expect(component.showAlert).toBeTruthy();
    expect(component.typeAlert).toEqual('alert')
    expect(component.errorMessage).toEqual('alert test')
  })

});
