import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { clickElement, getText, mockPromise } from 'src/assets/testing';
import { SpHomeDashboardComponent } from './sp-home-dashboard.component';

describe('SpHomeDashboardComponent', () => {
  let component: SpHomeDashboardComponent;
  let fixture: ComponentFixture<SpHomeDashboardComponent>;

  let modalService: jasmine.SpyObj<NgbModal>;
  let utils: jasmine.SpyObj<UtilService>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['getTokenType'])
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      declarations: [SpHomeDashboardComponent, AdfComponentsComponent, TranslatePipe],
      providers: [
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SpHomeDashboardComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    parameterManagementService.getParameter.and.returnValue({ errorLimitsMessage: 'message error' })

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go To Security Profile Default', () => {
    spyOn(component.hiddenMainScreen, 'emit')
    clickElement(fixture, 'securityProfile', true)
    fixture.detectChanges();
    expect(component.typeAlert).toEqual('')
    expect(component.messageAlert).toEqual('')
    expect(parameterManagementService.sendParameters).toHaveBeenCalledWith({
      errorLimitsMessage: null,
    })
    expect(component.hiddenMainScreen.emit).toHaveBeenCalledWith(false);
  })

  it('should handle Validate Open Token Modal', () => {
    component.isAllowedShowLimits = true;
    router.navigate.and.returnValue(mockPromise(true))
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    clickElement(fixture, 'handleValidate', true);
    fixture.detectChanges();
    expect(component.typeAlert).toEqual('')
    expect(component.messageAlert).toEqual('')
    expect(modalService.open).toHaveBeenCalled()
    expect(utils.getTokenType).toHaveBeenCalled()
    expect(parameterManagementService.sendParameters).toHaveBeenCalled()
  })

  it('should have title <h1>title:security-profile-home</h1>', () => {
    const test = getText(fixture, 'h1.sp-title');
    fixture.detectChanges();
    expect(test).toEqual('title:security-profile-home')
  })

  it('should have description <p>description:security-profile-home</p>', () => {
    const test = getText(fixture, 'p.description');
    fixture.detectChanges();
    expect(test).toEqual('description:security-profile-home')
  })

});
