import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckProfileService } from 'src/app/service/general/check-profile.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { LocalStorageServiceMock } from '../../../../assets/mocks/public/mockLocalStorageServiceMock';
import { RoutingSecurityOptionComponent } from './routing-security-option.component';

describe('RoutingSecurityOptionComponent', () => {
  let component: RoutingSecurityOptionComponent;
  let fixture: ComponentFixture<RoutingSecurityOptionComponent>;

  let modalService: jasmine.SpyObj<NgbModal>;
  let router: jasmine.SpyObj<Router>;
  let checkProfileService: jasmine.SpyObj<CheckProfileService>;
  let parameterManagemen: jasmine.SpyObj<ParameterManagementService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const securityOptionServiceSpy = jasmine.createSpyObj('SecurityOptionService', ['setProfile'])
    const checkProfileServiceSpy = jasmine.createSpyObj('CheckProfileService', ['validateUser'])
    const parameterManagemenSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide'])

    await TestBed.configureTestingModule({
      declarations: [RoutingSecurityOptionComponent],
      providers: [
        LocalStorageServiceMock,
        RoutingSecurityOptionComponent,
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SecurityOptionService, useValue: securityOptionServiceSpy },
        { provide: CheckProfileService, useValue: checkProfileServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagemenSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: StorageService, useClass: LocalStorageServiceMock },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                routingSecurityOption: {
                  body: null
                }
              }
            }
          }
        }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RoutingSecurityOptionComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    checkProfileService = TestBed.inject(CheckProfileService) as jasmine.SpyObj<CheckProfileService>;
    parameterManagemen = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    router.navigate.and.returnValue(mockPromise(true))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(parameterManagemen.sendParameters).toHaveBeenCalled()
  });

  it('should open modal have validateUserService < 0', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    checkProfileService.validateUser.and.returnValue(mockObservable({
      postponeTimes: -1
    }))
    component.open();
    expect(component.validateUserService).toEqual(-1)
    expect(modalService.open).toHaveBeenCalled()
  })

  it('should open modal have validateUserService > 0', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    checkProfileService.validateUser.and.returnValue(mockObservable({
      postponeTimes: 1
    }))
    component.open();
    expect(component.validateUserService).toEqual(1)
    expect(modalService.open).toHaveBeenCalled()
  })

  it('should open modal with have error http', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    checkProfileService.validateUser.and.returnValue(mockObservableError({ error: true }))
    component.open()
    expect(spinner.hide).toHaveBeenCalled()
    expect(modalService.open).toHaveBeenCalled()
  })

});
