import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationService, StorageService } from '@adf/security';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { EProfile } from 'src/app/enums/profile.enum';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { CheckProfileService } from 'src/app/service/general/check-profile.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { PrivateMainFrameService } from 'src/app/service/private-main/private-main-frame.service';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { LocalStorageServiceMock } from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import { clickElement } from 'src/assets/testing';
import { mockModal } from '../../../../assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { SecurityOptionComponent } from './security-option.component';

describe('SecurityOptionComponent', () => {
  let component: SecurityOptionComponent;
  let fixture: ComponentFixture<SecurityOptionComponent>;

  let modalService: jasmine.SpyObj<NgbModal>;
  let privateMainframService: jasmine.SpyObj<PrivateMainFrameService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const securityOptionServiceSpy = jasmine.createSpyObj('SecurityOptionService', ['getProfile'])
    const privateMainframServiceSpy = jasmine.createSpyObj('PrivateMainFrameService', ['send'])
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', [''])
    const checkProfileServiceSpy = jasmine.createSpyObj('CheckProfileService', [''])
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication'])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter'])
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot'])
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot'])

    await TestBed.configureTestingModule({
      declarations: [SecurityOptionComponent, TranslatePipe],
      providers: [
        SecurityOptionComponent,
        LocalStorageServiceMock,
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: SecurityOptionService, useValue: securityOptionServiceSpy },
        { provide: PrivateMainFrameService, useValue: privateMainframServiceSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: CheckProfileService, useValue: checkProfileServiceSpy },
        { provide: StyleManagementService, useValue: styleManagementSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                securityOption: {
                  body: 'body'
                },
                phoneCompanies: {},
                passwordPeriod: {},
                type: '1'
              }
            }
          }
        },
        { provide: StorageService, useClass: LocalStorageServiceMock }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SecurityOptionComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    privateMainframService = TestBed.inject(PrivateMainFrameService) as jasmine.SpyObj<PrivateMainFrameService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    activatedRoute.snapshot.data = {
      type: 4
    }
    parameterManager.getParameter.and.returnValue({ profile: EProfile.SALVADOR })
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select Configuration Type 1', () => {
    activatedRoute.snapshot.data = {
      type: 1
    }
    component.selectConfigurationType()
    expect(component.configurationType).toEqual(1);
    expect(component.tab).toEqual('passwordPeriod')
    expect(privateMainframService.send).toHaveBeenCalledWith(false)
  })

  it('should select Configuration Type 2', () => {
    activatedRoute.snapshot.data = {
      type: 2
    }
    component.selectConfigurationType()
    expect(component.configurationType).toEqual(2);
    expect(component.tab).toEqual('changePassword')
    expect(privateMainframService.send).toHaveBeenCalledWith(false)
  })

  it('should select Configuration Type 3', () => {
    activatedRoute.snapshot.data = {
      type: 3
    }
    component.selectConfigurationType()
    expect(component.configurationType).toEqual(3);
    expect(component.tab).toEqual('changePassword')
    expect(component.isShowMainScreen).toBeFalsy()
  })

  it('should changeTab with changePassword', () => {
    component.configurationType = 2;
    fixture.detectChanges();

    clickElement(fixture, 'changePassword', true);
    fixture.detectChanges();
    expect(component.tab).toEqual('changePassword')
  })

  it('should changeTab with passwordPeriod', () => {
    component.configurationType = 1;
    fixture.detectChanges();

    clickElement(fixture, 'passwordPeriod', true);
    fixture.detectChanges();
    expect(component.tab).toEqual('passwordPeriod')
  })

  it('should changeTab with personalInfo', () => {
    component.configurationType = 1;
    fixture.detectChanges();

    clickElement(fixture, 'personalInfo', true);
    fixture.detectChanges();
    expect(component.tab).toEqual('personalInfo')
  })

  it('should get Value From Home Main Screen', () => {
    expect(component.isShowMainScreen).toBeFalsy()
    component.getValueFromHomeMainScreen(true)
    expect(component.isShowMainScreen).toBeTruthy()
  })

  it('should update profile', () => {

    const oldData = {
      code: 123,
      decription: 'Test profile',
      status: 'active',
      registrationRequired: 'yes',
      phone: '555-555-5555',
      codeOperator: 'ABC123',
      email: 'test@example.com',
      lastConnectionDate: '2021-01-01',
      hasPendings: 'no',
      managedUser: 'yes',
      periodChangePassword: '12',
      profile: 'admin',
      userType: 'user',
      error: null
    };

    const newData = {
      code: 321,
      decription: 'Profile Test',
      status: 'wrong',
      registrationRequired: 'no',
      phone: '666-666-666',
      codeOperator: 'CBD789',
      email: 'test2@example2.com',
      lastConnectionDate: '2023-04-01',
      hasPendings: 'yes',
      managedUser: 'no',
      periodChangePassword: '06',
      profile: 'user',
      userType: 'admin',
      error: null
    }

    //component.profile = oldData
    //expect(component.profile).toEqual(oldData)
    component.onDataUpdate(newData as any)
    //expect(component.profile).toEqual(newData)

  })

  it('should validate Is Show Main Screen', () => {
    const res = component.validateIsShowMainScreen
    expect(res).toBeFalsy();
  })

  it('should open modal', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    component.openModal();
    expect(modalService.open).toHaveBeenCalled();
  })

});
