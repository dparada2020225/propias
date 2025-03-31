import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { AuthenticationService, StorageService } from '@adf/security';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StknBisvConfirmationComponent } from './stkn-bisv-confirmation.component';

fdescribe('StknBisvConfirmationComponent', () => {
  let component: StknBisvConfirmationComponent;
  let fixture: ComponentFixture<StknBisvConfirmationComponent>;

  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let findServiceCode: jasmine.SpyObj<FindServiceCodeService>;
  let storage: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;



  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide', 'show']);
    const parameterSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const findServiceCodeSpy = jasmine.createSpyObj('FindServiceCodeService', ['validateCustomFeature']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);



    await TestBed.configureTestingModule({
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ParameterManagementService, useValue: parameterSpy },
        { provide: FindServiceCodeService, useValue: findServiceCodeSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: Router, useValue: routerSpy },
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
      declarations: [ StknBisvConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StknBisvConfirmationComponent);
    component = fixture.componentInstance;

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;

    TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    TestBed.inject(Router) as jasmine.SpyObj<Router>;


    TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    spinner.hide.and.returnValue(new Promise(() => true))


    fixture.detectChanges();
  });

  it('should create StknBisvConfirmationComponent', () => {
    expect(component).toBeTruthy();
  });

  const modalRefMock = {
    componentInstance: {
      data: true,
      allowCloseModal: true
    },
    result: Promise.resolve(false),
  };

  it('should open the log out modal when user clicks the continue button', () =>{
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
    modalService.open.and.returnValue(modalRefMock as any);
    spinner.show.and.returnValue(new Promise(() => true))


    const btn = fixture.debugElement.query(By.css('.btn-confirmation'));
    btn.triggerEventHandler('click', null);

    expect(modalService.open).toHaveBeenCalled();


  });

  it('should show the spinner', ()=>{
    spinner.show.and.returnValue(new Promise(() => true))

    component.showSpinner();

    expect(spinner.show).toHaveBeenCalled();
  });

  it('should change the description of the button', ()=>{
    parameterManager.getParameter.withArgs('typeToken').and.returnValue('W');
    component.featureFlagStokenNewUser = true;


    component.ngOnInit();


    expect(component.textButton).toEqual('agree');
  });



});