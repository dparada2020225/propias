import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { AuthenticationService, StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { EStokenRoutesMigration, EStokenRoutesNewUser } from '../../../enums/stkn-bisv.enum';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvStepHorizontalComponent } from '../../stkn-bisv-steps-indicator/stkn-bisv-step-horizontal/stkn-bisv-step-horizontal.component';
import { StknBisvStepVerticalComponent } from '../../stkn-bisv-steps-indicator/stkn-bisv-step-vertical/stkn-bisv-step-vertical.component';
import { StknBisvTokenApproveComponent } from './stkn-bisv-token-approve.component';

fdescribe('StknBisvTokenApproveComponent', () => {
  let component: StknBisvTokenApproveComponent;
  let fixture: ComponentFixture<StknBisvTokenApproveComponent>;

  let modalService: jasmine.SpyObj<NgbModal>;
  let router: jasmine.SpyObj<Router>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let utils: jasmine.SpyObj<UtilService>;
  let develService: jasmine.SpyObj<StknBisvDevelService>;
  let storage: jasmine.SpyObj<StorageService>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;


  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['url', 'navigate']);
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide', 'show']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader']);
    const develServiceSpy = jasmine.createSpyObj('StknBisvDevelService', ['firstValidateTokenExposed', 'firstValidateToken', 'stokenActivationOnAs', 'insertOnAfiliationLog']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);



    await TestBed.configureTestingModule({

      providers: [
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: StknBisvDevelService, useValue: develServiceSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy },

      ],
      imports: [
        BrowserAnimationsModule,
        NgxSpinnerModule,
        HttpClientTestingModule,
        NgbModalModule,
        AdfComponentsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [StknBisvTokenApproveComponent, StknBisvStepHorizontalComponent, StknBisvStepVerticalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StknBisvTokenApproveComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    develService = TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;

   TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;


    parameterManager.getParameter.withArgs('pathToNavigate').and.returnValue('migration');
    storage.getItem.withArgs('currentUser').and.returnValue('KVELIZ');



    fixture.detectChanges();
  });

  const btnClick = (name: string) => {
    const btn = fixture.debugElement.query(By.css(name));
    if (!btn) return btn;
    btn.triggerEventHandler('click', null);
    return btn;
  };

  const inputTokenControl = () => {
    return component.inputTokenForm.controls['inputToken'];
  }

  it('should create StknBisvTokenApproveComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should make a log out from the session if the user click the End session button', () => {
    const token = {
      access_token: 'string',
      app_id: 'string',
      device_status: 'string',
      expires_in: 123,
      fullname: 'string',
      jti: 'string',
      key: 'string',
      required_token: true,
      scope: 'string',
      token_type: 'string',
    };

    authenticationService.logout.and.returnValue(of<any>(token));
    spinner.show.and.returnValue(new Promise(() => true));
    spinner.hide.and.returnValue(new Promise(() => true));

    btnClick('#back-btn');

    expect(parameterManager.sendParameters).toHaveBeenCalled();
    expect(authenticationService.logout).toHaveBeenCalled();


  });

  xit('should open the help modal', () => {
    btnClick('#openHID-modal');

    //expect(modalService.open).toHaveBeenCalled();
  });

  it('should show an required error if the input token is empty and the user click the continue button', () => {

    btnClick('#btn-ndevice-continue');
    const inputToken = inputTokenControl().errors;

    if (inputToken) {
      expect(inputToken['required']).toBeTrue();
    }

    expect(develService.firstValidateToken).not.toHaveBeenCalled();
    expect(component.inputTokenForm.valid).toBeFalse();

  });

  it('should validate the otp and afiliate on soft token if the input token is fill and the user click the continue button', () => {

    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
    };

    develService.firstValidateToken.and.returnValue(of(true));
    develService.stokenActivationOnAs.and.returnValue(of(true));
    develService.insertOnAfiliationLog.and.returnValue(of({ code: '200', description: '', reference: '' }));
    modalService.open.and.returnValue(modalRefMock as any);
    spinner.show.and.returnValue(new Promise(() => true));
    router.navigate.and.returnValue(new Promise(() => true));


    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#btn-ndevice-continue');

    expect(develService.firstValidateToken).toHaveBeenCalled();
    expect(develService.stokenActivationOnAs).toHaveBeenCalled();
    expect(develService.insertOnAfiliationLog).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([EStokenRoutesMigration.CONFIRMATION_SCREEN]);

  });

  const errorResponse_ok = new HttpErrorResponse({
    error: {
      code: '400',
      message: 'Error en el servicio'
    },
    status: 400,
    statusText: 'Not Found'
  });

  it('should show an error alert if the validate token fails', ()=>{

    develService.firstValidateToken.and.returnValue(throwError(() => errorResponse_ok));
    spinner.show.and.returnValue(new Promise(() => true));
    spinner.hide.and.returnValue(new Promise(() => true));


    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#btn-ndevice-continue');

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('Error en el servicio');
    expect(develService.stokenActivationOnAs).not.toHaveBeenCalled();
    expect(develService.insertOnAfiliationLog).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalledWith([EStokenRoutesNewUser.CONFIRMATION_SCREEN]);

  });

  it('should show an error alert if the stokenActivationOnAs fails', ()=>{

    develService.firstValidateToken.and.returnValue(of(true));
    develService.stokenActivationOnAs.and.returnValue(throwError(() => errorResponse_ok));


    spinner.show.and.returnValue(new Promise(() => true));
    spinner.hide.and.returnValue(new Promise(() => true));


    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#btn-ndevice-continue');

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('Error en el servicio');
    expect(router.navigate).not.toHaveBeenCalledWith([EStokenRoutesNewUser.CONFIRMATION_SCREEN]);

  });

  it('should show an error alert if the insertOnAfiliationLog fails', ()=>{

    develService.firstValidateToken.and.returnValue(of(true));
    develService.stokenActivationOnAs.and.returnValue(of(true));
    develService.insertOnAfiliationLog.and.returnValue(throwError(() => errorResponse_ok));


    spinner.show.and.returnValue(new Promise(() => true));
    spinner.hide.and.returnValue(new Promise(() => true));


    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#btn-ndevice-continue');

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('Error en el servicio');
    expect(router.navigate).not.toHaveBeenCalledWith([EStokenRoutesNewUser.CONFIRMATION_SCREEN]);

  });

  //************************* TESTING PRE LOGIN FLOW **************************/

  it('should validate the otp and afiliate on soft token if the input token is fill and the user click the continue button', () => {

    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
    };

    develService.firstValidateTokenExposed.and.returnValue(of(true));
    develService.stokenActivationOnAs.and.returnValue(of(true));
    develService.insertOnAfiliationLog.and.returnValue(of({ code: '200', description: '', reference: '' }));
    modalService.open.and.returnValue(modalRefMock as any);
    spinner.show.and.returnValue(new Promise(() => true));
    router.navigate.and.returnValue(new Promise(() => true));

    component.stokenPreLogin = true;

    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#btn-ndevice-continue');

    expect(develService.firstValidateTokenExposed).toHaveBeenCalled();
    expect(develService.stokenActivationOnAs).toHaveBeenCalled();
    expect(develService.insertOnAfiliationLog).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([EStokenRoutesNewUser.CONFIRMATION_SCREEN]);

  });


  it('should show an error alert if the validate token fails', ()=>{

    develService.firstValidateTokenExposed.and.returnValue(throwError(() => errorResponse_ok));
    spinner.show.and.returnValue(new Promise(() => true));
    spinner.hide.and.returnValue(new Promise(() => true));
    component.stokenPreLogin = true;


    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#btn-ndevice-continue');

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('Error en el servicio');
    expect(develService.stokenActivationOnAs).not.toHaveBeenCalled();
    expect(develService.insertOnAfiliationLog).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalledWith([EStokenRoutesNewUser.CONFIRMATION_SCREEN]);

  });

  it('should show an error alert if the stokenActivationOnAs fails', ()=>{

    develService.firstValidateTokenExposed.and.returnValue(of(true));
    develService.stokenActivationOnAs.and.returnValue(throwError(() => errorResponse_ok));


    spinner.show.and.returnValue(new Promise(() => true));
    spinner.hide.and.returnValue(new Promise(() => true));
    component.stokenPreLogin = true;


    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#btn-ndevice-continue');

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('Error en el servicio');
    expect(router.navigate).not.toHaveBeenCalledWith([EStokenRoutesNewUser.CONFIRMATION_SCREEN]);

  });

  it('should show an error alert if the insertOnAfiliationLog fails', ()=>{

    develService.firstValidateTokenExposed.and.returnValue(of(true));
    develService.stokenActivationOnAs.and.returnValue(of(true));
    develService.insertOnAfiliationLog.and.returnValue(throwError(() => errorResponse_ok));


    spinner.show.and.returnValue(new Promise(() => true));
    spinner.hide.and.returnValue(new Promise(() => true));
    component.stokenPreLogin = true;


    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#btn-ndevice-continue');

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('Error en el servicio');
    expect(router.navigate).not.toHaveBeenCalledWith([EStokenRoutesNewUser.CONFIRMATION_SCREEN]);

  });


});
