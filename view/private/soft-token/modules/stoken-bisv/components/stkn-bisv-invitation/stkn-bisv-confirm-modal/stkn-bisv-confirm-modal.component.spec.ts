import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { AuthenticationService, StorageService } from '@adf/security';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { of } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvConfirmModalComponent } from './stkn-bisv-confirm-modal.component';

fdescribe('StknBisvConfirmModalComponent', () => {
  let component: StknBisvConfirmModalComponent;
  let fixture: ComponentFixture<StknBisvConfirmModalComponent>;

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
      declarations: [ StknBisvConfirmModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StknBisvConfirmModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;


    TestBed.inject(ParameterManagementService) as jasmine.
    SpyObj<ParameterManagementService>;
    TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    TestBed.inject(Router) as jasmine.SpyObj<Router>;
    TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;


    fixture.detectChanges();
  });

  const btnClick = (name: string) =>{
    const btn = fixture.debugElement.query(By.css(`${name}`));
    if(!btn) return btn;
    btn.triggerEventHandler('click', null);
    return btn;
  };

  it('should create StknBisvConfirmModalComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal if the user clicks on the X button', ()=>{
    btnClick('#btn-X-method-stoken-bisv');

    expect(activeModal.close).toHaveBeenCalled();
  });

  const modalRefMockWarning = {
    componentInstance: {
      data: true,
      allowCloseModal: true
    },
    result: Promise.resolve('close'),
  };

  it('should open the exit modal when user clicks the Ok button', () =>{
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

    modalService.open.and.returnValue(modalRefMockWarning as any);
    authenticationService.logout.and.returnValue(of<any>(token));



    btnClick('#backBtn-info-stoken');

    expect(activeModal.close).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();
  });




});