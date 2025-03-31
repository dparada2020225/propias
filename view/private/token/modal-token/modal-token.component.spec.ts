import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfButtonComponent, AdfComponentsModule, AdfInputComponent} from '@adf/components';
import {StorageService} from '@adf/security';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpStatusCode} from 'src/app/enums/http-status-code.enum';
import {UtilService} from 'src/app/service/common/util.service';
import {TokenService} from 'src/app/service/private/token/token.service';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockObservable, mockObservableError} from 'src/assets/testing';
import {ModalTokenComponent} from './modal-token.component';

describe('ModalTokenComponent', () => {
  let component: ModalTokenComponent;
  let fixture: ComponentFixture<ModalTokenComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let utils: jasmine.SpyObj<UtilService>;
  let formBuilder: FormBuilder;


  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close'])
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getTokenValidate', 'tokenGenerate'])
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'addItem'])
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['addItem', 'getItem'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showPulseLoader', 'hidePulseLoader', 'getTokenType', 'hideLoader'])

    await TestBed.configureTestingModule({
      declarations: [ModalTokenComponent, MockTranslatePipe, AdfInputComponent, AdfButtonComponent],
      providers: [
        {provide: NgbActiveModal, useValue: activeModalSpy},
        {provide: TokenService, useValue: tokenServiceSpy},
        {provide: StorageService, useValue: storageSpy},
        {provide: StorageService, useValue: storageServiceSpy},
        {provide: UtilService, useValue: utilsSpy},
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        FormsModule,
        ReactiveFormsModule,
        AdfComponentsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalTokenComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    formBuilder = TestBed.inject(FormBuilder);

    const formGroup: FormGroup = formBuilder.group({
      token: [''],
    });

    component.tokenModalTransfer = formGroup;

    spyOn(component, 'formValidator')

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    clickElement(fixture, 'close', true);
    fixture.detectChanges();
    expect(activeModal.close).toHaveBeenCalled();
  })

  it('should send token', () => {
    tokenService.getTokenValidate.and.returnValue(mockObservable({}))
    clickElement(fixture, 'send', true);
    fixture.detectChanges();
    expect(storageService.addItem).toHaveBeenCalledWith("ne", component.tokenValue)
    expect(activeModal.close).toHaveBeenCalled();
  })

  it('should send token but have errors', () => {
    tokenService.getTokenValidate.and.returnValue(mockObservableError({
      error: {
        message: 'error http'
      }
    }))
    clickElement(fixture, 'send', true);
    fixture.detectChanges();
    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('error http');
  })

  it('should go to the next step', () => {
    component.step = 0;
    component.nextStep();
    expect(component.step).toBe(1);
    expect(component.typeAlert).toBeUndefined()
    expect(component.messageAlert).toBeUndefined()
  })

  it('should handle token validation by service', () => {
    const mockData = {status: HttpStatusCode.SUCCESS_TRANSACTION};
    component.executeService = jasmine.createSpy().and.returnValue(mockObservable(mockData));
    component.handleValidateTokenByService();
    expect(component.executeService).toHaveBeenCalled();
    expect(component.activeModal.close).toHaveBeenCalledWith(mockData);
  });

  it('should show alert on invalid token', () => {
    const mockData = {error: true, status: HttpStatusCode.INVALID_TOKEN};
    component.executeService = jasmine.createSpy().and.returnValue(mockObservable(mockData));
    spyOn(component, 'showAlert');
    component.handleValidateTokenByService();
    expect(component.executeService).toHaveBeenCalled();
    expect(component.showAlert).toHaveBeenCalledWith('error', 'error:invalid_token');
  });

  it('on submit send token', () => {
    spyOn(component, 'sendToken');
    component.onSubmit();
    expect(component.sendToken).toHaveBeenCalled();
  })

  it('should generate Token', () => {
    spyOn(component, 'showAlert');
    spyOn(component, 'hiddenTokenAlert');
    utils.getTokenType.and.returnValue('sms')
    component.tokenType = 'sms';
    fixture.detectChanges();
    tokenService.tokenGenerate.and.returnValue(mockObservable({digitCode: '378'}))
    component.generateToken();
    expect(tokenService.tokenGenerate).toHaveBeenCalled();
    expect(utils.hidePulseLoader).toHaveBeenCalled();
    expect(component.showAlert).toHaveBeenCalledWith('success', 't_ok_send_token')
    expect(component.hiddenTokenAlert).toHaveBeenCalled();
  })

  it('should have error when try to generate token', () => {

    spyOn(component, 'showAlert');
    tokenService.tokenGenerate.and.returnValue(mockObservableError({}))
    component.generateToken();
    expect(tokenService.tokenGenerate).toHaveBeenCalled();
    expect(utils.hidePulseLoader).toHaveBeenCalled();
    expect(component.showAlert).toHaveBeenCalledWith('error', 't_could_not_send_token')

  })

});
