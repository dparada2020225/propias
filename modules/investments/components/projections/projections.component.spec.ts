import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfAlertComponent, AdfButtonComponent } from '@adf/components';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomNumberPipe } from 'src/app/pipes/custom-number.pipe';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { ProjectionsExcelService } from '../../services/projections-excel.service';
import { ProjectionsPrintService } from '../../services/projections-print.service';
import { ProjectionsService } from '../../services/projections.service';
import { ProjectionsComponent } from './projections.component';

describe('ProjectionsComponent', () => {
  let component: ProjectionsComponent;
  let fixture: ComponentFixture<ProjectionsComponent>;

  let location: jasmine.SpyObj<Location>;
  let projectionsService: jasmine.SpyObj<ProjectionsService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let pdf: jasmine.SpyObj<ProjectionsPrintService>;
  let reporter: jasmine.SpyObj<ProjectionsExcelService>;

  beforeEach(async () => {
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const routerSpy = jasmine.createSpyObj('Router', ['router']);
    const projectionsServiceSpy = jasmine.createSpyObj('ProjectionsService', ['getDataByAccount', 'buildInformationHelper']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const pdfSpy = jasmine.createSpyObj('ProjectionsPrintService', ['pdfGenerate']);
    const reporterSpy = jasmine.createSpyObj('ProjectionsExcelService', ['generate']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const businessNameServiceSpy = jasmine.createSpyObj('BusinessNameService', ['getBusiness', 'accountNumber']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'getMenuEquivalence']);
    await TestBed.configureTestingModule({
      declarations: [ProjectionsComponent, MockTranslatePipe, AdfAlertComponent, AdfButtonComponent, CustomNumberPipe],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: mockObservable({}),
          },
        },
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ProjectionsService, useValue: projectionsServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ProjectionsPrintService, useValue: pdfSpy },
        { provide: ProjectionsExcelService, useValue: reporterSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: BusinessNameService, useValue: businessNameServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
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

    fixture = TestBed.createComponent(ProjectionsComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    projectionsService = TestBed.inject(ProjectionsService) as jasmine.SpyObj<ProjectionsService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    pdf = TestBed.inject(ProjectionsPrintService) as jasmine.SpyObj<ProjectionsPrintService>;
    reporter = TestBed.inject(ProjectionsExcelService) as jasmine.SpyObj<ProjectionsExcelService>;

    spinner.show.and.returnValue(mockPromise(true));
    spinner.hide.and.returnValue(mockPromise(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on Change Account when isLoading = false', () => {
    component.isLoading = false;
    const data = {
      reference: 'oidasoijy',
      name: 'test',
      mask: '',
      alias: 'test',
      total: {
        currency: '',
      },
    };
    const event = { account: '354154', alias: 'myAccount', enabled: false, currency: 'USD' };

    projectionsService.getDataByAccount.and.returnValue(mockObservable(data));

    component.onChangeAccount(event);

    expect(spinner.show).toHaveBeenCalled();
    expect(component.authorization).toEqual(data.reference);
    expect(projectionsService.getDataByAccount).toHaveBeenCalledWith(event.account);
    expect(component.empty).toBeFalsy();
    expect(projectionsService.buildInformationHelper).toHaveBeenCalledWith(component.information);
  });

  it('should call on Change Account but projectionsService have error', () => {
    const event = { account: '354154', alias: 'myAccount', enabled: false, currency: 'USD' };

    projectionsService.getDataByAccount.and.returnValue(mockObservableError({}));

    component.onChangeAccount(event);

    expect(component.empty).toBeTruthy();
    expect(component.information).toEqual({});
  });

  it('should go back', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should import as csv', () => {
    component.information = {
      movements: '',
      accountDetail: {
        account: '554',
      },
    };

    component.isLoading = false;
    component.empty = false;

    fixture.detectChanges();

    clickElement(fixture, 'i.banca-regional-csv');
    fixture.detectChanges();
    expect(reporter.generate).toHaveBeenCalled();
  });

  it('should import as xlsx', () => {
    component.information = {
      movements: '',
      accountDetail: {
        account: '554',
      },
    };

    component.isLoading = false;
    component.empty = false;

    fixture.detectChanges();

    clickElement(fixture, 'i.banca-regional-xls');
    fixture.detectChanges();
    expect(reporter.generate).toHaveBeenCalled();
  });

  it('should import as pdf', () => {
    component.information = {
      movements: '',
      accountDetail: {
        account: '554',
      },
    };

    component.isLoading = false;
    component.empty = false;

    fixture.detectChanges();

    clickElement(fixture, 'a');
    fixture.detectChanges();
    expect(pdf.pdfGenerate).toHaveBeenCalled();
  });

  it('should export as but report type not defined', () => {
    spyOn(console, 'warn');

    component.exportAs(null as any);

    expect(console.warn).toHaveBeenCalledWith('report type not defined');
  });
});
