import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AdfButtonComponent, AdfFormBuilderService } from '@adf/components';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iB2bPaymentStateMock, iPaymentAccountDetailMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { iAccount } from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { EB2bPaymentView } from '../../enum/b2b-payment-view.enum';
import { B2bdPaymentManagerDefinitionService } from '../../service/definition/b2bd-payment-manager-definition.service';
import { B2bPaymentService } from '../../service/transction/b2b-payment.service';
import { B2bPaymentFormComponent } from './b2b-payment-form.component';

describe('B2bPaymentFormComponent', () => {
  let component: B2bPaymentFormComponent;
  let fixture: ComponentFixture<B2bPaymentFormComponent>;

  let managerDefinition: jasmine.SpyObj<B2bdPaymentManagerDefinitionService>;
  let adfFormDefinition: jasmine.SpyObj<AdfFormBuilderService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let location: jasmine.SpyObj<Location>;
  let utils: jasmine.SpyObj<UtilService>;
  let router: jasmine.SpyObj<Router>;
  let paymentTransaction: jasmine.SpyObj<B2bPaymentService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup<{
    paymentBalance: FormControl<string | null>,
    accountDebited: FormControl<string | null>,
  }>

  beforeEach(async () => {

    const managerDefinitionSpy = jasmine.createSpyObj('B2bdPaymentManagerDefinitionService', ['buildFormLayout'])
    const adfFormDefinitionSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const locationSpy = jasmine.createSpyObj('Location', ['back'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader', 'scrollToTop'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const paymentTransactionSpy = jasmine.createSpyObj('B2bPaymentService', ['getB2bAccountDetail'])

    await TestBed.configureTestingModule({
      declarations: [B2bPaymentFormComponent, AdfButtonComponent],
      providers: [
        { provide: B2bdPaymentManagerDefinitionService, useValue: managerDefinitionSpy },
        { provide: AdfFormBuilderService, useValue: adfFormDefinitionSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: Location, useValue: locationSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: Router, useValue: routerSpy },
        { provide: B2bPaymentService, useValue: paymentTransactionSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                view: EB2bPaymentView.DEFAULT,
                sourceAccounts: [iAccount]
              }
            }
          }
        },
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

    fixture = TestBed.createComponent(B2bPaymentFormComponent);
    component = fixture.componentInstance;

    managerDefinition = TestBed.inject(B2bdPaymentManagerDefinitionService) as jasmine.SpyObj<B2bdPaymentManagerDefinitionService>;
    adfFormDefinition = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    paymentTransaction = TestBed.inject(B2bPaymentService) as jasmine.SpyObj<B2bPaymentService>;
    formBuilder = TestBed.inject(FormBuilder);


    managerDefinition.buildFormLayout.and.returnValue({
      attributes: []
    } as any)

    formGroup = formBuilder.group({
      paymentBalance: ['', [Validators.required]],
      accountDebited: ['', [Validators.required]],
    })

    adfFormDefinition.formDefinition.and.returnValue(formGroup)

    parameterManagement.getParameter.and.returnValue(iB2bPaymentStateMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the next step but form is not valid', () => {
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(component.form.markAllAsTouched).toBeTruthy();
    expect(component.form.valid).toBeFalsy();
    expect(utils.scrollToTop).toHaveBeenCalled();
  })

  it('should go to the next step', fakeAsync(() => {
    router.navigate.and.returnValue(mockPromise(true))
    component.form.patchValue({
      accountDebited: '77868542'
    })
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick(4000);
    expect(utils.showLoader).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/loan/payment/confirmation'])
  }))

  it('should go to the next step', fakeAsync(() => {
    router.navigate.and.returnValue(mockPromise(true))
    paymentTransaction.getB2bAccountDetail.and.returnValue(mockObservable(iPaymentAccountDetailMock))
    component.paymentDetail!.paymentBalance = '65648486512'
    component.form.patchValue({
      paymentBalance: 10101010,
      accountDebited: '77868542'
    })
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick(4000);
    expect(utils.showLoader).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/loan/payment/confirmation'])
  }))

  it('should go to the next step but have error', () => {
    paymentTransaction.getB2bAccountDetail.and.returnValue(mockObservableError({

    }))
    component.paymentDetail!.paymentBalance = '65648486512'
    component.form.patchValue({
      paymentBalance: 10101010,
      accountDebited: '77868542'
    })
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(component.typeAlert).toEqual('error')
    expect(component.messageAlert).toEqual('errorB2B:get_accountDetail')
  })

  it('should go to the prev Step', () => {
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    })
    expect(location.back).toHaveBeenCalled();
  })

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  })

});
