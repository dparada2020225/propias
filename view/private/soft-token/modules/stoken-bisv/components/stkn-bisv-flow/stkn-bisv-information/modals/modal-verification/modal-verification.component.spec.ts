import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { of, Subject } from 'rxjs';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IAssignStknBisv } from '../../../../../interfaces/stkn-bisv-devel.interface';
import { StknBisvDevelService } from '../../../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { SecurityOptionStokenService } from '../../../../../services/transaction/security-option-stoken.service';
import { ModalVerificationComponent } from './modal-verification.component';

const settings = {
  token: {
    physical: {
      max: 6,
      min: 5
    },
    sms: {
      max: 8,
      min: 5
    },
    'soft-token': {
      max: 6,
      min: 6
    },
  }
}

fdescribe('ModalVerificationComponent', () => {
  let component: ModalVerificationComponent;
  let fixture: ComponentFixture<ModalVerificationComponent>;

  //spy
  let modalService: jasmine.SpyObj<NgbActiveModal>;
  let storageService: jasmine.SpyObj<StorageService>;
  let securityOptionStokenService: jasmine.SpyObj<SecurityOptionStokenService>;
  let utils: jasmine.SpyObj<UtilService>;
  let parametersService: jasmine.SpyObj<ParameterManagementService>;
  let stokenBisvDevelServices: jasmine.SpyObj<StknBisvDevelService>;
  let findServiceCode: jasmine.SpyObj<FindServiceCodeService>;







  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const securityOptionStokenServiceSpy = jasmine.createSpyObj('SecurityOptionStokenService', ['sendAffiliationCodeExpose']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['getTokenType', 'showPulseLoader', 'hidePulseLoader']);
    const parametersServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const stokenBisvDevelServicesSpy = jasmine.createSpyObj('StknBisvDevelService', ['assignTokenTypeExposed', 'generateCodeQR', 'validateStatusQR']);
    const findServiceCodeSpy = jasmine.createSpyObj('FindServiceCodeService', ['validateCustomFeature']);




    await TestBed.configureTestingModule({
      providers: [
        { provide: NgbActiveModal, useValue: modalServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: SecurityOptionStokenService, useValue: securityOptionStokenServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: ParameterManagementService, useValue: parametersServiceSpy },
        { provide: StknBisvDevelService, useValue: stokenBisvDevelServicesSpy },
        { provide: FindServiceCodeService, useValue: findServiceCodeSpy },

      ],
      imports: [
        NgxSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        AdfComponentsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [ModalVerificationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalVerificationComponent);
    component = fixture.componentInstance;

    //Spy
    modalService = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    securityOptionStokenService = TestBed.inject(SecurityOptionStokenService) as jasmine.SpyObj<SecurityOptionStokenService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    parametersService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    stokenBisvDevelServices = TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;
    findServiceCode = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;


    findServiceCode.validateCustomFeature.and.returnValue(true);
    utils.getTokenType.and.returnValue('T');
    storageService.getItem.and.returnValue(JSON.stringify(settings));
    parametersService.getParameter.and.returnValue({
      username: 'kveliz',
      tokenType: 'S',
      clientType: 'N'
    })
    securityOptionStokenService.sendAffiliationCodeExpose.and.returnValue(of('True'))

    fixture.detectChanges();
  });

  /************************** CREATE CONSTANT TO BTN CONTINUE AND SIMULATED CLICK EVENT **************************/

  const clickContinueBtn = () => {
    const openModalBtn = fixture.debugElement.query(By.css('#prev'));
    return openModalBtn.triggerEventHandler('click', null);
  };

  it('should create ModalVerificationComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal in method close()', () => {
    modalService.close.and.callThrough();
    component.close();
    expect(modalService.close).toHaveBeenCalled();
  });

  it('should create the form if the typeToken is SMS', () => {

    utils.getTokenType.and.returnValue('S');
    storageService.getItem.and.returnValue(JSON.stringify(settings));
    component.ngOnInit();

    expect(component.maxLength).toBe(8);
    expect(component.inputTokenForm).not.toBeUndefined();
    expect(component.inputTokenForm).toBeTruthy();

  });

  it('should create the form if the typeToken is Physical', () => {

    utils.getTokenType.and.returnValue('F');
    storageService.getItem.and.returnValue(JSON.stringify(settings));
    component.ngOnInit();

    expect(component.maxLength).toBe(6);
    expect(component.inputTokenForm).not.toBeUndefined();
    expect(component.inputTokenForm).toBeTruthy();

  });

  it('should return a object with status 200 if the token is ok', () => {

    const dataMock: IAssignStknBisv = {
      responseCode: '204',
      responseMessage: 'Success'
    };


    stokenBisvDevelServices.assignTokenTypeExposed.and.returnValue(of(dataMock))


    component.inputTokenForm.get('inputToken')?.setValue('123456');
    clickContinueBtn();
    fixture.detectChanges();

    expect(modalService.close).toHaveBeenCalledWith({
      status: 200,
      message: 'Success',
      responseCode: '204',
      error: null
    });

    expect(modalService.close).not.toEqual({
      status: 400,
      message: '',
      responseCode: null,
      error: null
    });

  });

  it('should show an alert if the token is invalidate and the changeDeviceService returns an error status 498', () => {


    const dataMock: HttpErrorResponse = new HttpErrorResponse({
      error: {
        status: '498',
        message: 'Invalid token'
      },
      status: 498,
      statusText: ''
    });



    const serviceResponse = new Subject<any>();
    stokenBisvDevelServices.assignTokenTypeExposed.and.returnValue(serviceResponse.asObservable())
    serviceResponse.error(dataMock); // Emite los datos de prueba en el Subject


    component.inputTokenForm.get('inputToken')?.setValue('123456');
    clickContinueBtn();
    fixture.detectChanges();

    expect(component.messageAlert).toEqual('Invalid token');
    expect(modalService.close).not.toHaveBeenCalledWith({
      status: 200,
      message: '',
      responseCode: 'string',
      error: null
    });

    expect(modalService.close).not.toEqual({
      status: 400,
      message: '',
      responseCode: null,
      error: null
    });


  });

  it('should show an alert if the changeDevice returns an error different to 498', () => {


    const dataMock: HttpErrorResponse = new HttpErrorResponse({
      error: {
        status: '400',
        message: 'Bad request'
      },
      status: 400,
      statusText: ''
    });


    const serviceResponse = new Subject<any>();
    stokenBisvDevelServices.assignTokenTypeExposed.and.returnValue(serviceResponse.asObservable())
    serviceResponse.error(dataMock); // Emite los datos de prueba en el Subject


    component.inputTokenForm.get('inputToken')?.setValue('123456');
    clickContinueBtn();
    fixture.detectChanges();

    expect(modalService.close).toHaveBeenCalledWith({
      status: 400,
      message: 'Bad request',
      responseCode: '',
      error: dataMock.error
    });

  });


  it('should display an error on the token input if the token does not meet the minimum number of characters and the user click the button ', () => {


    component.inputTokenForm.get('inputToken')?.setValue('12');
    clickContinueBtn();

    expect(component.inputTokenForm.valid).toBeFalse();
    expect(stokenBisvDevelServices.assignTokenTypeExposed).not.toHaveBeenCalled();
    expect(component.inputTokenError()).toEqual('stoken-min-length');


  });

  it('should display an error on the token input if the token does not meet the minimum number of characters and the user click the button ', () => {


    component.inputTokenForm.get('inputToken')?.setValue('123456789987');
    clickContinueBtn();

    expect(component.inputTokenForm.valid).toBeFalse();
    expect(stokenBisvDevelServices.assignTokenTypeExposed).not.toHaveBeenCalled();
    expect(component.inputTokenError()).toEqual('stoken-max-length');


  });

  it('should call goTo when press Intro in form', () => {
    spyOn(component, 'goTo');

    const formElement = fixture.debugElement.query(By.css('form'));
    formElement.triggerEventHandler('submit', null);
    expect(component.goTo).toHaveBeenCalled();
  });

  it('should typeToken() returns a V when TypeToken is null ', () => {
    parametersService.getParameter.and.returnValue('null');
    const typeToken = component.getTypeToke()
    expect(typeToken).toBe('V')
  });

  it('should show alert when not is possible send the token to number phone', () => {


    const dataMock: HttpErrorResponse = new HttpErrorResponse({
      error: {
        status: '400',
        message: 'Bad request'
      },
      status: 400,
      statusText: ''
    });

    const serviceResponse = new Subject<any>();
    securityOptionStokenService.sendAffiliationCodeExpose.and.returnValue(serviceResponse.asObservable())
    serviceResponse.error(dataMock); // Emite los datos de prueba en el Subject

    component.ngOnInit();
    expect(component.messageAlert).toBe(dataMock.error.message)

  });

  it('should show alert when not is possible send the token to number phone *****TESTING OPTIONAL CHAINING*****', () => {


    const dataMock: HttpErrorResponse = new HttpErrorResponse({
      error: {
        status: '400',
        message: undefined
      },
      status: 400,
      statusText: ''
    });


    const serviceResponse = new Subject<any>();
    securityOptionStokenService.sendAffiliationCodeExpose.and.returnValue(serviceResponse.asObservable())
    serviceResponse.error(dataMock); // Emite los datos de prueba en el Subject

    component.ngOnInit();
    expect(component.messageAlert).toBe('Internal_server_error')

  });

});