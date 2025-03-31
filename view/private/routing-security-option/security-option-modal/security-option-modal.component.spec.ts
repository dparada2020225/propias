import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfButtonComponent} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {CheckProfileService} from 'src/app/service/general/check-profile.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {SecurityOptionService} from 'src/app/service/private/security-option/security-option.service';
import {ErrorMessageService} from 'src/app/service/shared/error-message.service';
import {clickElement, mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {SecurityOptionModalComponent} from './security-option-modal.component';

describe('SecurityOptionModalComponent', () => {
  let component: SecurityOptionModalComponent;
  let fixture: ComponentFixture<SecurityOptionModalComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let router: jasmine.SpyObj<Router>;
  let checkProfileService: jasmine.SpyObj<CheckProfileService>;
  let error: jasmine.SpyObj<ErrorMessageService>;
  let parameterManagemen: jasmine.SpyObj<ParameterManagementService>;

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const eRefSpy = jasmine.createSpyObj('ElementRef', ['nativeElement'])
    const checkProfileServiceSpy = jasmine.createSpyObj('CheckProfileService', ['postponeRegisterProfile'])
    const errorSpy = jasmine.createSpyObj('ErrorMessageService', ['getTranslateKey'])
    const parameterManagemenSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])
    const securityOptionServiceSpy = jasmine.createSpyObj('SecurityOptionService', ['getProfile'])
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication'])

    await TestBed.configureTestingModule({
      declarations: [SecurityOptionModalComponent, TranslatePipe, AdfButtonComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ElementRef, useValue: eRefSpy },
        { provide: CheckProfileService, useValue: checkProfileServiceSpy },
        { provide: ErrorMessageService, useValue: errorSpy },
        { provide: ParameterManagementService, useValue: parameterManagemenSpy },
        { provide: SecurityOptionService, useValue: securityOptionServiceSpy },
        { provide: StyleManagementService, useValue: styleManagementSpy },
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

    fixture = TestBed.createComponent(SecurityOptionModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    checkProfileService = TestBed.inject(CheckProfileService) as jasmine.SpyObj<CheckProfileService>;
    error = TestBed.inject(ErrorMessageService) as jasmine.SpyObj<ErrorMessageService>;
    parameterManagemen = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should skip', () => {
    router.navigate.and.returnValue(mockPromise(true))
    checkProfileService.postponeRegisterProfile.and.returnValue(mockObservable({ data: true }))
    clickElement(fixture, 'button.close');
    fixture.detectChanges();
    expect(checkProfileService.postponeRegisterProfile).toHaveBeenCalled()
    expect(activeModal.close).toHaveBeenCalledWith('Close click')
    expect(parameterManagemen.sendParameters).toHaveBeenCalledWith({ product: undefined })
    expect(router.navigate).toHaveBeenCalledWith(['/' + component.home])
  })

  xit('should skip with error http', () => {
    error.getTranslateKey.and.returnValue('error http')
    checkProfileService.postponeRegisterProfile.and.returnValue(mockObservableError({ error: true }))
    expect(component.showAlert).toBeFalsy();
    clickElement(fixture, 'button.close');
    fixture.detectChanges();
    expect(checkProfileService.postponeRegisterProfile).toHaveBeenCalled();
    expect(component.showAlert).toBeTruthy();
    expect(component.typeAlert).toEqual('error')
    expect(component.messageAlert).toEqual('error http')
  })

  it('should skip with skip2', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.skip(2)
    fixture.detectChanges();
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
    expect(activeModal.close).toHaveBeenCalledWith('Close click')
    expect(router.navigate).toHaveBeenCalledWith(['/security-option'])
  })

  it('should skip with skip3', () => {
    component.skip(3)
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
  })

  it('should postpone register profile if event target is not within component element', () => {
    checkProfileService.postponeRegisterProfile.and.returnValue(mockObservable({}));
    spyOn(component, 'responseRegisterProfile');

    const event = { target: document.createElement('div') };
    component.clickout(event);

    expect(checkProfileService.postponeRegisterProfile).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
    expect(component.responseRegisterProfile).toHaveBeenCalled();
  });

  it('should postpone register profile have error if event target is not within component element', () => {
    checkProfileService.postponeRegisterProfile.and.returnValue(mockObservableError({}));
    spyOn(component, 'responseRegisterProfile');
    spyOn(component, 'openAler');

    const event = { target: document.createElement('div') };
    component.clickout(event);

    expect(checkProfileService.postponeRegisterProfile).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
    expect(component.responseRegisterProfile).not.toHaveBeenCalled();
    expect(component.openAler).toHaveBeenCalled();
  });

});
