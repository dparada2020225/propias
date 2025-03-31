import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { AuthenticationService, StorageService } from '@adf/security';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { of, Subject } from 'rxjs';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IAssignStknBisv } from '../../../interfaces/stkn-bisv-devel.interface';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvInformationComponent } from './stkn-bisv-information.component';

fdescribe('StknBisvInformationComponent', () => {
  let component: StknBisvInformationComponent;
  let fixture: ComponentFixture<StknBisvInformationComponent>;

  let modalService: jasmine.SpyObj<NgbModal>;
  let router: jasmine.SpyObj<Router>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let utils: jasmine.SpyObj<UtilService>;
  let develService: jasmine.SpyObj<StknBisvDevelService>;
  let storage: jasmine.SpyObj<StorageService>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let findServiceCode: jasmine.SpyObj<FindServiceCodeService>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;




  beforeEach(async () => {

    const routeSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'parseUrl', 'url']);
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader', 'getTokenType']);
    const develServiceSpy = jasmine.createSpyObj('StknBisvDevelService', ['firstValidateTokenExposed', 'firstValidateToken', 'stokenActivationOnAs', 'insertOnAfiliationLog', 'generateCodeQR', 'generateCodeQRExposed', 'assignTokenType', 'validateStatusQR', 'validateStatusQRExposed']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem',]);
    const findServiceCodeSpy = jasmine.createSpyObj('FindServiceCodeService', ['validateCustomFeature']);
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);


    await TestBed.configureTestingModule({
      providers: [
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: StknBisvDevelService, useValue: develServiceSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: FindServiceCodeService, useValue: findServiceCodeSpy },
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
      declarations: [StknBisvInformationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StknBisvInformationComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    develService = TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    findServiceCode = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;


    TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    findServiceCode.validateCustomFeature.and.returnValue(true);
    Object.defineProperty(router, 'url', { value: '/soft-token/migration' });


    route.snapshot.data = {
      searchUser: {
        code: '301',
        username: 'KVELIZ',
        message: "El usuario no existe en 4Tress",
        status: 200
      },
      securityOptionExposed: {
        body: {
          status: "A",
          registrationRequired: "N",
          phone: "42919571",
          codeOperator: "P",
          email: "fserrano@gmail.com",
          lastConnectionDate: "20-02-0028",
          hasPendings: "N",
          managedUser: "N",
          periodChangePassword: "90",
          profile: "BIF ",
          userType: "N",
          areaCode: ""
        }
      }
    };




    fixture.detectChanges();
  });

  const btnClick = (name: string) => {
    const btn = fixture.debugElement.query(By.css(name));
    if (!btn) return btn;
    btn.triggerEventHandler('click', null);
    return btn;

  };

  const initInformation = (url) => {
    Object.defineProperty(router, 'url', { value: url });


    route.snapshot.data = {
      securityOptionExposed: {
        body: {
          status: "A",
          registrationRequired: "N",
          phone: "42919571",
          codeOperator: "P",
          email: "fserrano@gmail.com",
          lastConnectionDate: "20-02-0028",
          hasPendings: "N",
          managedUser: "N",
          periodChangePassword: "90",
          profile: "BIF ",
          userType: "N",
          areaCode: ""
        }
      }
    };
  };

  it('should create StknBisvInformationComponent', () => {
    expect(component).toBeTruthy();
  });

  xit('should navegate to approve-stoken screen if the user is SMS and status 305', () => {
    route.snapshot.data = {
      searchUser: {
        code: '305',
        username: 'KVELIZ',
        message: "El usuario existe en 4Tress",
        status: 200
      }
    };

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('S');
    router.navigate.and.returnValue(new Promise(() => true));

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith([`/soft-token/migration/approve-stoken`]);
  });



  it('should open the security modal if access to migration option', () => {
    const tokenModalMock: NgbModalRef = {
      componentInstance: {
        typeTransaction: ERequestTypeTransaction.AUTHENTICATION,
        tokenType: '',
        executeService: jasmine.createSpy('executeService')
      },
      result: Promise.resolve({
        status: 200,
        message: 'res.responseMessage',
        responseCode: '204',
        error: null
      }),
      dismissed: of('valor de prueba')
    } as NgbModalRef;




    parameterManager.getParameter.withArgs('typeToken').and.returnValue('S');
    parameterManager.getParameter.withArgs('showBtnBack').and.returnValue('show');
    modalService.open.and.returnValue(tokenModalMock);
    router.navigate.and.returnValue(new Promise(() => true));

    develService.assignTokenType.and.returnValue(of({
      responseCode: '204',
      responseMessage: ''
    }))

    component.ngOnInit();
    fixture.detectChanges();

    btnClick('#information-stoken-btn');

    expect(parameterManager.sendParameters).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();

  });

  it('should open the soft token modal if access to change device option and click the continue button', () => {
    initInformation('/soft-token/change-device');

    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
    };

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('T');
    parameterManager.getParameter.withArgs('showBtnBack').and.returnValue('show');
    modalService.open.and.returnValue(modalRefMock as any);




    component.ngOnInit();
    fixture.detectChanges();

    btnClick('#information-stoken-btn');
    expect(modalService.open).toHaveBeenCalled();


  });

  it('should open the soft token modal if access to change device option and click the continue button', () => {
    initInformation('/soft-token/change-device');

    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
    };

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('D');
    parameterManager.getParameter.withArgs('showBtnBack').and.returnValue('show');
    modalService.open.and.returnValue(modalRefMock as any);


    component.ngOnInit();
    fixture.detectChanges();

    btnClick('#information-stoken-btn');
    expect(modalService.open).toHaveBeenCalled();


  });




  it('should open the soft token modal if access to change device option and click the continue button', () => {

    initInformation('/new-user/soft-token');

    const tokenModalMock: NgbModalRef = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve({
        status: 200,
        message: 'res.responseMessage',
        responseCode: '204',
        error: null
      }),
      dismissed: of('valor de prueba')
    } as NgbModalRef;


    parameterManager.getParameter.withArgs('typeToken').and.returnValue('W');
    parameterManager.getParameter.withArgs('showBtnBack').and.returnValue('show');
    modalService.open.and.returnValue(tokenModalMock);
    router.navigate.and.returnValue(new Promise(() => true));
    component.stokenPreLogin = true;
    component.ngOnInit();
    fixture.detectChanges();



    btnClick('#information-stoken-btn');
    expect(modalService.open).toHaveBeenCalled();


  });


  it('should not allowed access to migration option if the type token is D or T', () => {
    initInformation('/soft-token/migration');

    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
      dismissed:of(true)
    };

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('D');
    parameterManager.getParameter.withArgs('showBtnBack').and.returnValue('show');
    modalService.open.and.returnValue(modalRefMock as any);
    router.navigate.and.returnValue(new Promise(() => true));
    component.ngOnInit();
    fixture.detectChanges();


    const btnContinue = btnClick('#information-stoken-btn');

    expect(modalService.open).toHaveBeenCalled();
    expect(btnContinue).toBeNull();
    expect(component.allowedAccess).toBeFalse();

  });

  it('should not allowed access to change device option if the type token is S or F', () => {
    initInformation('/soft-token/change-device');

    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
    };

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('S');
    parameterManager.getParameter.withArgs('showBtnBack').and.returnValue('show');
    modalService.open.and.returnValue(modalRefMock as any);
    router.navigate.and.returnValue(new Promise(() => true));
    component.ngOnInit();
    fixture.detectChanges();


    const btnContinue = btnClick('#information-stoken-btn');

    expect(modalService.open).toHaveBeenCalled();
    expect(btnContinue).toBeNull();
    expect(component.allowedAccess).toBeFalse();

  });

  it('should not allowed access to migration option if the type token is D or T', () => {
    initInformation('/soft-token/migration-new');

    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
    };

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('D');
    parameterManager.getParameter.withArgs('showBtnBack').and.returnValue('show');
    modalService.open.and.returnValue(modalRefMock as any);
    router.navigate.and.returnValue(new Promise(() => true));
    component.ngOnInit();
    fixture.detectChanges();


    const btnContinue = btnClick('#information-stoken-btn');

    expect(modalService.open).toHaveBeenCalled();
    expect(btnContinue).toBeNull();
    expect(component.allowedAccess).toBeFalse();

  });

  it('should show an error if the response of change-device returns an error ', () => {
    component.path = 'change-device';

    const query = {
      status: 400,
      message: 'Error en respuesta de change-device',
      responseCode: '',
      error: null
    };

    fixture.detectChanges();

    component.handlerValidateToken(query);

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('Error en respuesta de change-device');

  });

  it('should show an error if the response of change-device returns an error (testing optional chaining)', () => {
    component.path = 'change-device';

    const query = {
      status: 400,
      message: null,
      responseCode: '',
      error: null
    };

    fixture.detectChanges();

    component.handlerValidateToken(query);

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('Internal_server_error');

  });

  it('should navigate to qr screen if the response of change device service is 200 (testing change device)', () => {
    router.navigate.and.returnValue(new Promise(() => true));


    component.path = 'change-device';

    const query =
    {
      status: 200,
      message: 'prueba chance device',
      responseCode: '204',
      error: null
    };

    fixture.detectChanges();

    component.handlerValidateToken(query);
    expect(router.navigate).toHaveBeenCalled();


  });

  it('should navigate to qr screen if the response of change device service is 200 (testing new user)', () => {
    router.navigate.and.returnValue(new Promise(() => true));


    component.path = 'new-user';

    const query =
    {
      status: 200,
      message: null,
      responseCode: '204',
      error: null
    };

    fixture.detectChanges();

    component.handlerValidateToken(query);
    expect(parameterManager.sendParameters).toHaveBeenCalled()


  });

  it('should navegate to home if the user click the returns button', () => {
    router.navigate.and.returnValue(new Promise(() => true));

    component.stokenPreLogin = false;
    fixture.detectChanges();

    component.back();
    expect(router.navigate).toHaveBeenCalledWith(['/home'])


  });

  it('should log out of the session if the user click the returns button', () => {
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
    router.navigate.and.returnValue(new Promise(() => true));

    component.stokenPreLogin = true;
    fixture.detectChanges();

    component.back();
    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(authenticationService.logout).toHaveBeenCalled();


  });

  it('should return an object if the assign token returns status 200', ()=> {

    const response: IAssignStknBisv = {
      responseCode: '204',
      responseMessage: 'string;'
    }

    const serviceResponse = new Subject<any>();
    develService.assignTokenType.and.returnValue(serviceResponse.asObservable())
    serviceResponse.next(response); // Emite los datos de prueba en el Subject

    const tester = component.handlerGenerateQRExecute();

    tester.subscribe(res => {
      expect(res).toEqual({ status: 200, message: 'string;', responseCode: '204', error: null});
    })

    expect(develService.assignTokenType).toHaveBeenCalled();

  });

  it('should access to migration if the user is type T with status 301', () => {
    initInformation('/soft-token/migration');

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('T');
    parameterManager.getParameter.withArgs('showBtnBack').and.returnValue('show');
    router.navigate.and.returnValue(new Promise(() => true));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.allowedAccess).toBeTrue();

  });

  it('should access to migration if the user is type F', () => {
    initInformation('/soft-token/migration');

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('F');
    parameterManager.getParameter.withArgs('showBtnBack').and.returnValue('show');
    router.navigate.and.returnValue(new Promise(() => true));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.allowedAccess).toBeTrue();

  });

  it('should set breakProcess to true and navigate to approve-stoken when stokenPreLogin is false, path is "migración", and typeToken is TYPE_SMS', async () => {

    component.stokenPreLogin = false;
    component.path = 'migration';
    parameterManager.getParameter.withArgs('typeToken').and.returnValue('F');


    const navigationPromise = Promise.resolve(true);
    router.navigate.and.returnValue(navigationPromise);


    const result = component.goToValidateOTP();
    expect(result).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/soft-token/migration/approve-stoken']);
    await navigationPromise.finally(() => {
      //expect(utils.showLoader).toHaveBeenCalled();
    });
  });

});