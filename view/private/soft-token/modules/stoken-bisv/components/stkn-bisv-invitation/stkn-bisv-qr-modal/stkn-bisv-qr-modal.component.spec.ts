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
import { StknBisvCodeQrComponent } from '../../stkn-bisv-code-qr/stkn-bisv-code-qr.component';
import { StknBisvStepVerticalComponent } from '../../stkn-bisv-steps-indicator/stkn-bisv-step-vertical/stkn-bisv-step-vertical.component';
import { StknBisvInfoModalComponent } from '../stkn-bisv-info-modal/stkn-bisv-info-modal.component';
import { StknBisvQrModalComponent } from './stkn-bisv-qr-modal.component';

fdescribe('StknBisvQrModalComponent', () => {
  let component: StknBisvQrModalComponent;
  let fixture: ComponentFixture<StknBisvQrModalComponent>;

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
    const stokenBisvDevelServicesSpy = jasmine.createSpyObj('StknBisvDevelService', ['assignTokenType', 'generateCodeQR', 'validateStatusQR']);
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
      declarations: [StknBisvQrModalComponent, StknBisvStepVerticalComponent, StknBisvCodeQrComponent, StknBisvInfoModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StknBisvQrModalComponent);
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


    stokenBisvDevelServices.assignTokenType.and.returnValue(of({
      responseCode: '204',
      responseMessage: 'success'
    }));

    stokenBisvDevelServices.generateCodeQR.and.returnValue(of({
      responseCode: '001',
      responseMessage: '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAHRAdEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDz/AOJvxN/4Vz/Zf/Eo/tD7f5v/AC8+Vs2bP9hs53+3SuA/4aa/6lH/AMqX/wBqo/aa/wCZW/7e/wD2jXZ6Po/gXRvhbouva9oWjLAumWj3NzJpqSsWdEGThCxJZhzz1oA4z/hpr/qUf/Kl/wDaqP8Ahpr/AKlH/wAqX/2qt/8A4TL4Gf8AProf/ghb/wCM1seHLn4S+LdRksND0nQ7u6jiMzJ/YwjwgIBOXjA6sPzoA5jQv2h/7b8Q6ZpP/CLeT9uu4rbzf7Q3bN7hd2PLGcZzjIrr/ib8Tf8AhXP9l/8AEo/tD7f5v/Lz5WzZs/2Gznf7dK8Y8SWFnpn7StnZ2FpBaWseq6dshgjEaLkQk4UcDJJP417v461nwNpH2D/hNIrGTzfM+yfa7A3OMbd+MI23qnpnj0oA8w/4aa/6lH/ypf8A2qj/AIaa/wCpR/8AKl/9qr0e8034baf4XXxLdaBocekNFHMLj+yUOUkKhDtCbudy9uM81y//AAmXwM/59dD/APBC3/xmgD2CvL9Z+MH9kfFCPwX/AGF5u+7trb7Z9r2484Id2zYem/pu5x2ruPEfinRvCWnR3+uXn2S1klEKv5TyZcgkDCAnop/KvmjV9b07xH+0Tp+raTcfaLGfVdP8uXYybtvlKeGAI5BHIoA9v+JvxN/4Vz/Zf/Eo/tD7f5v/AC8+Vs2bP9hs53+3StDWfHX9kfC+Pxp/Z3m77S2ufsfn7cecUG3ftPTf12847V5h+01/zK3/AG9/+0a3/GX/ACa9bf8AYK03/wBChoAwP+Gmv+pR/wDKl/8AaqP+Gmv+pR/8qX/2qsP4Ta/'
    }))

    fixture.detectChanges();
  });

  const btnClick = (idValue) => {
    const button = fixture.debugElement.query(By.css(`#${idValue}`));
    if (!button) return button;
    button.triggerEventHandler('click', null);
    return button;
  };

  it('should create StknBisvQrModalComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal if the user clicks the X button', () => {

    btnClick('btn-X-method-stoken-bisv');

    expect(activeModal.close).toHaveBeenCalled();

  });

  const modalRefMockResultClose = {
    componentInstance: {
      allowCloseModal: true,
      showRememberLaterBtn: true
    },
    result: Promise.resolve('close'),
  };


  it('should close the modal and return to Information Modal', () => {
    parameterManager.getParameter.withArgs('userIsInGracePeriodStokenBisv').and.returnValue(true);
    modalService.open.and.returnValue(modalRefMockResultClose as any);

    btnClick('backBtn-info-stoken');

    expect(activeModal.close).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();

  });

  it('should close the modal and logout of the session if the user is not in grace period', () => {
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

    component.allowCloseModal = false;
    authenticationService.logout.and.returnValue(of<any>(token));


    fixture.autoDetectChanges();
    btnClick('backBtn-info-stoken');
    expect(activeModal.close).toHaveBeenCalled();
    expect(modalService.open).not.toHaveBeenCalled();


  });

  it('should change the text on the return button when the user is not in grace period', () => {
    component.allowCloseModal = false;

    component.ngOnInit();

    expect(component.textForReturnBtn).toBe('stoken-logout');
  });

  it('should not allowed to close the modal when the user clicks the X button, if is not in grace period', () => {
    component.allowCloseModal = false;

    fixture.autoDetectChanges();

    btnClick('btn-X-method-stoken-bisv');

    expect(activeModal.close).not.toHaveBeenCalled();
  });

  const errorResponse_ok = new HttpErrorResponse({
    error: {
      code: '842',
      message: 'QR ha sido escenado correctamente'
    },
    status: 404,
    statusText: 'Not Found'
  });

  const modalRefMockWarning = {
    componentInstance: {
      data: true,
      allowCloseModal: true
    },
    result: Promise.resolve('close'),
  };

  it('should open the validate modal if the user has been scanned the QR', () => {

    stokenBisvDevelServices.validateStatusQR.and.returnValue(throwError(() => errorResponse_ok));
    modalService.open.and.returnValue(modalRefMockWarning as any);

    btnClick('information-stoken-btn');

    expect(modalService.open).toHaveBeenCalled();

  });

  const errorResponse = new HttpErrorResponse({
    error: {
      code: '000',
      message: 'Error en servicio'
    },
    status: 400,
    statusText: 'Not Found'
  });

  it('should show an alert error and show if the assign token returns an error', () => {
    stokenBisvDevelServices.assignTokenType.and.returnValue(throwError(() => errorResponse));

    component.ngOnInit();

    expect(component.messageAlert).toEqual('Error en servicio');
  });

  it('should show an alert error and show if the generateCodeQR returns an error', () => {
    stokenBisvDevelServices.generateCodeQR.and.returnValue(throwError(() => errorResponse));

    component.ngOnInit();

    expect(component.messageAlert).toEqual('Error en servicio');
  });

  const errorResponse1 = new HttpErrorResponse({
    status: 400,
    statusText: 'Not Found'
  });

  it('should show an alert error with message default if the generateCodeQR returns an error', () => {
    stokenBisvDevelServices.generateCodeQR.and.returnValue(throwError(() => errorResponse1));

    component.ngOnInit();

    expect(component.messageAlert).toEqual('error_getting_qr_devel');
  });

  it('should call ngOnInit if some service respond an error and the user click the retry button', ()=>{

    spyOn(component, 'ngOnInit');

    component.clickOnRetryMessage(true);
    expect(component.ngOnInit).toHaveBeenCalled();

  });

  it('should not call ngOnInit if the parameter on click retry message is false', ()=>{

    spyOn(component, 'ngOnInit');

    component.clickOnRetryMessage(false);
    expect(component.ngOnInit).not.toHaveBeenCalled();

  });

  const errorResponse_ok1 = new HttpErrorResponse({
    error: {
      code: '841',
      message: 'El QR no ha sido escenado correctamente'
    },
    status: 404,
    statusText: 'Not Found'
  });

  const modalRefMockWarning2 = {
    componentInstance: {
      data: true,
      allowCloseModal: true
    },
    result: Promise.resolve('close'),
  };

  it('should show the warning modal if the user has not scanned the QR', () => {

    stokenBisvDevelServices.validateStatusQR.and.returnValue(throwError(() => errorResponse_ok1));
    modalService.open.and.returnValue(modalRefMockWarning2 as any);
    spyOn(component, 'next');

    btnClick('information-stoken-btn');

    expect(modalService.open).toHaveBeenCalled();
    expect(component.next).not.toHaveBeenCalled();

  });

  it('should return the default error message (testing optional chaining)', ()=>{
    const errorMessage = component.optionalErrorMessage('');

    expect(errorMessage).toEqual('internal_server_error');
  });

  it('should open the modal zoom', ()=>{
    const modalRefMockZoom = {
      componentInstance: {
       qrCode: component.qrCode
      },
      result: Promise.resolve('close'),
    };

    modalService.open.and.returnValue(modalRefMockZoom as any);


    const childDebugElement = fixture.debugElement.query(By.directive(StknBisvCodeQrComponent));

    const button = childDebugElement.query(By.css('.code-qr-zoom'));
    button.triggerEventHandler('click', null);

    expect(modalService.open).toHaveBeenCalled();


  });

  it('should not open the modal zoom if the QrCode is empty', ()=>{
    const modalRefMockZoom = {
      componentInstance: {
       qrCode: null
      },
      result: Promise.resolve('close'),
    };

    modalService.open.and.returnValue(modalRefMockZoom as any);
    component.qrCode = null;

    fixture.autoDetectChanges();


    const childDebugElement = fixture.debugElement.query(By.directive(StknBisvCodeQrComponent));

    const button = childDebugElement.query(By.css('.code-qr-zoom'));
    button.triggerEventHandler('click', null);

    expect(modalService.open).not.toHaveBeenCalled();

  });

  it('should call again the onInit if user click the retry button', ()=>{

    const errorResponse = new HttpErrorResponse({
      error: {
        code: '841',
        message: 'El QR no ha sido escenado correctamente'
      },
      status: 404,
      statusText: 'Not Found'
    });

    stokenBisvDevelServices.generateCodeQR.and.returnValue(throwError(() => errorResponse));
    spyOn(component, 'clickOnRetryMessage');
    component.qrCodeError = true;

    fixture.autoDetectChanges();

    const childDebugElement = fixture.debugElement.query(By.directive(StknBisvCodeQrComponent));

    const button = childDebugElement.query(By.css('.code-qr-error__descrip'));
    button.triggerEventHandler('click', null);

    expect(component.clickOnRetryMessage).toHaveBeenCalled();

  });

});
