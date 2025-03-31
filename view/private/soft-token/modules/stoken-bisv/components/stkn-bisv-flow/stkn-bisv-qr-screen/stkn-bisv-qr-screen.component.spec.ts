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
import { EStokenRoutesChangeDevice, EStokenRoutesMigration, EStokenRoutesNewUser } from '../../../enums/stkn-bisv.enum';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvCodeQrComponent } from '../../stkn-bisv-code-qr/stkn-bisv-code-qr.component';
import { StknBisvStepHorizontalComponent } from '../../stkn-bisv-steps-indicator/stkn-bisv-step-horizontal/stkn-bisv-step-horizontal.component';
import { StknBisvStepVerticalComponent } from '../../stkn-bisv-steps-indicator/stkn-bisv-step-vertical/stkn-bisv-step-vertical.component';
import { StknBisvQrScreenComponent } from './stkn-bisv-qr-screen.component';

fdescribe('StknBisvQrScreenComponent', () => {
  let component: StknBisvQrScreenComponent;
  let fixture: ComponentFixture<StknBisvQrScreenComponent>;

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
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader']);
    const develServiceSpy = jasmine.createSpyObj('StknBisvDevelService', ['firstValidateTokenExposed', 'firstValidateToken', 'stokenActivationOnAs', 'insertOnAfiliationLog', 'generateCodeQR', 'generateCodeQRExposed', 'assignTokenType', 'validateStatusQR', 'validateStatusQRExposed']);
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
      declarations: [StknBisvQrScreenComponent, StknBisvStepHorizontalComponent, StknBisvStepVerticalComponent, StknBisvCodeQrComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StknBisvQrScreenComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    develService = TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;

    TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    storage.getItem.withArgs('currentUser').and.returnValue('KVELIZ');

    develService.assignTokenType.and.returnValue(of({
      responseCode: '204',
      responseMessage: 'success'
    }));

    develService.generateCodeQR.and.returnValue(of({
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

  it('should create StknBisvQrScreenComponent', () => {
    expect(component).toBeTruthy();
  });

  const errorResponse_ok1 = (message, code) => {
    return new HttpErrorResponse({
      error: {
        code,
        message
      },
      status: 404,
      statusText: 'Not Found'
    })
  };

  const modalRefMockWarning2 = {
    componentInstance: {
      data: true,
      allowCloseModal: true
    },
    result: Promise.resolve('close'),
  };

  it('should show the warning modal if the user has not scanned the QR', () => {

    develService.validateStatusQR.and.returnValue(throwError(() => errorResponse_ok1('Error', '401')));
    modalService.open.and.returnValue(modalRefMockWarning2 as any);
    spyOn(component, 'goTo');

    btnClick('continue-btn');

    expect(modalService.open).toHaveBeenCalled();
    expect(component.goTo).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();

  });

  it('should show the warning modal and an alert error if the user has not scanned the QR', () => {

    develService.validateStatusQR.and.returnValue(throwError(() => errorResponse_ok1(undefined, '401')));
    modalService.open.and.returnValue(modalRefMockWarning2 as any);
    spyOn(component, 'goTo');

    btnClick('continue-btn');

    expect(modalService.open).toHaveBeenCalled();
    expect(component.goTo).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.messageAlert).toEqual('Error getting QR status');

  });

  it('should navigate to token approve screen if the user has already scann the code QR', () => {

    parameterManager.getParameter.withArgs('pathToNavigate').and.returnValue('migration');
    parameterManager.getParameter.withArgs('clientType').and.returnValue('N');

    component.ngOnInit();

    develService.validateStatusQR.and.returnValue(throwError(() => errorResponse_ok1(undefined, '842')));
    router.navigate.and.returnValue(new Promise(() => true));

    btnClick('continue-btn');

    expect(modalService.open).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([EStokenRoutesMigration.TOKEN_APPROVE_SCREEN])
    expect(component.messageAlert).toBeUndefined();

  });

  it('should navigate to token approve screen if the user has already scann the code QR', () => {
    parameterManager.getParameter.withArgs('clientType').and.returnValue('N');
    parameterManager.getParameter.withArgs('pathToNavigate').and.returnValue('change-device');
    component.ngOnInit();

    develService.validateStatusQR.and.returnValue(throwError(() => errorResponse_ok1(undefined, '842')));
    router.navigate.and.returnValue(new Promise(() => true));

    btnClick('continue-btn');

    expect(modalService.open).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([EStokenRoutesChangeDevice.TOKEN_APPROVE_SCREEN])
    expect(component.messageAlert).toBeUndefined();

  });

  it('should show an alert if the generateCodeQR fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: {
        code: '404',
        message: 'Error al obtener el qr'
      },
      status: 404,
      statusText: 'Not Found'
    });

    develService.generateCodeQR.and.returnValue(throwError(() => errorResponse));
    spinner.hide.and.returnValue(new Promise(() => true));

    component.ngOnInit();


    expect(component.messageAlert).toEqual('Error al obtener el qr');
    expect(component.qrCodeError).toBeTrue();


  });

  it('should close the session when user clicks the log out button', () => {

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

    btnClick('logOut-btn');

    expect(authenticationService.logout).toHaveBeenCalled();
    expect(parameterManager.sendParameters).toHaveBeenCalled();

  });

  it('should call ngOnInit again if user click the button Retry', () => {

    spyOn(component, 'ngOnInit');
    component.clickOnRetryMessage(true);
    expect(component.ngOnInit).toHaveBeenCalled();

  });

  it('should not call ngOnInit again if user click the button Retry and retry is false', () => {

    spyOn(component, 'ngOnInit');
    component.clickOnRetryMessage(false);
    expect(component.ngOnInit).not.toHaveBeenCalled();

  });


  //************************* TESTING PRE LOGIN FLOW **************************/

  const errorResponse_ok2 = (message, code) => {
    return new HttpErrorResponse({
      error: {
        code,
        message
      },
      status: 404,
      statusText: 'Not Found'
    })
  };

  it('should navigate to token approve screen if the user has already scann the code QR', () => {

    parameterManager.getParameter.withArgs('pathToNavigate').and.returnValue('migration');
    parameterManager.getParameter.withArgs('clientType').and.returnValue('N');
    component.ngOnInit();
    component.stokenPreLogin = true;

    fixture.autoDetectChanges();

    develService.validateStatusQRExposed.and.returnValue(throwError(() => errorResponse_ok2(undefined, '842')));
    router.navigate.and.returnValue(new Promise(() => true));

    btnClick('continue-btn');

    expect(modalService.open).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([EStokenRoutesNewUser.TOKEN_APPROVE_SCREEN])
    expect(component.messageAlert).toBeUndefined();

  });

  it('should call the generateCodeExposed if user is in the new user flow', ()=>{

    develService.generateCodeQRExposed.and.returnValue(throwError(() => errorResponse_ok2(undefined, '400')));
    spinner.show.and.returnValue(new Promise(() => true));
    spinner.hide.and.returnValue(new Promise(() => true));
    component.stokenPreLogin = true;

    component.ngOnInit();

    expect(develService.generateCodeQRExposed).toHaveBeenCalled();

  });

});
