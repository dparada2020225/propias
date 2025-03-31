import { AdfFormBuilderService } from '@adf/components';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IConsultThirdPartyLoanMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { AttributeThirdPartyLoansTable } from '../../../../enum/third-party-loans-control-name.enum';
import { TplCrudManagerService } from '../../../../services/definition/crud/tpl-crud-manager.service';
import { ThirdPartyLoansService } from '../../../../services/transaction/third-party-loans.service';
import { ConsultThirdPartyLoansComponent } from './consult-third-party-loans.component';

describe('ConsultThirdPartyLoansComponent', () => {
  let component: ConsultThirdPartyLoansComponent;
  let fixture: ComponentFixture<ConsultThirdPartyLoansComponent>;

  let crudManagerService: jasmine.SpyObj<TplCrudManagerService>;
  let consultFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let router: jasmine.SpyObj<Router>;
  let thirdPartyLoansService: jasmine.SpyObj<ThirdPartyLoansService>;
  let sendDataAction: jasmine.SpyObj<ParameterManagementService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let location: jasmine.SpyObj<Location>;
  let parametersService: jasmine.SpyObj<ParameterManagementService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup<{
    [AttributeThirdPartyLoansTable.FILTER]: FormControl<number | null>,
  }>

  beforeEach(async () => {

    const crudManagerServiceSpy = jasmine.createSpyObj('TplCrudManagerService', ['builderConsultLoansForm'])
    const consultFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const thirdPartyLoansServiceSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['consultThirdPartyLoan'])
    const sendDataActionSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide'])
    const locationSpy = jasmine.createSpyObj('Location', ['back'])
    const parametersServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])

    await TestBed.configureTestingModule({
      declarations: [ConsultThirdPartyLoansComponent],
      providers: [
        { provide: TplCrudManagerService, useValue: crudManagerServiceSpy },
        { provide: AdfFormBuilderService, useValue: consultFormBuilderSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ThirdPartyLoansService, useValue: thirdPartyLoansServiceSpy },
        { provide: ParameterManagementService, useValue: sendDataActionSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ParameterManagementService, useValue: parametersServiceSpy },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
        FormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConsultThirdPartyLoansComponent);
    component = fixture.componentInstance;
    crudManagerService = TestBed.inject(TplCrudManagerService) as jasmine.SpyObj<TplCrudManagerService>;
    consultFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    thirdPartyLoansService = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    sendDataAction = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    parametersService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    formBuilder = TestBed.inject(FormBuilder);

    crudManagerService.builderConsultLoansForm.and.returnValue({
      attributes: []
    } as any)

    formGroup = formBuilder.group({
      filter: [0, [Validators.required]],
    })
    consultFormBuilder.formDefinition.and.returnValue(formGroup);
    component.filterForm = formGroup;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should consult Number Loan but form is not valid', () => {
    component.filterForm.reset();
    clickElement(fixture, 'adf-button.primary');
    expect(component.filterForm?.valid).toBeFalsy();
    expect(component.filterForm?.markAllAsTouched).toBeTruthy();
  })

  it('should consult Number Loan', fakeAsync(() => {
    router.navigate.and.returnValue(mockPromise(true))
    thirdPartyLoansService.consultThirdPartyLoan.and.returnValue(mockObservable(IConsultThirdPartyLoanMock))
    component.filterForm.patchValue({
      filter: 100,
    })
    clickElement(fixture, 'adf-button.primary');
    tick(4000)
    expect(sendDataAction.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledOnceWith(['/loan/third-party-loans/create'])
  }))

  it('should consult Number Loan but have error http', () => {
    thirdPartyLoansService.consultThirdPartyLoan.and.returnValue(mockObservableError({
      error: {
        message: 'Number loan not found'
      }
    }))
    component.filterForm.patchValue({
      filter: 100,
    })
    clickElement(fixture, 'adf-button.primary');
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('error')
    expect(component.messageAlert).toEqual('Number loan not found')
  })

  it('should go to back', () => {
    clickElement(fixture, 'adf-button.secondary');
    expect(parametersService.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
    })
    expect(location.back).toHaveBeenCalled();
  })

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  })

});
