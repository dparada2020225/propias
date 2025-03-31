import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { of, Subject } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StknBisvDevelService } from '../../../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { ChangeDeviceService } from '../../../../../services/transaction/HID/change-device.service';
import { ModalStokenComponent } from './modal-stoken.component';

fdescribe('ModalStokenComponent', () => {
  let component: ModalStokenComponent;
  let fixture: ComponentFixture<ModalStokenComponent>;

  //spy
  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let storageService: jasmine.SpyObj<StorageService>;
  let utils: jasmine.SpyObj<UtilService>;
  let parametersService: jasmine.SpyObj<ParameterManagementService>;
  let stokenBisvDevelServices: jasmine.SpyObj<StknBisvDevelService>;





  beforeEach(async () => {

    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])
    const changeDeviceServiceSpy = jasmine.createSpyObj('ChangeDeviceService', ['changeDevice']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['getTokenType', 'showPulseLoader', 'hidePulseLoader']);
    const parametersServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const stokenBisvDevelServicesSpy = jasmine.createSpyObj('StknBisvDevelService', ['assignTokenType', 'generateCodeQR', 'validateStatusQR', 'changeDeviceStoken']);
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);



    await TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ChangeDeviceService, useValue: changeDeviceServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: ParameterManagementService, useValue: parametersServiceSpy },
        { provide: StknBisvDevelService, useValue: stokenBisvDevelServicesSpy },
        { provide: NgbActiveModal, useValue: activeModalSpy },

      ],
      imports: [
        NgxSpinnerModule,
        NgbModalModule,
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
      declarations: [ModalStokenComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalStokenComponent);
    component = fixture.componentInstance;

    //Spy
    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    parametersService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    stokenBisvDevelServices = TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;



    //Inject

    const settings = {
      token: {
        physical: {
          max: 6,
          min: 5
        },
        sms: {
          max: 6,
          min: 5
        },
        'soft-token': {
          max: 6,
          min: 6
        },
      }
    }


    utils.getTokenType.and.returnValue('T');
    storageService.getItem.and.returnValue(JSON.stringify(settings))

    fixture.detectChanges();
  });


  /************************** CREATE CONSTANT TO BTN CONTINUE AND SIMULATED CLICK EVENT **************************/

  const clickContinueBtn = () => {
    const openModalBtn = fixture.debugElement.query(By.css('#prev'));
    return openModalBtn.triggerEventHandler('click', null);
  };

  it('should create ModalStokenComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal in method close()', () => {
    activeModal.close.and.callThrough();
    component.close();
    expect(activeModal.close).toHaveBeenCalled();
  });

  it('should show an error if user clicks the continue button and the form has a invalid status', () => {


    clickContinueBtn();
    expect(stokenBisvDevelServices.changeDeviceStoken).not.toHaveBeenCalled()

  });

  it('should return an error if the input dont have the min length allowed', () => {

    component.inputTokenForm.get('inputToken')?.setValue('12345');
    clickContinueBtn();

    expect(stokenBisvDevelServices.changeDeviceStoken).not.toHaveBeenCalled()
    expect(component.inputTokenError()).toEqual('stoken-min-length');

  });

  it('should return an error if the input dont have the max length allowed', () => {

    component.inputTokenForm.get('inputToken')?.setValue('123456789123');
    clickContinueBtn();

    expect(stokenBisvDevelServices.changeDeviceStoken).not.toHaveBeenCalled()
    expect(component.inputTokenError()).toEqual('stoken-max-length');

  });


  it('should return a object with status 200 if the token is ok', () => {


    stokenBisvDevelServices.changeDeviceStoken.and.returnValue(of(true))

    component.inputTokenForm.get('inputToken')?.setValue('123456');
    clickContinueBtn();

    expect(activeModal.close).toHaveBeenCalledWith({
      status: 200,
      message: '',
      data: true,
      error: null
    });

    expect(activeModal.close).not.toEqual({
      status: 400,
      message: '',
      data: null,
      error: null
    });

    expect(stokenBisvDevelServices.changeDeviceStoken).toHaveBeenCalled()


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
    stokenBisvDevelServices.changeDeviceStoken.and.returnValue(serviceResponse.asObservable())
    serviceResponse.error(dataMock); // Emite los datos de prueba en el Subject


    component.inputTokenForm.get('inputToken')?.setValue('123456');
    clickContinueBtn();
    fixture.detectChanges();

    expect(component.messageAlert).toEqual('Invalid token');
    expect(activeModal.close).not.toHaveBeenCalledWith({
      status: 200,
      message: '',
      data: 'string',
      error: null
    });

    expect(activeModal.close).not.toEqual({
      status: 400,
      message: '',
      data: null,
      error: null
    });


  });

  it('should show an alert if the token is invalidate and the changeDeviceService returns an error status 498 (testing optional chaining)', () => {


    const dataMock: HttpErrorResponse = new HttpErrorResponse({
      error: {
          status: '498',
          message: null
      },
      status: 498,
      statusText: ''
    });


    const serviceResponse = new Subject<any>();
    stokenBisvDevelServices.changeDeviceStoken.and.returnValue(serviceResponse.asObservable())
    serviceResponse.error(dataMock); // Emite los datos de prueba en el Subject


    component.inputTokenForm.get('inputToken')?.setValue('123456');
    clickContinueBtn();
    fixture.detectChanges();

    expect(component.messageAlert).toEqual('invalid_token');
    expect(activeModal.close).not.toHaveBeenCalledWith({
      status: 200,
      message: '',
      data: 'string',
      error: null
    });

    expect(activeModal.close).not.toEqual({
      status: 400,
      message: '',
      data: null,
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
    stokenBisvDevelServices.changeDeviceStoken.and.returnValue(serviceResponse.asObservable())
    serviceResponse.error(dataMock); // Emite los datos de prueba en el Subject


    component.inputTokenForm.get('inputToken')?.setValue('123456');
    clickContinueBtn();
    fixture.detectChanges();

    expect(activeModal.close).toHaveBeenCalledWith({
      status: 400,
      message: 'Bad request',
      data: null,
      error: dataMock
    });

  });

  it('should show an alert if the changeDevice returns an error different to 498 Testing Optional Chaining', () => {


    const dataMock: HttpErrorResponse = new HttpErrorResponse({
      error: undefined,
      statusText: '',
      status: 500
    });


    const serviceResponse = new Subject<any>();
    stokenBisvDevelServices.changeDeviceStoken.and.returnValue(serviceResponse.asObservable())
    serviceResponse.error(dataMock); // Emite los datos de prueba en el Subject


    component.inputTokenForm.get('inputToken')?.setValue('123456');
    clickContinueBtn();
    fixture.detectChanges();

    expect(activeModal.close).toHaveBeenCalledWith({
      status: 500,
      message: 'Internal_server_error',
      data: null,
      error: dataMock
    });

  });

  // it('should display an error on the token input if the token does not meet the minimum number of characters and the user click the button ', () => {

  //   spyOn<any>(component, 'validateToken');

  //   const dataMock: IQrValue = {
  //     qrValue: 'string'
  //   };

  //   changeDeviceService.changeDevice.and.returnValue(of(dataMock))

  //   component.inputTokenForm.get('inputToken')?.setValue('12345');
  //   clickContinueBtn();
  //   fixture.detectChanges();

  //   expect(component.inputTokenForm.valid).toBeFalse();
  //   expect(component['validateToken']).not.toHaveBeenCalled();

  // });



  // it('should display an error on the token input if the token does not meet the maximum number of characters and the user click the button ', () => {

  //   spyOn<any>(component, 'validateToken');

  //   const dataMock: IQrValue = {
  //     qrValue: 'string'
  //   };

  //   changeDeviceService.changeDevice.and.returnValue(of(dataMock))

  //   component.inputTokenForm.get('inputToken')?.setValue('12345678910');
  //   clickContinueBtn();
  //   fixture.detectChanges();

  //   expect(component.inputTokenForm.valid).toBeFalse();
  //   expect(component['validateToken']).not.toHaveBeenCalled();

  // });


});

