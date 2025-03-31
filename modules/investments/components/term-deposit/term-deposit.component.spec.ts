import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfAlertComponent, AdfButtonComponent } from '@adf/components';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { getText, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { ProjectionsService } from '../../services/projections.service';
import { TermDepositService } from '../../services/term-deposit.service';
import { TermDepositComponent } from './term-deposit.component';

describe('TermDepositComponent', () => {
  let component: TermDepositComponent;
  let fixture: ComponentFixture<TermDepositComponent>;

  let location: jasmine.SpyObj<Location>;
  let termDepositService: jasmine.SpyObj<TermDepositService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let projectionsService: jasmine.SpyObj<ProjectionsService>;

  beforeEach(async () => {
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const routerSpy = jasmine.createSpyObj('Router', ['router']);
    const termDepositServiceSpy = jasmine.createSpyObj('TermDepositService', ['getDataByAccount']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const businessNameServiceSpy = jasmine.createSpyObj('BusinessNameService', ['getBusiness', 'accountNumber']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'getMenuEquivalence']);
    const projectionsServiceSpy = jasmine.createSpyObj('ProjectionsService', ['buildInformationHelper']);

    await TestBed.configureTestingModule({
      declarations: [TermDepositComponent, AdfAlertComponent, AdfButtonComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: mockObservable({}),
          },
        },
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy },

        { provide: TermDepositService, useValue: termDepositServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: BusinessNameService, useValue: businessNameServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: ProjectionsService, useValue: projectionsServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TermDepositComponent);
    component = fixture.componentInstance;

    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    termDepositService = TestBed.inject(TermDepositService) as jasmine.SpyObj<TermDepositService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    projectionsService = TestBed.inject(ProjectionsService) as jasmine.SpyObj<ProjectionsService>;

    parameterManagement.getMenuEquivalence.and.returnValue('true');
    spinner.show.and.returnValue(mockPromise(true));
    spinner.hide.and.returnValue(mockPromise(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onChangeAccount when account changes and isLoading = false', () => {
    const event = 'event';
    component.isLoading = false;

    termDepositService.getDataByAccount.and.returnValue(mockObservable({}));

    fixture.detectChanges();

    component.onChangeAccount(event);

    expect(spinner.show).toHaveBeenCalled();
    expect(termDepositService.getDataByAccount).toHaveBeenCalledWith(event);
    expect(component.empty).toBeFalsy();
    expect(projectionsService.buildInformationHelper).toHaveBeenCalledWith(component.information);
  });

  it('should call onChangeAccount but service have error http', () => {
    const event = 'event';
    component.isLoading = true;
    termDepositService.getDataByAccount.and.returnValue(mockObservableError({}));
    fixture.detectChanges();
    component.onChangeAccount(event);
    expect(component.empty).toBeTruthy();
    expect(component.information).toEqual({});
  });

  it('shoulg go back', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should title have title label.term-deposit.investment ', () => {
    const title = getText(fixture, 'h1.title');
    expect(title).toEqual('label.term-deposit.investment');
  });

  it('should subtitle have subtitle label.term-deposit.account-balance', () => {
    const title = getText(fixture, 'h2.subtitle');
    expect(title).toEqual('label.term-deposit.account-balance');
  });
});
