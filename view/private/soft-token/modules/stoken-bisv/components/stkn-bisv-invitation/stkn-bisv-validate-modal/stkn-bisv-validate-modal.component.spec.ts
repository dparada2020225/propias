import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { AuthenticationService, StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvStepVerticalComponent } from '../../stkn-bisv-steps-indicator/stkn-bisv-step-vertical/stkn-bisv-step-vertical.component';
import { StknBisvValidateModalComponent } from './stkn-bisv-validate-modal.component';

fdescribe('StknBisvValidateModalComponent', () => {
  let component: StknBisvValidateModalComponent;
  let fixture: ComponentFixture<StknBisvValidateModalComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let storage: jasmine.SpyObj<StorageService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let util: jasmine.SpyObj<UtilService>;
  let stokenBisvDevelServices: jasmine.SpyObj<StknBisvDevelService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['getProfile', 'showPulseLoader', 'hidePulseLoader']);
    const stokenBisvDevelServicesSpy = jasmine.createSpyObj('StknBisvDevelService', ['assignTokenType', 'generateCodeQR', 'validateStatusQR', 'firstValidateToken', 'stokenActivationOnAs', 'insertOnAfiliationLog']);
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: StknBisvDevelService, useValue: stokenBisvDevelServicesSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
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
      declarations: [ StknBisvValidateModalComponent, StknBisvStepVerticalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StknBisvValidateModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.
      SpyObj<ParameterManagementService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    stokenBisvDevelServices = TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;



    TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    TestBed.inject(Router) as jasmine.SpyObj<Router>;
    TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    fixture.detectChanges();
  });

  const btnClick = (name: string) =>{
    const btn = fixture.debugElement.query(By.css(`${name}`));
    if(!btn) return btn;
    btn.triggerEventHandler('click', null);
    return btn;
  }

  const inputTokenControl = () =>{
    return component.inputTokenForm.controls['inputToken']
  }

  it('should create StknBisvValidateModalComponent', () => {
    expect(component).toBeTruthy();
  });

  it('the return button should be a log out button if the allowCloseModal is false', ()=>{

    component.allowCloseModal = false;
    component.ngOnInit();

    expect(component.textForReturnBtn).toEqual('stoken-logout');

  });

  it('should not close the modal if the user is not in grace period', () =>{

    component.allowCloseModal = false;
    component.ngOnInit();

    btnClick('#btn-X-method-stoken-bisv');

    expect(activeModal.close).not.toHaveBeenCalled();
  });

  it('should close the modal if the user is in grace period', ()=>{
    btnClick('#btn-X-method-stoken-bisv');

    expect(activeModal.close).toHaveBeenCalled();
  });

  it('should not open allow continued if the token input is empty', ()=>{


    btnClick('#information-stoken-btn');

    const inputToken = component.inputTokenForm.controls['inputToken'].errors;

    if(inputToken){
      expect(inputToken['required']).toBeTrue();
    }

    expect(stokenBisvDevelServices.firstValidateToken).not.toHaveBeenCalled();
    expect(component.inputTokenForm.valid).toBeFalse();

  });



  it('should validate the otp and afiliate on soft token if the input token is fill and the user click the continue button', ()=>{

    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
    };

    stokenBisvDevelServices.firstValidateToken.and.returnValue(of(true));
    stokenBisvDevelServices.stokenActivationOnAs.and.returnValue(of(true));
    stokenBisvDevelServices.insertOnAfiliationLog.and.returnValue(of({code: '200', description: '', reference: ''}));
    modalService.open.and.returnValue(modalRefMock as any);

    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#information-stoken-btn');

    expect(activeModal.close).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();

  });


  it('should return to the QR modal when the user clicks the return button and allowClose modal is true', ()=>{

    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
    };

    modalService.open.and.returnValue(modalRefMock as any);

    parameterManager.getParameter.withArgs('userIsInGracePeriodStokenBisv').and.returnValue({hasGracePeriod: true})

    btnClick('#backBtn-info-stoken');

    expect(activeModal.close).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();

  });

  it('should log out of the session if the user clicks the logOut button', ()=>{

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

    component.allowCloseModal = false;
    component.ngOnInit();

    btnClick('#backBtn-info-stoken');

    expect(activeModal.close).toHaveBeenCalled();

  });

  it('should change the doNothingVariable value', ()=>{
    component.doNothing();

    expect(component.doNothingVariable).toBeTrue();
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

    stokenBisvDevelServices.firstValidateToken.and.returnValue(throwError(() => errorResponse_ok));

    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#information-stoken-btn');

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('Error en el servicio');
    expect(activeModal.close).not.toHaveBeenCalled();


  });

  const errorResponse_ok1 = new HttpErrorResponse({
    error: {
      code: '400',
    },
    status: 400,
    statusText: 'Not Found'
  });

  it('should show an error alert if the stokenActivationOnAs fails', ()=>{

    stokenBisvDevelServices.firstValidateToken.and.returnValue(of(true));
    stokenBisvDevelServices.stokenActivationOnAs.and.returnValue(throwError(() => errorResponse_ok1));

    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#information-stoken-btn');

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('internal_server_error');
    expect(activeModal.close).not.toHaveBeenCalled();


  });

  it('should show an error alert if the insertOnAfiliationLog fails', ()=>{

    stokenBisvDevelServices.firstValidateToken.and.returnValue(of(true));
    stokenBisvDevelServices.stokenActivationOnAs.and.returnValue(of(true));
    stokenBisvDevelServices.insertOnAfiliationLog.and.returnValue(throwError(() => errorResponse_ok1));

    const inputToken = inputTokenControl();

    inputToken.setValue('123456');
    inputToken.markAllAsTouched();

    btnClick('#information-stoken-btn');

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('internal_server_error');
    expect(activeModal.close).not.toHaveBeenCalled();


  });
});