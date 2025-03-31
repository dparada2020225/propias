import { AdfFormBuilderService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IConsultThirdPartyLoanMock, iLoansResponseMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { AttributeFormThirdPartyLoansCrud } from '../../../../enum/third-party-loans-control-name.enum';
import { TplCrudManagerService } from '../../../../services/definition/crud/tpl-crud-manager.service';
import { ThirdPartyLoansService } from '../../../../services/transaction/third-party-loans.service';
import { CreateThirdPartyLoansComponent } from './create-tpl.component';

describe('CreateThirdPartyLoansComponent', () => {
  let component: CreateThirdPartyLoansComponent;
  let fixture: ComponentFixture<CreateThirdPartyLoansComponent>;

  let createThirdPartyLoansManager: jasmine.SpyObj<TplCrudManagerService>;
  let tplFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let parametersService: jasmine.SpyObj<ParameterManagementService>;
  let thirdPartyLoansService: jasmine.SpyObj<ThirdPartyLoansService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let utils: jasmine.SpyObj<UtilService>;
  let router: Router
  let formBuilder: FormBuilder;
  let formGroup: FormGroup<{
    [AttributeFormThirdPartyLoansCrud.EMAIL]: FormControl<string | null>,
    [AttributeFormThirdPartyLoansCrud.ALIAS]: FormControl<string | null>,
  }>

  beforeEach(async () => {
    const createThirdPartyLoansManagerSpy = jasmine.createSpyObj('TplCrudManagerService', ['builderCreateLoansForm'])
    const tplFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const parametersServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const thirdPartyLoansServiceSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['associateNumberLoan'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader'])
    await TestBed.configureTestingModule({
      declarations: [CreateThirdPartyLoansComponent],
      providers: [
        { provide: TplCrudManagerService, useValue: createThirdPartyLoansManagerSpy },
        { provide: AdfFormBuilderService, useValue: tplFormBuilderSpy },
        { provide: ParameterManagementService, useValue: parametersServiceSpy },
        { provide: ThirdPartyLoansService, useValue: thirdPartyLoansServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: UtilService, useValue: utilsSpy },
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

    fixture = TestBed.createComponent(CreateThirdPartyLoansComponent);
    component = fixture.componentInstance;
    createThirdPartyLoansManager = TestBed.inject(TplCrudManagerService) as jasmine.SpyObj<TplCrudManagerService>;
    tplFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    parametersService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    thirdPartyLoansService = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    router = TestBed.inject(Router)
    formBuilder = TestBed.inject(FormBuilder);

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });

    createThirdPartyLoansManager.builderCreateLoansForm.and.returnValue({
      attributes: []
    } as any)

    formGroup = formBuilder.group({
      email: ['', Validators.required],
      alias: ['', Validators.required],
    })
    tplFormBuilder.formDefinition.and.returnValue(formGroup);
    component.createForm = formGroup;
    parametersService.getParameter.and.returnValue({
      thirdPartyLoan: IConsultThirdPartyLoanMock,
      identifier: '65135667'
    })

    component.thirdPartyLoanData = IConsultThirdPartyLoanMock;
    component.identifier = '65135667';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add Number Loan but for is not valid', () => {
    clickElement(fixture, 'adf-button.primary');
    expect(component.createForm.valid).toBeFalsy();
    expect(component.createForm.markAllAsTouched).toBeTruthy();
  })

  it('should add Number Loan', () => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true))
    thirdPartyLoansService.associateNumberLoan.and.returnValue(mockObservable(iLoansResponseMock))
    component.createForm.patchValue({
      email: 'foo@example.com',
      alias: 'foo'
    })
    clickElement(fixture, 'adf-button.primary');
    expect(component.createForm.valid).toBeTruthy();
    expect(parametersService.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/confirmation'])
  })

  it('should add Number Loan', () => {
    thirdPartyLoansService.associateNumberLoan.and.returnValue(mockObservableError({}))
    component.createForm.patchValue({
      email: 'foo@example.com',
      alias: 'foo'
    })
    clickElement(fixture, 'adf-button.primary');
    expect(component.createForm.valid).toBeTruthy();
    expect(component.typeAlert).toEqual('error')
    expect(component.messageAlert).toEqual('error:get_credit')
    expect(spinner.hide).toHaveBeenCalled();
  })

  it('should go to back', () => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true))

    clickElement(fixture, 'adf-button.secondary');
    expect(utils.showLoader).toHaveBeenCalled();
    expect(parametersService.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/consult'])
  })

  it('should show Spinner', () => {
    component.showSpinner();
    expect(spinner.show).toHaveBeenCalled();
  })

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  })

});
